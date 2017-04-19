import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs';
import { Platform, App } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

import { Toast } from '@ionic-native/toast';

import { Service } from './service';

import { PushConfirm } from './../model/push-confirm';

@Injectable()
export class NotificationService extends Service {

   constructor(
        protected http: Http,
        protected toast: Toast,
        protected app: App,
        protected platform: Platform,
        protected loading: LoadingController) {
        super(http, toast, app, platform, loading);
    }

    public submitTypeBoolean(pushConfirm: PushConfirm, callbackSucess) {
        console.log(pushConfirm);
        this.post("/pshconfirm", pushConfirm , (data) => {
            let obj = data;
            console.log(data);
            if (obj.Success) {
                callbackSucess(obj);
                return;
            }

            this.generateMessages(obj);
        })
    }

}
