import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { Post } from '../models/post/post';
import { NewReaction } from '../models/reactions/newReaction';
import { PostService } from './post.service';
import { User } from '../models/user';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class DisLikeService {
    public constructor(private authService: AuthenticationService, private postService: PostService) { }

    public DisLikePost(post: Post, currentUser: User) {

        const innerPost = post;

        const reaction: NewReaction = {
            entityId: innerPost.id,
            isDisLike: true,
            isLike: false,
            userId: currentUser.id
        };


        // update current array instantly
        let hasReaction = innerPost.reactions.some((x) => x.user.id === currentUser.id);
        if (hasReaction) {
            let check = innerPost.reactions.find((x) => x.user.id === currentUser.id).isDisLike;
            if (check == true) {
                reaction.isDisLike = false;
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isDisLike = false;
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isLike = false;
            }
            else {
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isDisLike = true;
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isLike = false;
            }
        }
        else {
            innerPost.reactions = innerPost.reactions.concat({ isLike: false, user: currentUser, isDisLike: true });
        }
        /*innerPost.reactions = hasReaction
            ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
            : innerPost.reactions.concat({ isLike: false, user: currentUser, isDisLike: true });*/
        hasReaction = innerPost.reactions.some((x) => x.user.id === currentUser.id);

        return this.postService.dislikePost(reaction).pipe(
            map(() => innerPost),
            catchError(() => {
                // revert current array changes in case of any error
                innerPost.reactions = hasReaction
                    ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
                    : innerPost.reactions.concat({ isLike: false, user: currentUser, isDisLike: true });

                return of(innerPost);
            })
        );
    }
}