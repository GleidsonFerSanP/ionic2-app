import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, Events, ItemSliding } from 'ionic-angular';
import { NotificationModalComponent } from './../notification/notification-modal.component';
import { PushNotification } from './../../../model/push-notification';
import { NotificationService } from './../../../providers/notification-service';
import { Geolocation } from '@ionic-native/geolocation';
import { Toast } from '@ionic-native/toast';
import { Device } from '@ionic-native/device';
import { PushConfirm } from './../../../model/push-confirm';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Page } from './../../page';

@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notifications.html'
})
export class NotificationsPage extends Page implements OnInit {

  readyContentPage = NotificationModalComponent;
  notifications: Array<PushNotification> = [];
  submited = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private notificationService: NotificationService,
    private diagnostic: Diagnostic,
    private device: Device,
    public events: Events,
    public toast: Toast,
    private ngZone: NgZone) {
    super(toast, platform);
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.platform.ready().then(() => {
        this.listAll();
      })

      this.events.subscribe('notification:created', (user, time) => {
        console.log("new notification received");
        this.listAll();
      });
      this.events.subscribe('notification:update', (user, time) => {
        console.log("notifications update");
        this.listAll();
      });
    });
  }

  private listAll() {
    //this.listMock();
    this.notificationService.findAll((data) => {
      console.log(data);
      this.ngZone.run(() => {
        this.notifications = [];
        this.notifications = data.Pushs;
      });
    });
  }

  listNotifications(refresher) {
    this.listAll();
    refresher.complete();
  }

  delete(slidingItem: ItemSliding, notification: PushNotification) {
    this.ngZone.run(() => {
      let percent = slidingItem.getOpenAmount();
      if (percent > 100) {
        notification.Status = 2;
        let index = this.notifications.indexOf(notification);
        this.updateNotification(notification, (response) => {
          this.notifications.splice(index, 1);
        });

      }
    });
  }

  private updateNotification(notification: PushNotification, callback) {
    if (this.platform.is('android') || this.platform.is('ios')) {

      this.diagnostic.isLocationEnabled().then((enable) => {
        if (enable === false) {
          this.message("Por favor ative o GPS");
          return;
        }
        this.captureLocationAndSubmit(notification, callback);
      }, (error) => console.log(error));
    } else {
      this.captureLocationAndSubmit(notification, callback);
    }
  }

  private captureLocationAndSubmit(notification: PushNotification, callback) {
    this.geolocation.getCurrentPosition().then((location) => {
      let confirmNotification = new PushConfirm(
        notification.Authorized,
        notification.Id,
        location.coords.latitude,
        location.coords.longitude,
        window.localStorage.getItem("User"),
        this.device.uuid === null ? 'dev' : this.device.uuid,
        notification.Status,
        `${this.device.manufacturer}-${this.device.model}`);

      if (!this.submited) {
        this.submited = true;
        this.notificationService.update(confirmNotification, (response) => {
          console.log(response);
          setTimeout(function () {
          }, 1000);
          this.submited = false;
          callback(response);
        })
      }
    }, (error) => console.log(error));
  }

  openPageContentNotification(notification) {
    console.log(notification);

    if (notification.Status > 0) {
      this.navCtrl.push(NotificationModalComponent, notification);
      return;
    }
    notification.Status = 1;
    this.updateNotification(notification, (response) => {
      this.navCtrl.push(NotificationModalComponent, notification);
    })
  }
}
