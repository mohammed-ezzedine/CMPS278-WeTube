namespace YouTubeClone.Models
{
    public class UserVideoReport
    {
        public int Id { get; set; }

        public User User { get; set; }

        public Video Video { get; set; }

        public string Reason { get; set; }
    }
}
