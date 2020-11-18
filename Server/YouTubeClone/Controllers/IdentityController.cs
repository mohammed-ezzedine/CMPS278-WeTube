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
using YouTubeClone.Services;
using YouTubeClone.Settings;

namespace YouTubeClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IdentityController : ControllerBase
    {
        private readonly YouTubeContext context;
        private readonly HashingSettings settings;
        private readonly IMapper mapper;

        public IdentityController(YouTubeContext context, HashingSettings settings, IMapper mapper)
        {
            this.context = context;
            this.settings = settings;
            this.mapper = mapper;
        }

        public class SigninDto
        {
            public string Username { get; set; }

            public string Password { get; set; }
        }

        public class SignupDto
        {
            public string FirstName { get; set; }

            public string LastName { get; set; }

            public string Username { get; set; }

            public string Password { get; set; }
        }

        // POST: api/Identity/signin
        [HttpPost("signin")]
        public async Task<ActionResult<UserDto>> Signin(SigninDto _user)
        {
            var hashedPassword = _user.Password.HashPassword(settings.Salt);

            var user = await context.User
                .FirstOrDefaultAsync(u => u.Username == _user.Username && u.HashedPassword == hashedPassword);

            if (user == null)
            {
                return NotFound();
            }

            return mapper.Map<UserDto>(user);
        }

        // POST: api/Identity/signup
        [HttpPost("signup")]
        public async Task<ActionResult<UserDto>> Signup(SignupDto _user)
        {
            var user = await context.User
                .FirstOrDefaultAsync(u => u.Username == _user.Username);

            if (user != null)
            {
                return BadRequest("Username is already taken.");
            }

            var hashedPassword = _user.Password.HashPassword(settings.Salt);

            user = new User
            {
                FirstName = _user.FirstName,
                LastName = _user.LastName,
                Username = _user.Username,
                HashedPassword = hashedPassword,
                Secret = Guid.NewGuid()
            };

            await context.User.AddAsync(user);
            await context.SaveChangesAsync();

            return mapper.Map<UserDto>(user);
        }

        [HttpGet("watchLater")]
        public async Task<ActionResult<IEnumerable<VideoDto>>> GetUserWatchLaterVideos([FromRoute] int userId, [FromRoute] string userSecret)
        {
            var user = await context.User
                .Include(u => u.WatchLater)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.Author)
                .Include(u => u.WatchLater)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.UserVideoComments)
                .Include(u => u.WatchLater)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.UserVideoViews)
                .Include(u => u.WatchLater)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.UserVideoReactions)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            if (user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }

            var videos = user.WatchLater.Select(uv => mapper.Map<VideoDto>(uv.Video)).ToList();
            return videos;
        }

        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<VideoDto>>> GetUserHistoryVideos([FromRoute] int userId, [FromRoute] string userSecret)
        {
            var user = await context.User
                .Include(u => u.UserVideoViews)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.Author)
                .Include(u => u.UserVideoViews)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.UserVideoComments)
                .Include(u => u.UserVideoViews)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.UserVideoViews)
                .Include(u => u.UserVideoViews)
                    .ThenInclude(uv => uv.Video)
                    .ThenInclude(v => v.UserVideoReactions)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound();
            }

            if (user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }

            var videos = user.UserVideoViews.Select(uv => mapper.Map<VideoDto>(uv.Video)).ToList();
            return videos;
        }
    }
}
