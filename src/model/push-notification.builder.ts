import { PushNotification } from './push-notification';

export class PushNotificationBuilder{
    private push: PushNotification;

    constructor(){
        this.push = new PushNotification();
    }

    public id(id: string): PushNotificationBuilder{
        this.push.Id = id;
        return this;
    }

    public title(title: string): PushNotificationBuilder{
        this.push.Title = title;
        return this;
    }

    public type(type: number): PushNotificationBuilder{
        this.push.Type = type;
        return this;
    }
    public status(status: number): PushNotificationBuilder{
        this.push.Status = status;
        return this;
    }
    public authorized(aut: number): PushNotificationBuilder{
        this.push.Authorized = aut;
        return this;
    }
    public message(message: string): PushNotificationBuilder{
        this.push.Message = message;
        return this;
    }
    public build(): PushNotification{
        return this.push;
    }
}