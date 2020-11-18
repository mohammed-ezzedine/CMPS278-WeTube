using AutoMapper;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class VideoViewProfile : Profile
    {
        public VideoViewProfile()
        {
            CreateMap<UserVideoView, VideoViewSummaryDto>();
            CreateMap<UserVideoView, VideoViewDto>();
        }
    }
}
