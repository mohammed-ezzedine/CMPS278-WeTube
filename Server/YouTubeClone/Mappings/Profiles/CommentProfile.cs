using AutoMapper;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class CommentProfile : Profile 
    {
        public CommentProfile()
        {
            CreateMap<UserVideoComment, CommentSummaryDto>();
            CreateMap<UserVideoComment, CommentDto>();
        }
    }
}
