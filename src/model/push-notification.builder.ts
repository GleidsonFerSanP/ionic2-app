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
    public read(read: boolean): PushNotificationBuilder{
        this.push.Read = read;
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