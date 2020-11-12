using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            throw new NotImplementedException();
        }

        [HttpGet]
        public async Task<ActionResult<Video>> GetVideo(int id)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public async Task<ActionResult<Video>> PostVideo(Video video)
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        public async Task<ActionResult<Video>> UpdateVideo(Video video)
        {
            throw new NotImplementedException();
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteVideo(int videoId, int userId, string userSecret)
        {
            throw new NotImplementedException();
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
            throw new NotImplementedException();
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
