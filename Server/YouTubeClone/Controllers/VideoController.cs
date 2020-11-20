using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            public IFormCollection Video { get; set; }
            public IFormCollection Thubmnail { get; set; }
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
                .Where(v => v.Author.Id == channelId)
                .Select(v => mapper.Map<VideoDto>(v))
                .ToListAsync();
                
            return videos;
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
        [HttpGet]
        public async Task<ActionResult<VideoDto>> GetVideo(int id)
        {
            var videoById = await context.Video
                .Include(v => v.Author)
                .Include(v => v.UserVideoComments)
                .Include(v => v.UserVideoReactions)
                .Include(v => v.UserVideoViews)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (videoById == null)
            {
                return NotFound();
            }
            
            return mapper.Map<VideoDto>(videoById);
        }

        /// <summary>
        /// Upload a video (without its details)
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/video?userId=0&userSecret=secret, video.mp4, image.jpg
        ///     {
        ///         "Content-Type": "multipart/form-data"
        ///     }
        /// </remarks>
        [HttpPost]
        public async Task<ActionResult<VideoDto>> PostVideo([FromRoute] int userId, [FromRoute] string userSecret, IFormFileCollection files)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }

            if (files.Count < 2)
            {
                return BadRequest("At least two files should be attached.");
            }

            string imagePath = null;
            string videoPath = null;
            for (int i = 0; i < 2; i++)
            {
                if (FileIsImage(files[i]))
                {
                    imagePath = await HelperFunctions.AddFileToSystemAsync(files[i], env);
                }
                else
                {
                    videoPath = await HelperFunctions.AddFileToSystemAsync(files[i], env);
                }
            }

            var video = new Video { 
                Author = user.Channel, 
                ThumbnailUrl = imagePath,
                Url = videoPath
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
        [HttpPut]
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

            return mapper.Map<VideoDto>(postVideoDto.Video);
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
        [HttpDelete]
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
        [HttpPut("show")]
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
        [HttpPut("hide")]
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
        [HttpPut("like")]
        public async Task<ActionResult> LikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
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
            }
            else
            {
                userVideoReaction.Like = true;
            }

            await context.SaveChangesAsync();

            return Ok();
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
        [HttpPost("undolike")]
        public async Task<ActionResult> UndoLikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
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

            return Ok();
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
        [HttpPut("dislike")]
        public async Task<ActionResult> DislikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
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
            }
            else
            {
                userVideoReaction.Like = false;
            }

            await context.SaveChangesAsync();

            return Ok();
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
        [HttpPost("undodislike")]
        public async Task<ActionResult> UndoDislikeVideo(int id, [FromBody] PostVideoDto postVideoDto)
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

            return Ok();
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
        [HttpPost("addtowatchlater")]
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
        [HttpPost("reportvideo")]
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

        private bool FileIsImage(IFormFile file) => file.ContentType.ToLower().IndexOf("image") != -1;
    }
}
