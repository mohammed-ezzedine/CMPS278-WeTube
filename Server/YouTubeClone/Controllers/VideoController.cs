using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YouTubeClone.Data;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly YouTubeContext context;
        private readonly IMapper mapper;

        public VideoController(YouTubeContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public class PostVideoDto
        {
            public Video Video { get; set; }
            public int UserId { get; set; }
            public string UserSecret { get; set; }
            public string Text { get; set; }
            public int PlaylistId { get; set; }
        }

        [HttpGet("channel/{channelId}")]
        public async Task<ActionResult<IEnumerable<VideoDto>>> GetChannelVideos(int channelId)
        {
            var videos = await context.Video
                .Where(v => v.Author.Id == channelId)
                .Select(v => mapper.Map<VideoDto>(v))
                .ToListAsync();
                
            return videos;
        }

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

        [HttpPost]
        public async Task<ActionResult<VideoDto>> PostVideo([FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            postVideoDto.Video.Author = user.Channel;
            await context.Video.AddAsync(postVideoDto.Video);
            await context.SaveChangesAsync();

            return mapper.Map<VideoDto>(postVideoDto.Video);
        }

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

            originalVideo.Update(postVideoDto.Video);
            await context.SaveChangesAsync();

            return mapper.Map<VideoDto>(postVideoDto.Video);
        }

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

        [HttpPut("undolike")]
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

        [HttpPut("undodislike")]
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

        [HttpPost("addtoplaylist")]
        public async Task<ActionResult> AddToPlaylist(int id, [FromBody] PostVideoDto postVideoDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .ThenInclude(c => c.Playlists)
                .FirstOrDefaultAsync(u => u.Id == postVideoDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postVideoDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(id);
            var playlist = await context.Playlist
                .FirstOrDefaultAsync(p => p.Channel == user.Channel && p.Id == postVideoDto.PlaylistId);

            if (playlist == null || video == null)
            {
                return NotFound();
            }

            await context.PlaylistVideo.AddAsync(new PlaylistVideo { Playlist = playlist, Video = video });
            await context.SaveChangesAsync();
            
            return Ok();
        }

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
    }
}
