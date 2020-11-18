using AutoMapper;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class VideoReactionProfile : Profile
    {
        public VideoReactionProfile()
        {
            CreateMap<UserVideoReaction, VideoReactionSummaryDto>();
            CreateMap<UserVideoReaction, VideoReactionDto>();
        }
    }
}
