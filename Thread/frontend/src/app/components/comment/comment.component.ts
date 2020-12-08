import { Component, Input, OnInit, DoCheck } from '@angular/core';
import { Comment } from 'src/app/models/comment/comment';
import { empty, Observable, Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { DialogType } from 'src/app/models/common/auth-dialog-type';
import { CommentReactionService } from 'src/app/services/commentReaction.service';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.sass']
})
export class CommentComponent implements OnInit, DoCheck {

    @Input() public comment: Comment;
    @Input() public currentUser: User;
    @Input() public like: number;
    @Input() public dislike: number;
    private unsubscribe$ = new Subject<void>();

    public constructor(
        private reactionService: CommentReactionService
    ) { }

    public ngOnInit() {
        this.like = this.comment.reactions.filter((x) => x.isLike === true).length;
        this.dislike = this.comment.reactions.filter((x) => x.isDisLike === true).length;
    }
    public ngDoCheck() {
        this.like = this.comment.reactions.filter((x) => x.isLike === true).length;
        this.dislike = this.comment.reactions.filter((x) => x.isDisLike === true).length;
    }

    public CommentLike() {

        this.reactionService
            .CommentLikeReaction(this.comment, this.currentUser)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((comment) => (this.comment = comment));
    }
    public CommentDisLike() {
        this.reactionService
            .CommentDisLikeReaction(this.comment, this.currentUser)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((comment) => (this.comment = comment));
    }
}
