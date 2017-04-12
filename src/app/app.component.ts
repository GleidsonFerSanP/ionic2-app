import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LocationTracker } from './../providers/location-tracker';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { StorageUtils } from './../providers/storage-utils';

import { NotificationsPage } from '../pages/notification/notifications/notifications';
import { LoginPage } from '../pages/login/login';

import { Unconnected } from '../pages/unconnected/unconnected';
import { Serverdown } from '../pages/serverdown/serverdown';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = Serverdown;
  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private push: Push,
    private storage: StorageUtils,
    private locationTracker: LocationTracker) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: NotificationsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.locationTracker.startTracking();

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
        var pushToken = null;
        this.storage.getItem('pushToken')
          .then((token) => pushToken = token)
          .catch((error) => console.warn(error));

        if (!pushToken) {
          this.storage.setItem('pushToken', registration.registrationId)
            .then(() => console.log('token push notifications registered'))
            .catch((e) => console.error(e))
        }

      });

    pushObject.on('error')
      .subscribe(
      error => console.error('Error with Push plugin', error)
      );

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message', data);
      if (data.additionalData.foreground) {

      } else {
        this.nav.setRoot(NotificationsPage, { message: data.message });
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

  logout() {
    this.locationTracker.stopTracking();
    this.storage.setItem('SessionId',null);
    this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
