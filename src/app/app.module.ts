import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavModule } from 'ionic-angular';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { Device } from '@ionic-native/device';
import { SQLite } from '@ionic-native/sqlite';
import { httpFactory } from "../providers/http-factory";
import { Push } from '@ionic-native/push';
import { Toast } from '@ionic-native/toast';
import { MyApp } from './app.component';
import { StorageUtils } from './../providers/storage-utils';
import { AuthService } from '../providers/auth-service';
import { NotificationService} from '../providers/notification-service';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Unconnected } from '../pages/unconnected/unconnected';
import { Serverdown } from '../pages/serverdown/serverdown';
import { NotificationPageModule } from './../pages/notification/notification.module';
import { AuthModule } from './../pages/auth/auth.module';
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
    AuthModule,
    HttpModule,
    NavModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Unconnected,
    Serverdown
  ],
  providers: [
    SQLite,
    Toast,
    BackgroundGeolocation,
    Push,
    Geolocation,
    AuthService,
    NotificationService,
    Network,
    Diagnostic,
    Device,
    StorageUtils,
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ]
})
export class AppModule { }
