using System;

namespace YouTubeClone.Models
{
    public class UserVideoView
    {
        public int Id { get; set; }

        public User User { get; set; }

        public Video Video { get; set; }

        public DateTime DateTime { get; set; }
    }
}
