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
        public async Task<ActionResult<IEnumerable<ChannelDto>>> GetChannels()
        {
            var channels = await context.Channel
                .Include(c => c.Playlists)
                .ThenInclude(p => p.Videos)
                .Include(c => c.Videos)
                .Select(c => mapper.Map<ChannelDto>(c))
                .ToListAsync();

            return channels;
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
                .FirstOrDefaultAsync(c => c.Id == id);

            if (channel == null)
            {
                return NotFound();
            }

            return mapper.Map<ChannelDto>(channel);
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
            var user = await context.User.FindAsync(postChannelDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postChannelDto.UserSecret))
            {
                return Unauthorized();
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
        [HttpPut]
        public async Task<ActionResult> SetChannelImage(int id, IFormFile image, [FromRoute] int userId, [FromRoute] string userSecret)
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
            var user = await context.User.FindAsync(postChannelDto.UserId);

            if (user == null || user.Secret != Guid.Parse(postChannelDto.UserSecret))
            {
                return Unauthorized();
            }

            var channel = await context.Channel.FindAsync(postChannelDto.ChannelId);
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
