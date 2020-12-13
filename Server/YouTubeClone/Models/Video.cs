using System;
using System.Collections.Generic;

namespace YouTubeClone.Models
{
    public class Video
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public bool Shown { get; set; }

        public string Url { get; set; }

        public string ThumbnailUrl { get; set; }

        public Channel Author { get; set; }

        public bool Featured { get; set; }

        public DateTime UploadDate { get; set; }

        public List<PlaylistVideo> Playlists { get; set; }

        public List<UserVideoComment> UserVideoComments { get; set; }

        public List<UserVideoReaction> UserVideoReactions { get; set; }

        public List<UserVideoReport> UserVideoReports { get; set; }

        public List<UserVideoView> UserVideoViews { get; set; }

        public List<UserVideoWatchLater> UserVideoWatchLater { get; set; }

        public Video SetTitle(string title)
        {
            Title = title;
            return this;
        }

        public Video SetDescription(string description)
        {
            Description = description;
            return this;
        }

        public Video SetFeatured(bool featured)
        {
            Featured = featured;
            return this;
        }

        public Video SetShown(bool shown)
        {
            Shown = shown;
            return this;
        }
    }
}
