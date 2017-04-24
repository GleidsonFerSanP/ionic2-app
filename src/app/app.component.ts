import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AuthService } from './../providers/auth-service';
import { Network } from '@ionic-native/network';
import { Usuario } from './../model/usuario';
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
    private network: Network,
    public events: Events) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      let SessionId = window.localStorage.getItem('SessionId');
      let User = window.localStorage.getItem('User');

      if (User) {
        this.usuario.User = User;
      }

      if (!navigator.onLine)
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
      if (data.additionalData.foreground) {
        console.log('message', data);
      } else {
        this.nav.setRoot(NotificationsPage, { notification: data.message });
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  logout() {
    this.unregisterPushNotifications();
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
      this.clearStorage();
      this.nav.setRoot(LoginPage);
    });
  }

  private clearStorage() {
    window.localStorage.setItem('SessionId', '');
    window.localStorage.setItem('User', '');
    window.localStorage.setItem('cidade', '');
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