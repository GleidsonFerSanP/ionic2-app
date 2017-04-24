import { Component } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoadingController } from 'ionic-angular';

import { NotificationsPage } from './../../notification/notifications/notifications';

import { AuthService } from './../../../providers/auth-service';
import { environment } from './../../../providers/environment';

import { Usuario } from './../../../model/usuario';
import { Device } from './../../../model/device';
import { CentiResponseObject } from './../../../model/centi-response-object';

import { LostPasswordModal } from '../lost-password/lost-password-modal.component';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  cidade: string;
  usuario: Usuario = new Usuario();
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    private toast: Toast,
    private platform: Platform,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController,
    private auth: AuthService,
    public loading: LoadingController) {

    this.loginForm = this.formBuilder.group({
      cidade: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  // setCity() {
  //   console.log(this.cidade);
  //   window.localStorage.setItem("cidade", this.cidade);
  // }

  login() {

    if (this.loginForm.invalid) {
      this.message('Por favor preenha a cidade seu usuário e sua senha');
      return;
    }
    window.localStorage.setItem("cidade", this.cidade);

    console.log(environment);
    
    this.submitAttempt = true;
    this.auth.login(this.usuario, (data) => {
      console.log(data);
      this.registerDeviceOnPushNotification(data.Value);
    })

  }

  private registerDeviceOnPushNotification(SessionId: string) {

    if (!this.platform.is("mobile")) {
      this.navCtrl.setRoot(NotificationsPage);
      return;
    }

    let deviceId: string = window.localStorage.getItem('pushToken');
    let device = new Device(deviceId, SessionId, this.usuario.User);
    this.sendRegister(device);
  }

  openModalLostPassoword() {
    let modal = this.modalCtrl.create(LostPasswordModal);
    modal.present();
  }

  private sendRegister(device: Device) {
    if (!device.DeviceId) {
      this.navCtrl.setRoot(NotificationsPage);
      return;
    }

    this.auth.registerDevice(device, (data: CentiResponseObject) => {
      if (data.Success)
        this.navCtrl.setRoot(NotificationsPage);
    })
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
