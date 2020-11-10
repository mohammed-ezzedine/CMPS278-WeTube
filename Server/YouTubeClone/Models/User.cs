using System;
using System.Collections.Generic;

namespace YouTubeClone.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public Guid Secret { get; set; }

        public string HashedPassword { get; set; }

        public Channel Channel { get; set; }

        public List<Channel> Subscriptions { get; set; }

        public List<Video> WatchLater { get; set; }
    }
}
