import { Injectable } from '@angular/core';
import { HttpInternalService } from './http-internal.service';
import { Post } from '../models/post/post';
import { Comment } from '../models/comment/comment';
import { NewReaction } from '../models/reactions/newReaction';
import { NewPost } from '../models/post/new-post';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
    public routePrefix = '/api/posts';
    public routeComment = '/api/comments';

    constructor(private httpService: HttpInternalService) { }

    public getPosts() {
        return this.httpService.getFullRequest<Post[]>(`${this.routePrefix}`);
    }

    public createPost(post: NewPost) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}`, post);
    }

    public likePost(reaction: NewReaction) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}/like`, reaction);
    }
    public dislikePost(reaction: NewReaction) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}/dislike`, reaction);
    }
    public likeComment(reaction: NewReaction) {
        return this.httpService.postFullRequest<Comment>(`${this.routeComment}/like`, reaction);
    }
    public DisLikeComment(reaction: NewReaction) {
        return this.httpService.postFullRequest<Comment>(`${this.routeComment}/dislike`, reaction);
    }
    public deletePost(post: Post) {
        return this.httpService.postFullRequest<Post>(`${this.routePrefix}/delete`, post);
    }
}
