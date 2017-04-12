export class Device{

    DeviceId: string;
	SessionId: string;
	User: string;

    constructor(DeviceId: string, SessionId: string, User: string) {
        this.DeviceId = DeviceId;
        this.SessionId = SessionId;
        this.User = User;
    }

}