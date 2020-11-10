using System;

namespace YouTubeClone.Models
{
    public class UserCommentReply
    {
        public int Id { get; set; }

        public User User { get; set; }

        public UserVideoComment Comment { get; set; }

        public string Text { get; set; }

        public DateTime DateTime { get; set; }
    }
}
