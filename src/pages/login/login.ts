import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NotificationsPage } from './../notification/notifications/notifications';

import { AuthService } from './../../providers/auth-service';

import { Usuario } from './../../model/usuario';
import { Device } from './../../model/device';
import { CentiResponseObject } from './../../model/centi-response-object';

import { StorageUtils } from './../../providers/storage-utils';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  usuario: Usuario = new Usuario();
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    private toast: Toast,
    private platform: Platform,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private storage: StorageUtils) {

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

    this.storage.setItem("teste", { id: 1 });

    this.submitAttempt = true;

    this.auth.login(this.usuario)
      .subscribe((response) => {
        this.filterResponse(response)
      }, (error) => {
        console.log(error);
        this.requestErrors(error);
      });
  }

  private filterResponse(response) {

    var data: CentiResponseObject = response.json();
    if (data.Success) {
      this.storage.setItem('SessionId', data.Value);
      this.storage.getItem("pushToken")
        .then((arg) => {

          let deviceId: string = arg.toString();
          let device = new Device(deviceId, data.Value, this.usuario.User);
          this.auth.registerDevice(device)
            .subscribe((res) => {
              var data1: CentiResponseObject = res.json();
              if (data1.Success)
                this.navCtrl.setRoot(NotificationsPage);
            }, (error) => console.log(error));
        }
      );

    }
    else {
      this.message(data.Message.join("\n"));
      this.storage.setItem('SessionId', null);
    }
  }

  requestErrors(error) {

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
