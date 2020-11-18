using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YouTubeClone.Data;
using YouTubeClone.Models;

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

        public class PostCommentDto
        {
            public int VideoId { get; set; }

            public int CommentId { get; set; }

            public int UserId { get; set; }

            public string UserSecret { get; set; }

            public string Message { get; set; }
        }

        [HttpPost]
        public async Task<ActionResult<UserVideoComment>> PostCommentOnVideo([FromBody] PostCommentDto postCommentDto)
        {
            var user = await context.User.FindAsync(postCommentDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postCommentDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video.FindAsync(postCommentDto.VideoId);
            if (video == null)
            {
                return NotFound();
            }

            var comment = await context.UserVideoComment.AddAsync(new UserVideoComment { User = user, Video = video, DateTime = DateTime.Now, Text = postCommentDto.Message });
            return comment.Entity;
        }

        [HttpPost]
        public async Task<ActionResult> LikeComment([FromBody] PostCommentDto postCommentDto)
        {
            var user = await context.User.FindAsync(postCommentDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postCommentDto.UserSecret))
            {
                return Unauthorized();
            }

            var comment = await context.UserVideoComment
                .Include(c => c.Video)
                .FirstOrDefaultAsync(c => c.Id == postCommentDto.CommentId);

            if (comment == null)
            {
                return NotFound();
            }

            var userCommentReaction = await context.UserCommentReaction
                .Include(uc => uc.User)
                .Include(uc => uc.Comment)
                .FirstOrDefaultAsync(uc => uc.User == user && uc.Comment == comment);

            if (userCommentReaction == null)
            {
                userCommentReaction = new UserCommentReaction { User = user, Comment = comment, Like = true };
                await context.UserCommentReaction.AddAsync(userCommentReaction);
            }
            else
            {
                userCommentReaction.Like = true;
            }

            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult> DislikeComment([FromBody] PostCommentDto postCommentDto)
        {
            var user = await context.User.FindAsync(postCommentDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postCommentDto.UserSecret))
            {
                return Unauthorized();
            }

            var comment = await context.UserVideoComment
                .Include(c => c.Video)
                .FirstOrDefaultAsync(c => c.Id == postCommentDto.CommentId);

            if (comment == null)
            {
                return NotFound();
            }

            var userCommentReaction = await context.UserCommentReaction
                .Include(uc => uc.User)
                .Include(uc => uc.Comment)
                .FirstOrDefaultAsync(uc => uc.User == user && uc.Comment == comment);

            if (userCommentReaction == null)
            {
                userCommentReaction = new UserCommentReaction { User = user, Comment = comment, Like = false };
                await context.UserCommentReaction.AddAsync(userCommentReaction);
            }
            else
            {
                userCommentReaction.Like = false;
            }

            await context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult<UserCommentReply>> ReplyToComment([FromBody] PostCommentDto postCommentDto)
        {
            var user = await context.User.FindAsync(postCommentDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postCommentDto.UserSecret))
            {
                return Unauthorized();
            }

            var comment = await context.UserVideoComment
                .Include(c => c.Video)
                .FirstOrDefaultAsync(c => c.Id == postCommentDto.CommentId);

            if (comment == null)
            {
                return NotFound();
            }

            var userCommentReply = new UserCommentReply { User = user, Comment = comment, DateTime = DateTime.Now, Text = postCommentDto.Message };
            await context.UserCommentReply.AddAsync(userCommentReply);
            await context.SaveChangesAsync();

            return userCommentReply;
        }
    }
}
