import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { AuthService } from './../providers/auth-service';
import { PushNotificationDao } from './../providers/push-notification-dao';

import { Network } from '@ionic-native/network';

import { Usuario } from './../model/usuario';
import { PushNotification } from './../model/push-notification';

import { NotificationsPage } from '../pages/notification/notifications/notifications';
import { LoginPage } from '../pages/auth/login/login';
import { Unconnected } from '../pages/unconnected/unconnected';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  usuario: Usuario = new Usuario();

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private auth: AuthService,
    private push: Push,
    private pushNotificationDAO: PushNotificationDao,
    private network: Network) {

    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {

      let SessionId = window.localStorage.getItem('SessionId');
      let User = window.localStorage.getItem('User');

      if (User) {
        this.usuario.User = User;
      }

      if(!navigator.onLine)
        this.rootPage = Unconnected;
      else if (SessionId)
        this.rootPage = NotificationsPage;
      else
        this.rootPage = LoginPage;

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.listenerConnection();
      this.initializeListenerNotification();

    });
  }

  initializeListenerNotification() {
    const options: PushOptions = {
      android: {
        senderID: '1002983514235'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration')
      .subscribe((registration: any) => {
        console.log('Device registered', registration);
        window.localStorage.setItem('pushToken', registration.registrationId);
      });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data);

      this.savePushNotificate(data.additionalData.tag);

      if (data.additionalData.foreground) {
        console.log('message', data);
      } else {
        this.nav.setRoot(NotificationsPage, { notification: data.message });
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  private savePushNotificate(push: PushNotification) {
    console.log(push);

    push.Read = 0;

    this.pushNotificationDAO.save(push)
      .then((data) => {
        console.info('Push salva com sucesso: ');
        console.info(data);
      }, (error) => console.log(error));

  }

  logout() {
    this.unregisterPushNotifications();
    window.localStorage.setItem('SessionId', '');
    window.localStorage.setItem('User', '');
    this.nav.setRoot(LoginPage);
  }

  unregisterPushNotifications() {
    var User = window.localStorage.getItem('User');

    if (User) {
      this.usuario = new Usuario();
      this.usuario.User = User;
    }

    if (!this.usuario)
      return;

    this.auth.unregisterDevice(this.usuario, (data) => {
      console.log(data);
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  listenerConnection() {
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.nav.setRoot(Unconnected);
    });

    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      let page;
      let SessionId = window.localStorage.getItem('SessionId');
      let User = window.localStorage.getItem('User');

      if (User) {
        this.usuario.User = User;
      }

      if (SessionId)
        page = NotificationsPage;
      else
        page = LoginPage;

      this.nav.setRoot(page);

    });
  }
}


