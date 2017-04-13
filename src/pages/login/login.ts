import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoadingController } from 'ionic-angular';

import { NotificationsPage } from './../notification/notifications/notifications';

import { AuthService } from './../../providers/auth-service';

import { Usuario } from './../../model/usuario';
import { Device } from './../../model/device';
import { CentiResponseObject } from './../../model/centi-response-object';

import { Unconnected } from '../pages/unconnected/unconnected';
import { Serverdown } from '../pages/serverdown/serverdown';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  usuario: Usuario = new Usuario();
  submitAttempt: boolean = false;
  loader = this.loading.create({
    content: 'Um momento por favor...',
  });

  constructor(
    public navCtrl: NavController,
    private toast: Toast,
    private platform: Platform,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    public loading: LoadingController) {

    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required],
      password: ['', Validators.compose([Validators.required])]
    });

  }

  login() {

    if (this.loginForm.invalid) {
      this.message('Por favor preenha seu Usuário e sua senha');
      return;
    }

    this.submitAttempt = true;

    this.loader.present().then(() => {
      this.auth.login(this.usuario)
        .subscribe((response) => {
          window.localStorage.setItem('User', this.usuario.User);
          this.filterResponse(response)
        }, (error) => {
          console.log(error);
          this.requestErrors(error);
          this.loader.dismiss();
        });
    });
  }

  private filterResponse(response) {

    var data: CentiResponseObject = response.json();
    if (data.Success) {

      window.localStorage.setItem('SessionId', data.Value);
      this.registerDeviceOnPushNotification(data.Value);

    }
    else {
      this.message(data.Message.join("\n"));
      window.localStorage.setItem('SessionId', '');
    }
  }

  private requestErrors(error) {

    switch (error.status) {
      case 404:
        this.message("404 - Página não encontrada");
        break;
      case 500:
        var message = JSON.parse(error._body);
        this.message(message.Message[0]);
        break;

      default:
        break;
    }
  }

  private registerDeviceOnPushNotification(SessionId: string) {

    if (!this.platform.is("mobile")){
      this.navCtrl.setRoot(NotificationsPage);
      this.loader.dismiss();
    }

    let deviceId: string = window.localStorage.getItem('pushToken');
    let device = new Device(deviceId, SessionId, this.usuario.User);
    this.sendRegister(device);
  }

  private sendRegister(device: Device) {
    if (!device.DeviceId) {
      this.loader.dismiss();
      return;
    }

    this.auth.registerDevice(device)
      .subscribe((res) => {
        var data: CentiResponseObject = res.json();
        this.loader.dismiss();
        if (data.Success)
          this.navCtrl.setRoot(NotificationsPage);

      }, (error) => console.log(error));
  }

  message(text: string) {

    console.log(this.platform);

    if (this.platform.is('android') || this.platform.is('ios')) {
      this.toast.show(text, '2000', 'center')
        .subscribe(
        toast => { console.log(toast); });

    } else {
      alert(text);
    }
  }

}
