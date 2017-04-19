import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { Platform, App } from 'ionic-angular';
import 'rxjs';

import { Toast } from '@ionic-native/toast';

import { Usuario } from './../model/usuario';
import { Device } from './../model/device';
import { CentiResponseObject } from './../model/centi-response-object';

import { LoadingController } from 'ionic-angular';

import { Service } from './service';

@Injectable()
export class AuthService extends Service {

    constructor(
        protected http: Http,
        protected toast: Toast,
        protected app: App,
        protected platform: Platform,
        protected loading: LoadingController) {
        super(http, toast, app, platform, loading);
    }

    public login(usuario: Usuario, callbackSucess) {
        this.post("/login", usuario, (data) => {
            let obj = data;
            console.log(data);
            if (obj.Success) {
                window.localStorage.setItem('User', usuario.User);
                window.localStorage.setItem('SessionId', data.Value);
                callbackSucess(obj);
                return;
            }

            this.generateMessages(obj);
        })
    }

    public registerDevice(device: Device, callback) {

        this.post('/regdevice', device, (data) => {
            this.processResult(data, callback);
        });
    }

    public unregisterDevice(usuario: Usuario, callback) {
        this.get('/devunregister?user=' + usuario.User, (data) => {
            this.processResult(data, callback);
        })
    }
    public forgetpass(usuario: Usuario, callback) {
        this.get('/forgetpass?user=' + usuario.User, (data) => {
            this.processResult(data, callback);
        });
    }

    private processResult(data, callback) {
        let obj = data;
        console.log(data);
        if (obj.Success) {
            callback(data);
            return;
        }

        this.generateMessages(obj);
    }
}
