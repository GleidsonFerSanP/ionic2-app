import { Component, OnInit, NgZone } from '@angular/core';

import { NavController, NavParams, AlertController, Platform, Events } from 'ionic-angular';

import { NotificationFormModal } from './../form/notification-form.modal.component';
import { NotificationModalComponent } from './../notification/notification-modal.component';

import { PushNotification } from './../../../model/push-notification';
import { PushNotificationBuilder } from './../../../model/push-notification.builder';

import { PushNotificationDao } from './../../../providers/push-notification-dao';

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
    private dao: PushNotificationDao,
    public events: Events,
    private ngZone: NgZone) {
  }

  ngOnInit() {
    this.ngZone.run(() => {
      this.platform.ready().then(() => {
        if (this.platform.is('android') || this.platform.is('ios'))
          this.listAllOnInit();
        else
          this.listaMock();
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

  private listAllOnInit() {
    this.notifications = [];
    this.dao.findAllOnInit((data) => {

      console.log(data);

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let push = this.createPush(data.rows.item(i));
          this.notifications.push(push);
        }
      }

      console.log(this.notifications);
    })
  }

  private listaMock() {
    let nots: Array<PushNotification> = [];
    nots.push(
      new PushNotificationBuilder()
        .id("$12")
        .message("esta é uma mensagem de teste mock")
        .submitted(false)
        .read(false)
        .title("Mensagem read")
        .type(0)
        .build()
    )
    nots.push(
      new PushNotificationBuilder()
        .id("g5J9$Z58teX")
        .message("esta é uma mensagem de teste mock")
        .read(false)
        .title("Mensagem boolean")
        .submitted(false)
        .type(1)
        .build()
    )
    nots.push(
      new PushNotificationBuilder()
        .id("$15")
        .message("esta é uma mensagem de teste mock fwetwertwetsdslapnouibsoipduanidjsfn piandsfi ndsiupnfuisdnifun sinfpidsngpuisn")
        .read(true)
        .title("Mensagem boolean 2")
        .type(1)
        .submitted(true)
        .build()
    )
    nots.push(
      new PushNotificationBuilder()
        .id("$12")
        .message("esta é uma mensagem de teste mock")
        .read(false)
        .title("Mensagem read")
        .submitted(false)
        .type(0)
        .build()
    )

    this.notifications = nots;
  }

  private listAll() {
    this.ngZone.run(() => {
      this.notifications = [];
      this.dao.findAll()
        .then((data) => {
          if (data.rows.length > 0) {
            for (var i = 0; i < data.rows.length; i++) {
              let push = this.createPush(data.rows.item(i))
              this.notifications.push(push);
            }

            console.log(this.notifications);
          }
        })
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
    push.Readed = obj.Readed === 1 ? true:false;
    push.Create = obj.CreateOn;
    push.Submitted = obj.Submitted  === 1 ? true:false;
    return push;

  }

  listNotifications(refresher) {
    if (this.platform.is('android') || this.platform.is('ios'))
      this.listAll();
    else
      this.listaMock();

    refresher.complete();
  }

  openForm(notification) {
    this.navCtrl.push(NotificationFormModal);
  }

  openPageContentNotification(notification) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      notification.Read = true;
      this.dao.update(notification, (data)=>{
         console.log(data);
        this.navCtrl.push(NotificationModalComponent, notification);
      })
    }
    else
      this.navCtrl.push(NotificationModalComponent, notification);
  }
}
