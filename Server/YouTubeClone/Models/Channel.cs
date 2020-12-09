using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace YouTubeClone.Models
{
    public class Channel
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public List<UserChannelSubscription> Subscribers { get; set; }

        public List<Video> Videos { get; set; }

        public List<Playlist> Playlists { get; set; }

        [NotMapped]
        public string Name { get; set; }
    }
}
