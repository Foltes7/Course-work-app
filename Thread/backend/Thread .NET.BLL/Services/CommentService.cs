using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Thread_.NET.BLL.Services.Abstract;
using Thread_.NET.Common.DTO.Comment;
using Thread_.NET.Common.DTO.Like;
using Thread_.NET.DAL.Context;
using Thread_.NET.DAL.Entities;

namespace Thread_.NET.BLL.Services
{
    public sealed class CommentService : BaseService
    {
        public CommentService(ThreadContext context, IMapper mapper) : base(context, mapper) { }

        public async Task<CommentDTO> CreateComment(NewCommentDTO newComment)
        {
            var commentEntity = _mapper.Map<Comment>(newComment);

            _context.Comments.Add(commentEntity);
            await _context.SaveChangesAsync();

            var createdComment = await _context.Comments
                .Include(comment => comment.Author)
                    .ThenInclude(user => user.Avatar)
                .FirstAsync(comment => comment.Id == commentEntity.Id);

            return _mapper.Map<CommentDTO>(createdComment);
        }
        public async Task ReactionComment(NewReactionDTO reaction)
        {
            var dislike = _context.CommentReactions.Where(x => x.UserId == reaction.UserId && x.CommentId == reaction.EntityId);

            if (dislike.Any())
            {
                _context.CommentReactions.RemoveRange(dislike);
                await _context.SaveChangesAsync();
                // return;
            }

            _context.CommentReactions.Add(new DAL.Entities.CommentReaction
            {
                CommentId = reaction.EntityId,
                IsLike = reaction.IsLike,
                UserId = reaction.UserId,
                IsDisLike = reaction.IsDisLike
            });

            await _context.SaveChangesAsync();
        }
    }
}
