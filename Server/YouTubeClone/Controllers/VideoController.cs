using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YouTubeClone.Data;
using YouTubeClone.Models;

namespace YouTubeClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly YouTubeContext context;

        public VideoController(YouTubeContext context)
        {
            this.context = context;
        }

        [HttpGet("channel/{channelId}")]
        public async Task<ActionResult<IEnumerable<Video>>> GetChannelVideos(int channelId)
        {
            try
            {
                var videos = await context.Video.Where(v => v.Author.Id == channelId).ToListAsync();
                
                return Ok(videos);
            }
            catch (Exception)
            {

                return BadRequest();
            }

        }

        [HttpGet("{vidId}")]
        public async Task<ActionResult<Video>> GetVideo(int vidId)
        {
                var videoById = await context.Video.FindAsync(vidId);
                if (videoById == null)
                {
                    return NotFound();
                }
                return Ok(videoById);
            
        }

        [HttpPost]
        public async Task<ActionResult<Video>> PostVideo(Video video, [FromRoute] string userId, [FromRoute] string userSecret)
        {
            // Create an additional utility function for auth check

            var user = await context.User.FindAsync(userId);

            if (user == null || user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }

            await context.Video.AddAsync(video);
            await context.SaveChangesAsync();
            return Created( new Uri($"{Request.Path}/{video.Id}") , video);

        }

        [HttpPut]
        public async Task<ActionResult<Video>> UpdateVideo(Video video)
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteVideo(int videoId, int userId, string userSecret)
        {
            // Create an additional utility function for auth check
            var user = await context.User.FindAsync(userId);

            if (user == null || user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }
            var video = await context.Video.FindAsync(videoId);
            if (video == null)
            {
                return NotFound();
            }
            context.Video.Remove(video);
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("show")]
        public async Task<ActionResult> ShowVideo(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPut("hide")]
        public async Task<ActionResult> HideVideo(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPut("like")]
        public async Task<ActionResult> LikeVideo(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPut("dislike")]
        public async Task<ActionResult> DislikeVideo(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPost("addtoplaylist")]
        public async Task<ActionResult> AddToPlaylist(int id, int playlistId, int userId, string userSecret)
        {
            // Create an additional utility function for auth check
            var user = await context.User.FindAsync(userId);

            if (user == null || user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }
            var video = await context.Video.FindAsync(id);
            var playlist = await context.Playlist.Where(p => p.Channel.Id == user.Channel.Id).FirstOrDefaultAsync();
            if (playlist == null || video == null)
            {
                return NotFound();
            }
            await context.PlaylistVideo.AddAsync(new PlaylistVideo { Playlist = playlist, Video = video });
            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("addtowatchlater")]
        public async Task<ActionResult> AddToWatchLater(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPost("reportvideo")]
        public async Task<ActionResult> ReportVideo(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }
    }
}
