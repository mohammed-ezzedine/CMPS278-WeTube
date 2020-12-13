using System.Collections.Generic;

namespace YouTubeClone.Models.Dtos
{
    public class PlaylistSummaryDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }

    public class PlaylistDto : PlaylistSummaryDto
    {
        public List<VideoSummaryDto> Videos { get; set; }

        public ChannelSummaryDto Channel { get; set; }
    }
}
