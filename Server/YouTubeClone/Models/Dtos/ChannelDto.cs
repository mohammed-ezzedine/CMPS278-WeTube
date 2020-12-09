using System.Collections.Generic;

namespace YouTubeClone.Models.Dtos
{
    public class ChannelSummaryDto
    {
        public int Id { get; set; }

        public string Description { get; set; }

        public string ImageUrl { get; set; }

        public string Name { get; set; }
    }

    public class ChannelDto : ChannelSummaryDto
    {
        public List<UserSummaryDto> Subscribers { get; set; }

        public List<VideoSummaryDto> Videos { get; set; }

        public List<PlaylistSummaryDto> Playlists { get; set; }
    }
}
