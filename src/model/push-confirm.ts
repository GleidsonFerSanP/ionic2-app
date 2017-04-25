export class PushConfirm {
    Authorized: number;
    Id: string;
    Lt: number;
    Lg: number;
    User: string;
    IMEI: string;
    Status: number;
    DeviceDescription: string;

    constructor(
        Authorized: number,
        Id: string,
        Lt: number,
        Lg: number,
        User: string,
        IMEI: string,
        Status: number,
        DeviceDescription: string
    ) {

        this.Authorized = Authorized;
        this.Id = Id;
        this.Lt = Lt;
        this.Lg = Lg;
        this.User = User;
        this.IMEI = IMEI;
        this.Status = Status;
        this.DeviceDescription = DeviceDescription;
    }
}