using AutoMapper;
using System.Linq;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class PlaylistProfile : Profile
    {
        public PlaylistProfile()
        {
            CreateMap<Playlist, PlaylistSummaryDto>();
            CreateMap<Playlist, PlaylistDto>()
                .ForMember(dest => dest.Videos, opt => opt.MapFrom(src => src.Videos.Select(v => v.Video)));
        }
    }
}
