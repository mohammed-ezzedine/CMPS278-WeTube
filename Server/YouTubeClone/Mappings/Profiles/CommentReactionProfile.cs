using AutoMapper;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class CommentReactionProfile : Profile
    {
        public CommentReactionProfile()
        {
            CreateMap<UserCommentReaction, CommentReactionSummaryDto>();
            CreateMap<UserCommentReaction, CommentReactionDto>();
        }
    }
}
