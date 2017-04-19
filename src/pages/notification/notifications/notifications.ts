import { Component, OnInit, NgZone } from '@angular/core';

import { NavController, NavParams, ModalController, AlertController, Platform, Events } from 'ionic-angular';

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
    public modalCtrl: ModalController,
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
        .build()
    )
    nots.push(
      new PushNotificationBuilder()
        .id("$12")
        .message("esta é uma mensagem de teste mock")
        .read(false)
        .title("Mensagem read")
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
    let push = new PushNotification();
    push.Id = obj.Id;
    push.Type = obj.Type;
    push.Title = obj.Title;
    push.Message = obj.Message;
    push.Read = obj.READ;
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
    let modal = this.modalCtrl.create(NotificationFormModal);
    modal.present();
  }

  openPageContentNotification(notification) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      notification.Read = true;
      this.dao.update(notification).then((data) => {
        console.log(data);
        this.navCtrl.push(NotificationModalComponent, notification);
      }, (error) => console.log(error))
        .catch((error) => console.log(error));
    }
    else
      this.navCtrl.push(NotificationModalComponent, notification);
  }
}
