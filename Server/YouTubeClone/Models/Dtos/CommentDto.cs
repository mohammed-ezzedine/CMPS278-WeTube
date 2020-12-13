using System;
using System.Collections.Generic;

namespace YouTubeClone.Models.Dtos
{
    public class CommentSummaryDto
    {
        public int Id { get; set; }

        public string Text { get; set; }

        public DateTime DateTime { get; set; }
    }

    public class CommentDto : CommentSummaryDto
    {
        public UserSummaryDto User { get; set; }

        public List<CommentReactionDto> UserCommentReactions { get; set; }

        public List<CommentReplyDto> UserCommentReplies { get; set; }
    }
}
