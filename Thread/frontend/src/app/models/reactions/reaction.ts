import { User } from '../user';

export interface Reaction {
    isLike: boolean;
    isDisLike: boolean;
    user: User;
}
