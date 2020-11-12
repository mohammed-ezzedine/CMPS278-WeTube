using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YouTubeClone.Data;
using YouTubeClone.Models;

namespace YouTubeClone.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelController : ControllerBase
    {
        private readonly YouTubeContext context;

        public ChannelController(YouTubeContext context)
        {
            this.context = context;
        }

        // GET: api/Channel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Channel>>> GetChannel()
        {
            var channels = await context.Channel
                .Include(c => c.Playlists)
                .ThenInclude(p => p.Videos)
                .Include(c => c.Videos)
                .ToListAsync();

            return channels;
        }

        // GET: api/Channel/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Channel>> GetChannel(int id)
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

            return channel;
        }

        [HttpPost]
        public async Task<ActionResult<Channel>> PostChannel([FromRoute] string userId, [FromRoute] string userSecret, Channel channel)
        {
            var user = await context.User.FindAsync(userId);

            if (user == null || user.Secret != Guid.Parse(userSecret))
            {
                return Unauthorized();
            }

            user.Channel = channel;
            context.Channel.Add(channel);
            await context.SaveChangesAsync();

            return channel;
        }

        [HttpPut]
        public async Task<ActionResult> Subscribe(int id, [FromRoute] string userId, [FromRoute] string userSecret)
        {
            throw new NotImplementedException();
        }

        [HttpPost]
        public async Task<ActionResult> FeatureVideo(int id, int videoId, [FromRoute] string userId, [FromRoute] string userSecret)
        {
            throw new NotImplementedException();
        }
    }
}
