import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';

import { httpFactory } from "../providers/http-factory";

import { Push } from '@ionic-native/push';

import { Toast } from '@ionic-native/toast';

import { MyApp } from './app.component';

import { NativeStorage } from '@ionic-native/native-storage';
import { StorageUtils } from './../providers/storage-utils';

import { AuthService } from '../providers/auth-service';

import { LocationTracker } from '../providers/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';

import { Unconnected } from '../pages/unconnected/unconnected';
import { Serverdown } from '../pages/serverdown/serverdown';

import { NotificationPageModule } from './../pages/notification/notification.module'
import { LoginPageModule } from './../pages/login/login.module'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    Unconnected,
    Serverdown
  ],
  imports: [
    BrowserModule,
    NotificationPageModule,
    LoginPageModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Unconnected,
    Serverdown
  ],
  providers: [
    LocationTracker,
    NativeStorage,
    Toast,
    BackgroundGeolocation,
    Push,
    Geolocation,
    AuthService,
    StorageUtils,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, LocationTracker]
    }
  ]
})
export class AppModule { }
