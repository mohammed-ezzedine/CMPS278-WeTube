using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using YouTubeClone.Data;

namespace YouTubeClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly YouTubeContext context;

        public CommentController(YouTubeContext context)
        {
            this.context = context;
        }

        [HttpPost]
        public async Task<ActionResult> PostCommentOnVideo(int videoId, int userId, string userSecret, string message)
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        public async Task<ActionResult> LikeComment(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        public async Task<ActionResult> DislikeComment(int id, int userId, string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPut]
        public async Task<ActionResult> ReplyToComment(int id, int userId, string userSecret, string message)
        {
            throw new NotImplementedException();
        }
    }
}
