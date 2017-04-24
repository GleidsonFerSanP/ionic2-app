import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, Events, ItemSliding } from 'ionic-angular';
import { NotificationFormModal } from './../form/notification-form.modal.component';
import { NotificationModalComponent } from './../notification/notification-modal.component';
import { PushNotification } from './../../../model/push-notification';
import { PushNotificationBuilder } from './../../../model/push-notification.builder';
import { NotificationService } from './../../../providers/notification-service';

@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notifications.html'
})
export class NotificationsPage implements OnInit {

  readyContentPage = NotificationModalComponent;
  notifications: Array<PushNotification> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    public alertCtrl: AlertController,
    private notificationService: NotificationService,
    public events: Events,
    private ngZone: NgZone) {
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

  private listMock() {
    let nots: Array<PushNotification> = [];
    nots.push(
      new PushNotificationBuilder()
        .id("$12")
        .message("esta é uma mensagem de teste mock")
        .title("Mensagem read")
        .type(0)
        .build()
    )
    nots.push(
      new PushNotificationBuilder()
        .id("g5J9$Z58teX")
        .message("esta é uma mensagem de teste mock")
        .title("Mensagem boolean")
        .type(1)
        .build()
    )
    nots.push(
      new PushNotificationBuilder()
        .id("$15")
        .message("esta é uma mensagem de teste mock fwetwertwetsdslapnouibsoipduanidjsfn piandsfi ndsiupnfuisdnifun sinfpidsngpuisn")
        .title("Mensagem boolean 2")
        .type(1)
        .build()
    )
    nots.push(
      new PushNotificationBuilder()
        .id("$12")
        .message("esta é uma mensagem de teste mock")
        .title("Mensagem read")
        .status(1)
        .type(0)
        .build()
    )

    this.notifications = nots;
  }

  private listAll() {
    this.ngZone.run(() => {
      this.notifications = [];
      this.listMock();
      // this.notificationService.findAll((data)=>{
      //     this.listNotifications = data;
      // });
    });
  }

  private createPush(obj): PushNotification {
    console.log('OBJECT CREATED');
    console.log(obj);
    let push = new PushNotification();
    push.Id = obj.Id;
    push.Type = obj.Type;
    push.Title = obj.Title;
    push.Message = obj.Message;
    return push;

  }

  listNotifications(refresher) {
    if (this.platform.is('android') || this.platform.is('ios'))
      this.listAll();
    else
      this.listMock();

    refresher.complete();
  }

  openForm(notification) {
    this.navCtrl.push(NotificationFormModal);
  }

  delete(slidingItem: ItemSliding, notification: PushNotification) {
    this.ngZone.run(() => {
      let percent = slidingItem.getOpenAmount();
      let submitting = false;
      console.log(percent);
      if (percent > 100) {
        console.log(notification);
        let index = this.notifications.indexOf(notification);
        notification.Status = 2;

        if (!submitting) {
          submitting = true;
          this.notificationService.update(notification, (response) => {
            console.log(response);
            submitting = false;
            this.notifications.splice(index, 1);
          })
        }
      }
    });
  }

  openPageContentNotification(notification) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      notification.Status = 1;
      this.notificationService.update(notification, (response) => {
        console.log(response);
        this.navCtrl.push(NotificationModalComponent, notification);
      })
    }
    else
      this.navCtrl.push(NotificationModalComponent, notification);
  }
}
