using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Thread_.NET.BLL.Services.Abstract;
using Thread_.NET.Common.DTO.Like;
using Thread_.NET.DAL.Context;

namespace Thread_.NET.BLL.Services
{
    public sealed class DisLikeService : BaseService
    {
        public DisLikeService(ThreadContext context, IMapper mapper) : base(context, mapper) { }

        public async Task DisLikePost(NewReactionDTO reaction)
        {
            var dislike = _context.PostReactions.Where(x => x.UserId == reaction.UserId && x.PostId == reaction.EntityId);

            if (dislike.Any())
            {
                _context.PostReactions.RemoveRange(dislike);
                await _context.SaveChangesAsync();
               // return;
            }

            _context.PostReactions.Add(new DAL.Entities.PostReaction
            {
                PostId = reaction.EntityId,
                IsLike = reaction.IsLike,
                UserId = reaction.UserId,
                IsDisLike = reaction.IsDisLike
            });

            await _context.SaveChangesAsync();
        }
    }
}
