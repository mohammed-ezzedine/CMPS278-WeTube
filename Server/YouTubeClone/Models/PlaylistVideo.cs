namespace YouTubeClone.Models
{
    public class PlaylistVideo
    {
        public int Id { get; set; }

        public Playlist Playlist { get; set; }

        public Video Video { get; set; }
    }
}
