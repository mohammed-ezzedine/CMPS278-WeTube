namespace YouTubeClone.Models.Dtos
{
    public class VideoReactionSummaryDto
    {
        public int Id { get; set; }

        public bool Like { get; set; }
    }

    public class VideoReactionDto : VideoReactionSummaryDto
    {
        public UserSummaryDto User { get; set; }

        public VideoSummaryDto Video { get; set; }
    }
}
