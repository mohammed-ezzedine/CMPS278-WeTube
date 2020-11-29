using System;
using System.Collections.Generic;

namespace YouTubeClone.Models.Dtos
{
    public class UserSummaryDto
    {
        public int Id { get; set; }

        public string Username { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }
    }

    public class UserDto : UserSummaryDto
    {
        public Guid Secret { get; set; }

        public ChannelSummaryDto Channel { get; set; }

        public List<ChannelSummaryDto> Subscriptions { get; set; }
    }
}
