namespace YouTubeClone.Models
{
    public class UserVideoWatchLater
    {
        public int Id { get; set; }

        public User User { get; set; }

        public Video Video { get; set; }
    }
}
