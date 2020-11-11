using System;
using System.Collections.Generic;

namespace YouTubeClone.Models
{
    public class UserVideoComment
    {
        public int Id { get; set; }

        public User User { get; set; }

        public Video Video { get; set; }

        public string Text { get; set; }

        public DateTime DateTime { get; set; }

        public List<UserCommentReaction> UserCommentReactions { get; set; }

        public List<UserCommentReply> UserCommentReplies { get; set; }
    }
}
