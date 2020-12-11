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

        public class PostPlaylistDto
        {
            public int UserId { get; set; }
            public string UserSecret { get; set; }
            public int VideoId { get; set; }
            public int PlayListId { get; set; }
            public string Name { get; set; }
        }

        /// <summary>
        /// Get a channel's playlists
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     GET /api/playlist/channel/2
        /// 
        /// </remarks>
        [HttpGet("channel/{channelId}")]
        public async Task<ActionResult<IEnumerable<PlaylistDto>>> GetChannelPlaylists(int channelId)
        {
            var results = await context.Playlist
                .Include(p => p.Channel)
                .Where(p => p.Channel.Id == channelId)
                .Include(p => p.Videos)
                .ThenInclude(pv => pv.Video)
                .ThenInclude(v => v.Author)
                .Select(p => mapper.Map<PlaylistDto>(p))
                .ToListAsync();

            results.ForEach(r => r.Videos = r.Videos.Where(v => v.Shown).ToList());

            return results;
        }

        /// <summary>
        /// Get a playlist
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     GET /api/playlist/1
        /// 
        /// </remarks>
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

        /// <summary>
        /// Add video to a playlist
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/playlist/addVideo
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "PlayListId": 0,
        ///             "VideoId": 0
        ///         }
        ///     }
        /// 
        /// </remarks>
        [HttpPost("addVideo")]
        public async Task<IActionResult> AddToPlaylist([FromBody] PostPlaylistDto postPlaylistDto)
        {
            var playlist = await context.Playlist
                .Include(p => p.Channel)
                .Include(p => p.Videos)
                .FirstOrDefaultAsync(p => p.Id == postPlaylistDto.PlayListId);

            if (playlist == null)
            {
                return NotFound();
            }

            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Channel == playlist.Channel);
            
            if (user == null || user.Id != postPlaylistDto.UserId || user.Secret != Guid.Parse(postPlaylistDto.UserSecret))
            {
                return Unauthorized();
            }

            var video = await context.Video
                .Include(v => v.Playlists)
                .FirstOrDefaultAsync(v => v.Id == postPlaylistDto.VideoId);

            if (video == null)
            {
                return NotFound();
            }

            var playlistVideo = new PlaylistVideo { Playlist = playlist, Video = video };
            context.PlaylistVideo.Add(playlistVideo);
            await context.SaveChangesAsync();

            return Ok();
        }

        /// <summary>
        /// Remove video from a playlist
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     DELETE /api/playlist/removeVideo
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "PlayListId": 0,
        ///             "VideoId": 0
        ///         }
        ///     }
        /// 
        /// </remarks>
        [HttpDelete("removeVideo/{id}")]
        public async Task<IActionResult> RemoveFromPlaylist([FromBody] PostPlaylistDto postPlaylistDto)
        {
            var playlistVideo = await context.PlaylistVideo
                .Include(pv => pv.Playlist)
                .ThenInclude(pv => pv.Channel)
                .Include(pv => pv.Video)
                .FirstOrDefaultAsync(pv => pv.Playlist.Id == postPlaylistDto.PlayListId && pv.Video.Id == postPlaylistDto.VideoId);

            if (playlistVideo == null)
            {
                return NoContent();
            }

            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Channel == playlistVideo.Playlist.Channel);

            if (user == null || user.Id != postPlaylistDto.UserId || user.Secret != Guid.Parse(postPlaylistDto.UserSecret))
            {
                return Unauthorized();
            }

            context.PlaylistVideo.Remove(playlistVideo);
            await context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Create a playlist
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     POST /api/playlist
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "Name": ""
        ///         }
        ///     }
        /// 
        /// </remarks>
        [HttpPost]
        public async Task<ActionResult<PlaylistDto>> PostPlaylist([FromBody] PostPlaylistDto postPlaylistDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postPlaylistDto.UserId && u.Secret == Guid.Parse(postPlaylistDto.UserSecret));

            if (user == null)
            {
                return NotFound();
            }

            var playlist = new Playlist { Name = postPlaylistDto.Name, Channel = user.Channel };
            context.Playlist.Add(playlist);
            await context.SaveChangesAsync();

            return mapper.Map<PlaylistDto>(playlist);
        }

        /// <summary>
        /// Delete a playlist
        /// </summary>
        /// <remarks>
        /// Sample request:
        /// 
        ///     DELETE /api/playlist
        ///     {
        ///         "Content-Type": "application/json",
        ///         "body": {
        ///             "UserId": 0,
        ///             "UserSecret": "",
        ///             "PlaylistId": 0
        ///         }
        ///     }
        /// 
        /// </remarks>
        [HttpDelete]
        public async Task<ActionResult<PlaylistDto>> DeletePlaylist([FromBody] PostPlaylistDto postPlaylistDto)
        {
            var user = await context.User
                .Include(u => u.Channel)
                .FirstOrDefaultAsync(u => u.Id == postPlaylistDto.UserId && u.Secret == Guid.Parse(postPlaylistDto.UserSecret));

            if (user == null)
            {
                return NotFound();
            }

            var playlist = await context.Playlist
                .Include(p => p.Channel)
                .FirstOrDefaultAsync(p => p.Id == postPlaylistDto.PlayListId && p.Channel == user.Channel);

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
