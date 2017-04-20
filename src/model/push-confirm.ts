export class PushConfirm {
    Confirm: boolean;
    Id: string;
    Lt: number;
    Lg: number;
    User: string;
    IMEI: string;
    DeviceDescription: string;

    constructor(
        Confirm: boolean,
        Id: string,
        Lt: number,
        Lg: number,
        User: string,
        IMEI: string,
        DeviceDescription: string
    ) {

        this.Confirm = Confirm;
        this.Id = Id;
        this.Lt = Lt;
        this.Lg = Lg;
        this.User = User;
        this.IMEI = IMEI;
        this.DeviceDescription = DeviceDescription;
    }
}