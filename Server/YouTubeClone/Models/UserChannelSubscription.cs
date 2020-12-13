namespace YouTubeClone.Models
{
    public class UserChannelSubscription
    {
        public int Id { get; set; }

        public User User { get; set; }

        public Channel Channel { get; set; }
    }
}
