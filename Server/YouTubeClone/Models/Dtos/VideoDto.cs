using System.Collections.Generic;

namespace YouTubeClone.Models.Dtos
{
    public class VideoSummaryDto
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public bool Shown { get; set; }

        public string Url { get; set; }

        public string ThumbnailUrl { get; set; }

        public bool Featured { get; set; }
    }

    public class VideoDto : VideoSummaryDto
    {
        public ChannelSummaryDto Author { get; set; }

        public List<CommentDto> Comments { get; set; }

        public List<VideoReactionDto> Reactions { get; set; }

        public List<VideoViewSummaryDto> Views { get; set; }
    }
}
