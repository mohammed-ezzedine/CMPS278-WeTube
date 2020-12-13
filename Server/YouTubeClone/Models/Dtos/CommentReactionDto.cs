namespace YouTubeClone.Models.Dtos
{
    public class CommentReactionSummaryDto
    {
        public int Id { get; set; }

        public bool Like { get; set; }
    }

    public class CommentReactionDto : CommentReactionSummaryDto
    {
        public UserSummaryDto User { get; set; }
    }
}
