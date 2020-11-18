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
    public class PlaylistController : ControllerBase
    {
        private readonly YouTubeContext context;
        private readonly IMapper mapper;

        public PlaylistController(YouTubeContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        // GET: api/Playlist/channel/4
        [HttpGet("channel/{channelId}")]
        public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetChannelPlaylists(int channelId)
        {
            var results = await context.Playlist
                .Include(p => p.Channel)
                .Include(p => p.Videos)
                .Where(p => p.Channel.Id == channelId)
                .Select(p => mapper.Map<PlaylistDto>(p))
                .ToListAsync();

            return results;
        }

        // GET: api/Playlist/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PlaylistDto>> GetPlaylist(int id)
        {
            var playlist = await context.Playlist.FindAsync(id);

            if (playlist == null)
            {
                return NotFound();
            }

            return mapper.Map<PlaylistDto>(playlist);
        }

        // PUT: api/Playlist/addVideo/5?videoId=2
        [HttpPut("addVideo/{id}")]
        public async Task<IActionResult> AddToPlaylist(int id, [FromRoute] int videoId)
        {
            var playlist = await context.Playlist
                .Include(p => p.Videos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (playlist == null)
            {
                return NotFound();
            }

            var video = await context.Video
                .Include(v => v.Playlists)
                .FirstOrDefaultAsync(v => v.Id == videoId);

            if (video == null)
            {
                return NotFound();
            }

            var playlistVideo = new PlaylistVideo { Playlist = playlist, Video = video };
            context.PlaylistVideo.Add(playlistVideo);
            await context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Playlist/removeVideo/5?videoId=2
        [HttpPut("removeVideo/{id}")]
        public async Task<IActionResult> RemoveFromPlaylist(int id, [FromRoute] int videoId)
        {
            var playlistVideo = await context.PlaylistVideo
                .Include(pv => pv.Playlist)
                .Include(pv => pv.Video)
                .FirstOrDefaultAsync(pv => pv.Playlist.Id == id && pv.Video.Id == videoId);

            if (playlistVideo == null)
            {
                return NoContent();
            }

            context.PlaylistVideo.Remove(playlistVideo);
            await context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Playlist
        [HttpPost]
        public async Task<ActionResult<PlaylistDto>> PostPlaylist(Playlist playlist)
        {
            context.Playlist.Add(playlist);
            await context.SaveChangesAsync();

            return mapper.Map<PlaylistDto>(playlist);
        }

        // DELETE: api/Playlist/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PlaylistDto>> DeletePlaylist(int id, [FromRoute] int userId, [FromRoute] string userSecret)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == userId && u.Secret == Guid.Parse(userSecret));

            if (user == null)
            {
                return NotFound();
            }

            var playlist = await context.Playlist
                .Include(p => p.Channel)
                .FirstOrDefaultAsync(p => p.Id == id && p.Channel == user.Channel);

            if (playlist == null)
            {
                return NotFound();
            }

            context.Playlist.Remove(playlist);
            await context.SaveChangesAsync();

            return mapper.Map<PlaylistDto>(playlist);
        }
    }
}
