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

        public List<UserChannelSubscription> Subscriptions { get; set; }

        public List<UserVideoWatchLater> WatchLater { get; set; }

        public List<UserCommentReaction> UserCommentReactions { get; set; }

        public List<UserCommentReply> UserCommentReplies { get; set; }

        public List<UserVideoComment> UserVideoComments { get; set; }

        public List<UserVideoReaction> UserVideoReactions { get; set; }

        public List<UserVideoReport> UserVideoReports { get; set; }

        public List<UserVideoView> UserVideoViews { get; set; }
    }
}
