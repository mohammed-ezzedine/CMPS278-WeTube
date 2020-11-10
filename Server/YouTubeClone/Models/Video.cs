namespace YouTubeClone.Models
{
    public class Video
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public bool Shown { get; set; }

        public string Url { get; set; }

        public string ThumbnailUrl { get; set; }

        public Channel Author { get; set; }
    }
}
