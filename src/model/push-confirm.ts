export class PushConfirm {
    Confirm: boolean;
    Id: string;
    Lt: number;
    Lg: number;
    User: string;

    constructor(
        Confirm: boolean,
        Id: string,
        Lt: number,
        Lg: number,
        User: string) {

        this.Confirm = Confirm;
        this.Id = Id;
        this.Lt = Lt;
        this.Lg = Lg;
        this.User = User;
    }
}