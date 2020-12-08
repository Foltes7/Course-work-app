import { Injectable, OnDestroy } from '@angular/core';
import { DialogType } from '../models/common/auth-dialog-type';
import { ReactionComponent } from '../components/reaction/reaction.component';
import { User } from '../models/user';
import { MatDialog } from '@angular/material';
import { map, takeUntil } from 'rxjs/operators';
import { Subscription, Subject, from } from 'rxjs';
import { Reaction } from 'src/app/models/reactions/reaction';
import { LikeService } from './like.service';

@Injectable({ providedIn: 'root' })

export class ShowReactionService {

    public constructor(private dialog: MatDialog) { }

    public OpenReactionDialog(type: Reaction[]) {
        this.dialog.open(ReactionComponent, {
            data: { Reaction: type },
            maxHeight: 500,
            maxWidth: 500,
            restoreFocus: false,
            backdropClass: 'dialog-backdrop',
            position: {
                top: '0'
            }
        });
    }
}