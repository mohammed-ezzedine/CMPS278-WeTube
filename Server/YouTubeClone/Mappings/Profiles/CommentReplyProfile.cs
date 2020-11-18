using AutoMapper;
using YouTubeClone.Models;
using YouTubeClone.Models.Dtos;

namespace YouTubeClone.Mappings.Profiles
{
    public class CommentReplyProfile : Profile
    {
        public CommentReplyProfile()
        {
            CreateMap<UserCommentReply, CommentReplySummaryDto>();
            CreateMap<UserCommentReply, CommentReplyDto>();
        }
    }
}
