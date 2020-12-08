import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { Post } from '../models/post/post';
import { NewReaction } from '../models/reactions/newReaction';
import { PostService } from './post.service';
import { User } from '../models/user';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Comment } from 'src/app/models/comment/comment';

@Injectable({ providedIn: 'root' })

export class CommentReactionService {
    public constructor(private authService: AuthenticationService, private postService: PostService) { }

    public CommentLikeReaction(comment: Comment, currentUser: User) {

        const innerComment = comment;

        const reaction: NewReaction = {
            entityId: innerComment.id,
            isDisLike: false,
            isLike: true,
            userId: currentUser.id
        };

        // update current array instantly
        let hasReaction = innerComment.reactions.some((x) => x.user.id === currentUser.id);
        if (hasReaction) {
            let check = innerComment.reactions.find((x) => x.user.id === currentUser.id).isLike;
            if (check == true) {
                reaction.isLike = false;
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isDisLike = false;
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isLike = false;
            }
            else {
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isDisLike = false;
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isLike = true;
            }
        }
        else {
            innerComment.reactions = innerComment.reactions.concat({ isLike: true, user: currentUser, isDisLike: false });
        }
        /* innerPost.reactions = hasReaction
             ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
             : innerPost.reactions.concat({ isLike: true, user: currentUser, isDisLike: false });*/
        hasReaction = innerComment.reactions.some((x) => x.user.id === currentUser.id);

        return this.postService.likeComment(reaction).pipe(
            map(() => innerComment),
            catchError(() => {
                // revert current array changes in case of any error
                innerComment.reactions = hasReaction
                    ? innerComment.reactions.filter((x) => x.user.id !== currentUser.id)
                    : innerComment.reactions.concat({ isLike: true, user: currentUser, isDisLike: false });

                return of(innerComment);
            })
        );
    }
    public CommentDisLikeReaction(comment: Comment, currentUser: User) {
        const innerComment = comment;

        const reaction: NewReaction = {
            entityId: innerComment.id,
            isDisLike: true,
            isLike: false,
            userId: currentUser.id
        };


        // update current array instantly
        let hasReaction = innerComment.reactions.some((x) => x.user.id === currentUser.id);
        if (hasReaction) {
            let check = innerComment.reactions.find((x) => x.user.id === currentUser.id).isDisLike;
            if (check == true) {
                reaction.isDisLike = false;
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isDisLike = false;
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isLike = false;
            }
            else {
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isDisLike = true;
                innerComment.reactions.find((x) => x.user.id === currentUser.id).isLike = false;
            }
        }
        else {
            innerComment.reactions = innerComment.reactions.concat({ isLike: false, user: currentUser, isDisLike: true });
        }
        /*innerPost.reactions = hasReaction
            ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
            : innerPost.reactions.concat({ isLike: false, user: currentUser, isDisLike: true });*/
        hasReaction = innerComment.reactions.some((x) => x.user.id === currentUser.id);

        return this.postService.DisLikeComment(reaction).pipe(
            map(() => innerComment),
            catchError(() => {
                // revert current array changes in case of any error
                innerComment.reactions = hasReaction
                    ? innerComment.reactions.filter((x) => x.user.id !== currentUser.id)
                    : innerComment.reactions.concat({ isLike: false, user: currentUser, isDisLike: true });

                return of(innerComment);
            })
        );
    }
}