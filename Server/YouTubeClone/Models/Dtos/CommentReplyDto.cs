using System;

namespace YouTubeClone.Models.Dtos
{
    public class CommentReplySummaryDto
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public DateTime DateTime { get; set; }
    }

    public class CommentReplyDto : CommentReplySummaryDto
    {
        public UserSummaryDto User { get; set; }
    }
}
