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
export class NotificationsPage implements OnInit{

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

  ngOnInit(){
      if(this.platform.is('mobile'))
      this.listAll(); 
  }

  private listAll() {
    this.dao.findAll()
      .then((data) => {
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            let push = new PushNotification();
            push.Id = data.rows.item(i);
            push.Type = data.rows.item(i);
            push.Title = data.rows.item(i);
            push.Message = data.rows.item(i);
            push.Read = data.rows.item(i);
            this.notifications.push(push);
          }
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
