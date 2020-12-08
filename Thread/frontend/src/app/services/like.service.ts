import { Injectable } from '@angular/core';
import { AuthenticationService } from './auth.service';
import { Post } from '../models/post/post';
import { NewReaction } from '../models/reactions/newReaction';
import { PostService } from './post.service';
import { User } from '../models/user';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LikeService {
    public constructor(private authService: AuthenticationService, private postService: PostService) { }

    public likePost(post: Post, currentUser: User) {
        const innerPost = post;

        const reaction: NewReaction = {
            entityId: innerPost.id,
            isDisLike: false,
            isLike: true,
            userId: currentUser.id
        };

        // update current array instantly
        let hasReaction = innerPost.reactions.some((x) => x.user.id === currentUser.id);
        if (hasReaction) {
            let check = innerPost.reactions.find((x) => x.user.id === currentUser.id).isLike;
            if (check == true) {
                reaction.isLike = false;
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isDisLike = false;
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isLike = false;
            }
            else {
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isDisLike = false;
                innerPost.reactions.find((x) => x.user.id === currentUser.id).isLike = true;
            }
        }
        else {
            innerPost.reactions = innerPost.reactions.concat({ isLike: true, user: currentUser, isDisLike: false });
        }
        /* innerPost.reactions = hasReaction
             ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
             : innerPost.reactions.concat({ isLike: true, user: currentUser, isDisLike: false });*/
        hasReaction = innerPost.reactions.some((x) => x.user.id === currentUser.id);

        return this.postService.likePost(reaction).pipe(
            map(() => innerPost),
            catchError(() => {
                // revert current array changes in case of any error
                innerPost.reactions = hasReaction
                    ? innerPost.reactions.filter((x) => x.user.id !== currentUser.id)
                    : innerPost.reactions.concat({ isLike: true, user: currentUser, isDisLike: false });

                return of(innerPost);
            })
        );
    }
}
