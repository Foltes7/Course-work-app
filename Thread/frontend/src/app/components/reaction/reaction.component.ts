import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogType } from 'src/app/models/common/auth-dialog-type';
import { Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Reaction } from 'src/app/models/reactions/reaction';
import { User } from 'src/app/models/user';

@Component({
    templateUrl: './reaction.component.html',
    styleUrls: ['./reaction.component.sass']
})
export class ReactionComponent implements OnInit {

    @Input() public LikeUser: User[];
    @Input() public DisLikeUser: User[];
    constructor(
        @Inject(MAT_DIALOG_DATA) public Reaction: any
    ) { }

    ngOnInit() {
        this.LikeUser = this.Reaction.Reaction.filter(x => x.isLike == true).map(user => user.user);
        this.DisLikeUser = this.Reaction.Reaction.filter(x => x.isDisLike == true).map(user => user.user);
    }
}