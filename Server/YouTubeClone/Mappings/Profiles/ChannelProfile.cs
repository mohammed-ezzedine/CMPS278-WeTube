using AutoMapper;
using System.Linq;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class ChannelProfile : Profile
    {
        public ChannelProfile()
        {
            CreateMap<Channel, ChannelSummaryDto>();
            CreateMap<Channel, ChannelDto>()
                .ForMember(dest => dest.Subscribers, opt => 
                    opt.MapFrom(src => src.Subscribers.Select(s => s.User)));
        }
    }
}
