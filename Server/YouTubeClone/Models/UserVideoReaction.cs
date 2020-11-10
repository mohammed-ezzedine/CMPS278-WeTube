namespace YouTubeClone.Models
{
    public class UserVideoReaction
    {
        public int Id { get; set; }

        public User User { get; set; }

        public Video Video { get; set; }

        public bool Like { get; set; }
    }
}
