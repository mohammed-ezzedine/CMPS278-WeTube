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
    public class ChannelController : ControllerBase
    {
        private readonly YouTubeContext context;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment env;

        public ChannelController(YouTubeContext context, IMapper mapper, IWebHostEnvironment env)
        {
            this.context = context;
            this.mapper = mapper;
            this.env = env;
        }

        public class PostChannelDto
        {
            public int ChannelId { get; set; }
            public int UserId { get; set; }
            public string UserSecret { get; set; }
            public int VideoId { get; set; }
            public string Description { get; set; }
        }

        /// <summary>
        /// Get the list of channels
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     GET /api/channel
        ///     
        /// </remarks>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChannelSummaryDto>>> GetChannels()
        {
            var channels = await context.Channel
                .Include(c => c.Playlists)
                .ThenInclude(p => p.Videos)
                .Include(c => c.Videos)
                .Select(c => mapper.Map<ChannelSummaryDto>(c))
                .ToListAsync();

            return channels;
        }

        /// <summary>
        /// Get the list of user's subscribed channels
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     POST /api/channel/subscriptions
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        ///     
        /// </remarks>
        [HttpPost("subscriptions")]
        public async Task<ActionResult<IEnumerable<ChannelSummaryDto>>> GetUserSubscriptions([FromBody] PostChannelDto postChannelDto)
        {
            var user = await context.User
                .FindAsync(postChannelDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postChannelDto.UserSecret))
            {
                return Unauthorized();
            }

            var usersubscriptions = await context.UserChannelSubscription
                .Include(ucs => ucs.Channel)
                .Include(ucs => ucs.User)
                .Where(ucs => ucs.User.Id == user.Id)
                .Select(ucs => mapper.Map<ChannelSummaryDto>(ucs.Channel))
                .ToListAsync();

            return usersubscriptions;
        }

        /// <summary>
        /// Get a channel given its ID
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     GET /api/channel/1
        ///     
        /// </remarks>
        /// <param name="id">ID of the channel</param>
        [HttpGet("{id}")]
        public async Task<ActionResult<ChannelDto>> GetChannel(int id)
        {
            var channel = await context.Channel
                .Include(c => c.Playlists)
                .ThenInclude(p => p.Videos)
                .Include(c => c.Videos)
                .Include(c => c.Subscribers)
                .ThenInclude(s => s.User)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (channel == null)
            {
                return NotFound();
            }

            return mapper.Map<ChannelDto>(channel);
        }

        /// <summary>
        /// Get a channel's hidden videos
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     POST /api/channel/hidden/3
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        [HttpPost("hidden")]
        public async Task<ActionResult<IEnumerable<VideoSummaryDto>>> GetHiddenVideos(int id, [FromBody] PostChannelDto postChannelDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .ThenInclude(c => c.Videos)
                .FirstOrDefaultAsync(u => u.Id == postChannelDto.UserId);

            if (user == null || user.Channel.Id != id)
            {
                return Unauthorized();
            }

            var result = user.Channel.Videos
                .Where(v => !v.Shown)
                .Select(v => mapper.Map<VideoSummaryDto>(v))
                .ToList();

            return result;
        }


        /// <summary>
        /// Get a channel's stats
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     POST /api/channel/stats/3
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": ""
        ///         }
        ///     }
        /// </remarks>
        /// <returns>
        /// {
        ///     "LastMonthViews": 0,
        ///     "TotalViews": 0,
        ///     "TopVideosInTwoDays": [],
        ///     "TopVideosAllTime": []
        /// }
        /// </returns>
        [HttpPost("stats")]
        public async Task<ActionResult> PostChannel(int id, [FromBody] PostChannelDto postChannelDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .ThenInclude(c => c.Videos)
                .FirstOrDefaultAsync(u => u.Id == postChannelDto.UserId);

            if (user == null 
                || user.Secret != Guid.Parse(postChannelDto.UserSecret)
                || user.Channel.Id != id)
            {
                return Unauthorized();
            }

            var channelVideosIds = user.Channel.Videos.Select(v => v.Id);

            var lastMonthViewsCount = context.UserVideoViews
                .Where(uv =>
                    channelVideosIds.Contains(uv.Video.Id)
                    && uv.DateTime.Subtract(DateTime.Now).TotalDays < 30)
                .Count();

            var totalViewsCount = context.UserVideoViews
                .Where(uv => channelVideosIds.Contains(uv.Video.Id))
                .Count();

            var topVideosInTwoDays = context.UserVideoViews
                .Include(uv => uv.Video)
                .Where(uv => channelVideosIds.Contains(uv.Video.Id)
                    && uv.DateTime.Subtract(DateTime.Now).TotalHours < 48)
                .Select(uv => mapper.Map<VideoSummaryDto>(uv.Video))
                .Take(10);

            var topVideosAllTime = context.UserVideoViews
               .Include(uv => uv.Video)
               .Where(uv => channelVideosIds.Contains(uv.Video.Id))
               .Select(uv => mapper.Map<VideoSummaryDto>(uv.Video))
               .Take(10);

            return Ok(new
            {
                LastMonthViews = lastMonthViewsCount,
                TotalViews = totalViewsCount,
                TopVideosInTwoDays = topVideosInTwoDays,
                TopVideosAllTime = topVideosAllTime
            });
        }

        /// <summary>
        /// Create a new channel
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     POST /api/channel
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "Description": ""
        ///         }
        ///     }
        ///     
        /// </remarks>
        [HttpPost]
        public async Task<ActionResult<ChannelDto>> PostChannel([FromBody] PostChannelDto postChannelDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postChannelDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postChannelDto.UserSecret))
            {
                return Unauthorized();
            }

            if (user.Channel != null)
            {
                return BadRequest("User already has a channel.");
            }

            var channel = new Channel { Description = postChannelDto.Description };
            user.Channel = channel;
            await context.Channel.AddAsync(channel);
            await context.SaveChangesAsync();

            return mapper.Map<ChannelDto>(channel);
        }

        /// <summary>
        /// Set a channel's image
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PUT /api/channel/1?userId=0,userSecret=secret image.jpg
        ///     {
        ///         "Content-Type": "multipart/form-data"
        ///     }
        /// 
        /// </remarks>
        [HttpPut("{id}")]
        public async Task<ActionResult> SetChannelImage(int id, IFormFile image, [FromQuery] int userId, [FromQuery] string userSecret)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == userId && u.Secret == Guid.Parse(userSecret));

            if (user == null)
            {
                return NotFound();
            }

            if (user.Channel.Id != id)
            {
                return Unauthorized();
            }

            if (user.Channel.ImageUrl != null)
            {
                System.IO.File.Delete(user.Channel.ImageUrl);
            }

            user.Channel.ImageUrl = await HelperFunctions.AddFileToSystemAsync(image, env);
            return Ok();
        }

        /// <summary>
        /// Subscribe to a channel
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     POST /api/channel/subscribe
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "ChannelId": 0,
        ///         }
        ///     }
        ///     
        /// </remarks>
        [HttpPost("subscribe")]
        public async Task<ActionResult> Subscribe([FromBody] PostChannelDto postChannelDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postChannelDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postChannelDto.UserSecret))
            {
                return Unauthorized();
            }

            if (user.Channel.Id == postChannelDto.ChannelId)
            {
                return BadRequest("User cannot subscribe to his own channel.");
            }

            var channel = await context.Channel.FindAsync(postChannelDto.ChannelId);
            var previousSuscription = await context.UserChannelSubscription
                .Include(ucs => ucs.Channel)
                .Include(ucs => ucs.User)
                .FirstOrDefaultAsync(ucs => ucs.Channel.Id == channel.Id && ucs.User.Id == user.Id);

            if (previousSuscription != null)
            {
                return BadRequest("User is already subscribed to this channel.");
            }

            await context.UserChannelSubscription.AddAsync(new UserChannelSubscription { User = user, Channel = channel });
            await context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Add a video to the featured list of a channel
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PUT /api/channel/feature-video
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "ChannelId": 0,
        ///             "VideoId": 0
        ///         }
        ///     }
        ///     
        /// </remarks>
        [HttpPut("feature-video")]
        public async Task<ActionResult> FeatureVideo([FromBody] PostChannelDto postChannelDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postChannelDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postChannelDto.UserSecret))
            {
                return Unauthorized();
            }

            var channel = await context.Channel.FindAsync(postChannelDto.ChannelId);
            if (user.Channel.Id != channel.Id)
            {
                return Unauthorized();
            }

            var video = await context.Video
                .Include(v => v.Author)
                .FirstOrDefaultAsync(v => v.Id == postChannelDto.VideoId);

            if (video == null)
            {
                return NotFound();
            }

            if (video.Author.Id != channel.Id)
            {
                return Unauthorized();
            }

            video.Featured = true;
            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
