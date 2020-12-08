import { Component, Input, OnDestroy, OnInit, DoCheck, Inject, ViewChild, ElementRef } from '@angular/core';
import { Post } from 'src/app/models/post/post';
import { AuthenticationService } from 'src/app/services/auth.service';
import { AuthDialogService } from 'src/app/services/auth-dialog.service';
import { empty, Observable, Subject } from 'rxjs';
import { DialogType } from 'src/app/models/common/auth-dialog-type';
import { LikeService } from 'src/app/services/like.service';
import { DisLikeService } from 'src/app/services/dislike.service';
import { NewComment } from 'src/app/models/comment/new-comment';
import { CommentService } from 'src/app/services/comment.service';
import { User } from 'src/app/models/user';
import { Comment } from 'src/app/models/comment/comment';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialog } from '@angular/material';
import { MainThreadComponent } from 'src/app/components/main-thread/main-thread.component';
import { ShowReactionService } from 'src/app/services/show-reaction.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.sass']
})
export class PostComponent implements OnDestroy, OnInit, DoCheck {

    @Input() public post: Post;
    @Input() public currentUser: User;
    @Input() public like: number;
    @Input() public dislike: number;

    @ViewChild('buttons', { static: false })
    public deleteButton: ElementRef;

    public showComments = false;
    public newComment = {} as NewComment;

    private unsubscribe$ = new Subject<void>();

    public constructor(
        private authService: AuthenticationService,
        private authDialogService: AuthDialogService,
        private likeService: LikeService,
        private commentService: CommentService,
        private snackBarService: SnackBarService,
        private dislikeservice: DisLikeService,
        public dialog: MatDialog,
        private mainThreadComponent: MainThreadComponent,
        private showReactionService: ShowReactionService
    ) {
    }
    public ngOnInit() {
        this.like = this.post.reactions.filter((x) => x.isLike === true).length;
        this.dislike = this.post.reactions.filter((x) => x.isDisLike === true).length;
    }
    public ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    public ngDoCheck() {
        this.like = this.post.reactions.filter((x) => x.isLike === true).length;
        this.dislike = this.post.reactions.filter((x) => x.isDisLike === true).length;
    }
    public DeletePost() {
        this.mainThreadComponent.SendDeletePost(this.post);
    }
    public toggleComments() {
        if (!this.currentUser) {
            this.catchErrorWrapper(this.authService.getUser())
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((user) => {
                    if (user) {
                        this.currentUser = user;
                        this.showComments = !this.showComments;
                    }
                });
            return;
        }

        this.showComments = !this.showComments;
    }

    public likePost() {
        if (!this.currentUser) {
            this.catchErrorWrapper(this.authService.getUser())
                .pipe(
                    switchMap((userResp) => this.likeService.likePost(this.post, userResp)),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe((post) => (this.post = post));

            return;
        }
        this.likeService
            .likePost(this.post, this.currentUser)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((post) => (this.post = post));

    }
    public DislikePost() {
        if (!this.currentUser) {
            this.catchErrorWrapper(this.authService.getUser())
                .pipe(
                    switchMap((userResp) => this.dislikeservice.DisLikePost(this.post, userResp)),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe((post) => (this.post = post));

            return;
        }
        this.dislikeservice
            .DisLikePost(this.post, this.currentUser)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((post) => (this.post = post));
    }

    public sendComment() {
        this.newComment.authorId = this.currentUser.id;
        this.newComment.postId = this.post.id;

        this.commentService
            .createComment(this.newComment)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (resp) => {
                    if (resp) {
                        this.post.comments = this.sortCommentArray(this.post.comments.concat(resp.body));
                        this.newComment.body = undefined;
                    }
                },
                (error) => this.snackBarService.showErrorMessage(error)
            );
    }

    public openAuthDialog() {
        this.authDialogService.openAuthDialog(DialogType.SignIn);
    }
    public ShowReaction() {
        if (!this.currentUser) {
            this.catchErrorWrapper(this.authService.getUser())
                .pipe(
                    switchMap((userResp) => this.likeService.likePost(this.post, userResp)),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe((post) => (this.post = post));

            return;
        }
        this.showReactionService.OpenReactionDialog(this.post.reactions);
    }
    public Share() {
        if (!this.currentUser) {
            this.catchErrorWrapper(this.authService.getUser())
                .pipe(
                    switchMap((userResp) => this.likeService.likePost(this.post, userResp)),
                    takeUntil(this.unsubscribe$)
                )
                .subscribe((post) => (this.post = post));

            return;
        }
        this.dialog.open(DialogDataExampleDialog, { restoreFocus: false });
    }
    private catchErrorWrapper(obs: Observable<User>) {
        return obs.pipe(
            catchError(() => {
                this.openAuthDialog();
                return empty();
            })
        );
    }

    private sortCommentArray(array: Comment[]): Comment[] {
        return array.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
}

// tslint:disable-next-line:max-classes-per-file
@Component({
    selector: 'app-post-dialog',
    templateUrl: 'post-component-share.html',
})
export class DialogDataExampleDialog {
    // tslint:disable-next-line:no-empty
    constructor() {

     }

}
