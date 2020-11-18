using AutoMapper;
using System.Linq;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserSummaryDto>();
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Subscriptions, opt => opt.MapFrom(src => src.Subscriptions.Select(s => s.Channel)));
        }
    }
}
