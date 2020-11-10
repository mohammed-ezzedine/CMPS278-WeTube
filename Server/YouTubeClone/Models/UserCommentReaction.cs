namespace YouTubeClone.Models
{
    public class UserCommentReaction
    {
        public int Id { get; set; }

        public User User { get; set; }

        public UserVideoComment Comment { get; set; }

        public bool Like { get; set; }
    }
}
