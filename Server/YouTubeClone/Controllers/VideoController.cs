using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using YouTubeClone.Data;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;
using YouTubeClone.Services;

namespace YouTubeClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly YouTubeContext context;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment env;

        public VideoController(YouTubeContext context, IMapper mapper, IWebHostEnvironment env)
        {
            this.context = context;
            this.mapper = mapper;
            this.env = env;
        }

        public class PostVideoDto
        {
            public int UserId { get; set; }
            public string UserSecret { get; set; }
            public string Text { get; set; }
            public int PlaylistId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public bool Shown { get; set; }
            public bool Featured { get; set; }
        }

        /// <summary>
        /// Get a channel's videos
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     GET /api/video/channel/3
        /// 
        /// </remarks>
        [HttpGet("channel/{channelId}")]
        public async Task<ActionResult<IEnumerable<VideoDto>>> GetChannelVideos(int channelId)
        {
            var videos = await context.Video
                .Where(v => v.Shown)
                .Include(v => v.UserVideoViews)
                .ThenInclude(v => v.User)
                .Include(v => v.UserVideoReactions)
                .ThenInclude(r => r.User)
                .Include(v => v.UserVideoComments)
                .ThenInclude(v => v.User)
                .Include(v => v.Author)
                .Where(v => v.Author.Id == channelId)
                .OrderByDescending(v => v.UploadDate)
                .ThenByDescending(v => v.UserVideoViews.Count)
                .ThenByDescending(v => v.UserVideoReactions.Count)
                .ThenByDescending(v => v.UserVideoComments.Count)
                .ToListAsync();

            videos.ForEach(v => v.Author.Name = GetChannelName(v));
            return videos.Select(v => mapper.Map<VideoDto>(v)).ToList();
        }

        /// <summary>
        /// Get list of videos by keyword search
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     GET /api/video/search?q=hello+world?p=2
        /// 
        /// p is optional and defaults to 1
        /// </remarks>      
        [HttpGet("search")]
        public async Task<ActionResult> GetVideosFromSearch([FromQuery] string q, [FromQuery] int p = 1)
        {
            //var keywords = q != null? q.ToLower().Split() : new string[] { "." };

            //var regexBody = keywords.Aggregate((current, next) => current + "|" + next);
            //var regex = new Regex("(" + regexBody + ")");

            var videos = await context.Video
                .Where(v => v.Shown && (q == null || v.Title.ToLower().Contains(q.ToLower())))
                .Include(v => v.Author)
                .Include(v => v.UserVideoReactions)
                .ThenInclude(r => r.User)
                .Include(v => v.UserVideoComments)
                .ThenInclude(v => v.User)
                .Include(v => v.UserVideoViews)
                .ThenInclude(v => v.User)
                .OrderByDescending(v => v.UploadDate)
                .ThenByDescending(v => v.UserVideoViews.Count)
                .ThenByDescending(v => v.UserVideoReactions.Count)
                .ThenByDescending(v => v.UserVideoComments.Count)
                .ToListAsync();

            //videos = videos.Where(v => regex.IsMatch(v.Title.ToLower())).ToList();

            videos.ForEach(v => v.Author.Name = GetChannelName(v));

            var page = videos.Select(v => mapper.Map<VideoDto>(v))
                .ToList()
                .Skip((p - 1) * 10)
                .Take(10);
                
            return Ok(new {
                PagesCount = Math.Ceiling(videos.Count / 10.0),
                Videos = page
            });
        }

        /// <summary>
        /// Get list of videos by keyword search
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     GET /api/video/trending
        /// 
        /// </remarks>      
        [HttpGet("trending")]
        public async Task<ActionResult<IEnumerable<VideoDto>>> GetVideosFromTrending()
        {
            var videos = await context.Video
                .Where(v => v.Shown)
                .Include(v => v.UserVideoViews)
                .ThenInclude(r => r.User)
                .Include(v => v.UserVideoReactions)
                .ThenInclude(r => r.User)
                .Include(v => v.UserVideoComments)
                .ThenInclude(v => v.User)
                .OrderByDescending(v => v.UserVideoViews.Count)
                .ThenByDescending(v => v.UserVideoReactions.Count)
                .ThenByDescending(v => v.UserVideoComments.Count)
                .ThenByDescending(v => v.UploadDate)
                .Take(10)
                .Include(v => v.Author)
                .ToListAsync();

            videos.ForEach(v => v.Author.Name = GetChannelName(v));

            var result = videos.Select(v => mapper.Map<VideoDto>(v)).ToList();

            return result;
        }

        /// <summary>
        /// Get videos from subscribed channels
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/video/from-subscriptions?p=2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// 
        /// p is optional and defaults to 1
        /// </remarks>
        [HttpPost("from-subscriptions")]
        public async Task<ActionResult> GetVideosFromSubscriptions([FromBody] PostVideoDto postVideoDto, [FromQuery] int p = 1)
        {
            var user = await context.User
                .Include(u => u.Subscriptions)
                .ThenInclude(us => us.Channel)
                .ThenInclude(c => c.Videos)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId && u.Secret == Guid.Parse(postVideoDto.UserSecret));

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var subscriptionsIds = user.Subscriptions.Select(us => us.Channel.Id);

            var videos = await context.Video
                .Include(v => v.Author)
                .Where(v => subscriptionsIds.Contains(v.Author.Id) && v.Shown)
                .Include(v => v.UserVideoViews)
                .ThenInclude(r => r.Video)
                .Include(v => v.UserVideoReactions)
                .ThenInclude(r => r.User)
                .Include(v => v.UserVideoComments)
                .ThenInclude(v => v.User)
                .OrderByDescending(v => v.UploadDate)
                .ThenByDescending(v => v.UserVideoViews.Count)
                .ThenByDescending(v => v.UserVideoReactions.Count)
                .ThenByDescending(v => v.UserVideoComments.Count)
                .ToListAsync();

            videos.ForEach(v => v.Author.Name = GetChannelName(v));

            var page = videos.Select(v => mapper.Map<VideoDto>(v))
                .ToList()
                .Skip((p - 1) * 10)
                .Take(10);

            return Ok(new
            {
                PagesCount = Math.Ceiling(videos.Count / 10.0),
                Videos = page
            });
        }

        /// <summary>
        /// Get a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     GET /api/video/4
        /// 
        /// </remarks>
        [HttpGet("{id}")]
        public async Task<ActionResult<VideoDto>> GetVideo(int id)
        {
            var videoById = await context.Video
                .Include(v => v.Author)
                .Include(v => v.UserVideoReactions)
                .ThenInclude(r => r.User)
                .Include(v => v.UserVideoComments)
                .ThenInclude(v => v.User)
                .Include(v => v.UserVideoViews)
                .ThenInclude(v => v.User)
                .FirstOrDefaultAsync(v => v.Id == id && v.Shown);

            videoById.Author.Name = GetChannelName(videoById);

            if (videoById == null)
            {
                return NotFound();
            }

            return mapper.Map<VideoDto>(videoById);
        }

        /// <summary>
        /// Get Video Stream
        /// 
        /// UserId and UserSecrets are OPTIONAL.
        /// </summary>
        [HttpGet("stream/{id}")]
        public async Task<ActionResult> GetVideoStream(int id, [FromQuery] int? userId, [FromQuery] string userSecret)
        {
            var videoById = await context.Video
                .FirstOrDefaultAsync(v => v.Id == id);

            if (videoById == null)
            {
                return NotFound();
            }

            var user = (userId == null)? null : await context.User
               .FirstOrDefaultAsync(u => u.Id == userId && u.Secret == Guid.Parse(userSecret));

            context.UserVideoViews.Add(new UserVideoView { User = user, Video = videoById, DateTime = DateTime.Now });
            await context.SaveChangesAsync();

            FileStream content = System.IO.File.OpenRead(videoById.Url);
            var response = File(content, "application/octet-stream");
            return response;
        }

        [HttpGet("image-stream/{id}")]
        public async Task<ActionResult> GetImageStream(int id)
        {
            var videoById = await context.Video
                .FirstOrDefaultAsync(v => v.Id == id);

            if (videoById == null)
            {
                return NotFound();
            }

            FileStream content = System.IO.File.OpenRead(videoById.ThumbnailUrl);
            var response = File(content, "application/octet-stream");
            return response;
        }

        /// <summary>
        /// Upload a video (without its details)
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/video/upload?userId=0&userSecret=secret, video.mp4, image.jpg
        ///     {
        ///         "Content-Type": "multipart/form-data"
        ///     }
        /// </remarks>
        [HttpPost("upload")]
        public async Task<ActionResult<VideoDto>> PostVideo([FromQuery] int userId, [FromQuery] string userSecret, IFormCollection files)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }

            if (files.Files.Count < 2)
            {
                return BadRequest("At least two files should be attached.");
            }

            string imagePath = null;
            string videoPath = null;
            for (int i = 0; i < 2; i++)
            {
                if (FileIsImage(files.Files.ElementAt(i)))
                {
                    imagePath = await HelperFunctions.AddFileToSystemAsync(files.Files.ElementAt(i), env);
                }
                else
                {
                    videoPath = await HelperFunctions.AddFileToSystemAsync(files.Files.ElementAt(i), env);
                }
            }

            var video = new Video { 
                Author = user.Channel, 
                ThumbnailUrl = imagePath,
                Url = videoPath,
                UploadDate = DateTime.Now
            };
            await context.Video.AddAsync(video);
            await context.SaveChangesAsync();

            return mapper.Map<VideoDto>(video);
        }

        /// <summary>
        /// Update a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     PUT /api/video/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "Title": "",
        ///             "Description": "",
        ///             "Featured": false,
        ///             "Shown": false,
        ///         }
        ///     }
        /// </remarks>
        [HttpPut("{id}")]
        public async Task<ActionResult<VideoDto>> UpdateVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var originalVideo = await context.Video
                .Include(v => v.Author)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (originalVideo.Author != user.Channel)
            {
                return Unauthorized();
            }

            originalVideo
                .SetTitle(postVideoDto.Title)
                .SetDescription(postVideoDto.Description)
                .SetFeatured(postVideoDto.Featured)
                .SetShown(postVideoDto.Shown);

            await context.SaveChangesAsync();

            return mapper.Map<VideoDto>(originalVideo);
        }

        /// <summary>
        /// Delete a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     DELETE /api/video/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video
                .Include(v => v.Author)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (video.Author != user.Channel)
            {
                return Unauthorized();
            }

            context.Video.Remove(video);
            await context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Show a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     PUT /api/video/show/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPut("show/{id}")]
        public async Task<ActionResult> ShowVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video
                .Include(v => v.Author)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (video.Author != user.Channel)
            {
                return Unauthorized();
            }

            video.Shown = true;
            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Hide a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     PUT /api/video/hide/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPut("hide/{id}")]
        public async Task<ActionResult> HideVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video
                .Include(v => v.Author)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (video.Author != user.Channel)
            {
                return Unauthorized();
            }

            video.Shown = false;
            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Like a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     PUT /api/video/like/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPut("like/{id}")]
        public async Task<ActionResult<VideoDto>> LikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User.FindAsync(postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            var userVideoReaction = await context.UserVideoReaction
                .Include(uvr => uvr.User)
                .Include(uvr => uvr.Video)
                .FirstOrDefaultAsync(uvr => uvr.User == user && uvr.Video == video);

            if (userVideoReaction == null)
            {
                userVideoReaction = new UserVideoReaction { User = user, Video = video, Like = true };
                await context.UserVideoReaction.AddAsync(userVideoReaction);
            }
            else
            {
                userVideoReaction.Like = true;
            }

            await context.SaveChangesAsync();

            return mapper.Map<VideoDto>(video);
        }

        /// <summary>
        /// Undo like a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/video/undolike/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPost("undolike/{id}")]
        public async Task<ActionResult<VideoDto>> UndoLikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User.FindAsync(postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            var userVideoReaction = await context.UserVideoReaction
                .Include(uvr => uvr.User)
                .Include(uvr => uvr.Video)
                .FirstOrDefaultAsync(uvr => uvr.User == user && uvr.Video == video && uvr.Like);

            if (userVideoReaction != null)
            {
                context.UserVideoReaction.Remove(userVideoReaction);
                await context.SaveChangesAsync();
            }

            return mapper.Map<VideoDto>(video);
        }

        /// <summary>
        /// Dislike a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     PUT /api/video/dislike/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPut("dislike/{id}")]
        public async Task<ActionResult<VideoDto>> DislikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User.FindAsync(postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            var userVideoReaction = await context.UserVideoReaction
                .Include(uvr => uvr.User)
                .Include(uvr => uvr.Video)
                .FirstOrDefaultAsync(uvr => uvr.User == user && uvr.Video == video);

            if (userVideoReaction == null)
            {
                userVideoReaction = new UserVideoReaction { User = user, Video = video, Like = false };
                await context.UserVideoReaction.AddAsync(userVideoReaction);
            }
            else
            {
                userVideoReaction.Like = false;
            }

            await context.SaveChangesAsync();

            return mapper.Map<VideoDto>(video);
        }

        /// <summary>
        /// Undo dislike a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/video/undodislike/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPost("undodislike/{id}")]
        public async Task<ActionResult<VideoDto>> UndoDislikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User.FindAsync(postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            var userVideoReaction = await context.UserVideoReaction
                .Include(uvr => uvr.User)
                .Include(uvr => uvr.Video)
                .FirstOrDefaultAsync(uvr => uvr.User == user && uvr.Video == video && !uvr.Like);

            if (userVideoReaction != null)
            {
                context.UserVideoReaction.Remove(userVideoReaction);
                await context.SaveChangesAsync();
            }

            return mapper.Map<VideoDto>(video);
        }

        /// <summary>
        /// Add a video to WatchLater
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/video/addtowatchlater/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPost("addtowatchlater/{id}")]
        public async Task<ActionResult> AddToWatchLater(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
                .Include(u => u.WatchLater)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            var videoFromWatchLater = user.WatchLater.FirstOrDefault(uv => uv.Video == video);

            if (videoFromWatchLater == null)
            {
                await context.UserVideoWatchLater.AddAsync(new UserVideoWatchLater { User = user, Video = video });
                await context.SaveChangesAsync();
            }

            return Ok();
        }

        /// <summary>
        /// Report a video
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/video/reportvideo/2
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "Text": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPost("reportvideo/{id}")]
        public async Task<ActionResult> ReportVideo(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
               .Include(u => u.UserVideoReports)
               .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(id);
            if (video == null)
            {
                return NotFound();
            }

            var prevVideoReport = user.UserVideoReports.FirstOrDefault(uv => uv.Video == video);

            if (prevVideoReport == null)
            {
                await context.UserVideoReport.AddAsync(new UserVideoReport { User = user, Video = video, Reason = postVideoDto.Text });
                await context.SaveChangesAsync();
            }

            return Ok();
        }

        /// <summary>
        /// Get a list of recommended videos
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     GET /api/videos/recommendation?channelId=1
        /// 
        /// </remarks>
        /// <param name="channelId">OPIONAL. Case of null, latest videos across channels are returned.</param>
        [HttpGet("recommendation")]
        public async Task<ActionResult<IEnumerable<VideoDto>>> GetRecommendedVideos([FromQuery] int? channelId)
        {
            if (channelId == null)
            {
                var videos = await context.Video
                    .Where(v => v.Shown)
                    .Include(v => v.UserVideoViews)
                    .ThenInclude(r => r.User)
                    .Include(v => v.UserVideoReactions)
                    .ThenInclude(r => r.User)
                    .Include(v => v.UserVideoComments)
                    .ThenInclude(v => v.User)
                    .Include(v => v.Author)
                    .OrderByDescending(v => v.UploadDate)
                    .ThenByDescending(v => v.UserVideoViews.Count)
                    .ThenByDescending(v => v.UserVideoReactions.Count)
                    .ThenByDescending(v => v.UserVideoComments.Count)
                    .Take(10)
                    .ToListAsync();

                videos.ForEach(v => v.Author.Name = GetChannelName(v));
                return videos.Select(v => mapper.Map<VideoDto>(v)).ToList();
            }
            else
            {
                var videos = await context.Video
                      .Where(v => v.Shown)
                      .Include(v => v.UserVideoViews)
                      .ThenInclude(r => r.User)
                      .Include(v => v.UserVideoReactions)
                      .ThenInclude(r => r.User)
                      .Include(v => v.UserVideoComments)
                      .ThenInclude(v => v.User)
                      .Include(v => v.Author)
                      .Where(v => v.Author.Id == channelId)
                      .OrderByDescending(v => v.UploadDate)
                      .ThenByDescending(v => v.UserVideoViews.Count)
                      .ThenByDescending(v => v.UserVideoReactions.Count)
                      .ThenByDescending(v => v.UserVideoComments.Count)
                      .Take(10)
                      .ToListAsync();

                if (videos.Count != 10)
                {
                    var extraVideos = await context.Video
                        .Where(v => !videos.Contains(v) && v.Shown)
                        .Include(v => v.UserVideoViews)
                        .ThenInclude(r => r.User)
                        .Include(v => v.UserVideoReactions)
                        .ThenInclude(r => r.User)
                        .Include(v => v.UserVideoComments)
                        .ThenInclude(v => v.User)
                        .Include(v => v.Author)
                        .OrderByDescending(v => v.UploadDate)
                        .ThenByDescending(v => v.UserVideoViews.Count)
                        .ThenByDescending(v => v.UserVideoReactions.Count)
                        .ThenByDescending(v => v.UserVideoComments.Count)
                        .Take(10 - videos.Count)
                        .ToListAsync();

                    videos.AddRange(extraVideos);
                }

                videos.ForEach(v => v.Author.Name = GetChannelName(v));

                return videos.Select(v => mapper.Map<VideoDto>(v)).ToList();
            }
        }

        private bool FileIsImage(IFormFile file) => file.ContentType.ToLower().IndexOf("image") != -1;

        private string GetChannelName(Video v)
        {
            var user = context.User.FirstOrDefault(u => u.Channel.Id == v.Author.Id);

            return user.FirstName + " " + user.LastName;
        }
    }
}
