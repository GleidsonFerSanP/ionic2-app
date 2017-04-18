import { Component, OnInit } from '@angular/core';

import { NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';

import { NotificationFormModal } from './../form/notification-form.modal.component';
import { NotificationReadyContentComponent } from './../notification-ready-content/notification-ready-content.component';

import { PushNotification } from './../../../model/push-notification';

import { PushNotificationDao } from './../../../providers/push-notification-dao';

@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notifications.html'
})
export class NotificationsPage implements OnInit {

  readyContentPage = NotificationReadyContentComponent;
  notifications: Array<PushNotification> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private platform: Platform,
    public alertCtrl: AlertController,
    private dao: PushNotificationDao) {

  }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.listAllOnInit();
      }
    })
  }

  private listAllOnInit() {
    this.notifications = [];
    this.dao.findAllOnInit((data) => {

      console.log(data);

      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          let push = new PushNotification();
          let obj = data.rows.item(i);
          push.Id = obj.Id;
          push.Type = obj.Type;
          push.Title = obj.Title;
          push.Message = obj.Message;
          push.Read = obj.READ;
          this.notifications.push(push);
        }
      }

      console.log(this.notifications);
    })
  }
  private listAll() {
    this.notifications = [];
    this.dao.findAll()
      .then((data) => {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let push = new PushNotification();
            let obj = data.rows.item(i);
            push.Id = obj.Id;
            push.Type = obj.Type;
            push.Title = obj.Title;
            push.Message = obj.Message;
            push.Read = obj.READ;
            this.notifications.push(push);
          }

          console.log(this.notifications);
        }
      })
  }

  listNotifications(refresher) {
    this.listAll();
    refresher.complete();
  }

  openForm(notification) {
    let modal = this.modalCtrl.create(NotificationFormModal);
    modal.present();
  }

  openPageContentNotification(notification) {
    this.navCtrl.push('NotificationReadyContentComponent', this.navParams.data(notification))
  }
}
