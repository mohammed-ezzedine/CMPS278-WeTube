using System;

namespace YouTubeClone.Models.Dtos
{
    public class VideoViewSummaryDto
    {
        public int Id { get; set; }

        public DateTime DateTime { get; set; }
    }

    public class VideoViewDto : VideoViewSummaryDto
    {
        public UserSummaryDto User { get; set; }

        public VideoSummaryDto Video { get; set; }
    }
}
