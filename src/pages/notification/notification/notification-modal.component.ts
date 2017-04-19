import { Component } from '@angular/core';

import { NavParams, AlertController } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { PushNotification } from './../../../model/push-notification';
import { PushNotificationBuilder } from './../../../model/push-notification.builder';
import { PushConfirm } from './../../../model/push-confirm';

import { NotificationService } from './../../../providers/notification-service';

@Component({
  selector: 'notification-modal',
  templateUrl: './notification-modal.component.html'
})
export class NotificationModalComponent {

  notification: PushNotification;

  constructor(
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private notifService: NotificationService,
    private geolocation: Geolocation) {

    this.loadNotification();

    console.log(this.notification);
  }

  loadNotification() {
    let id = this.navParams.get('Id');
    let type = this.navParams.get('Type');
    let read = this.navParams.get('Read');
    let title = this.navParams.get('Title');
    let message = this.navParams.get('Message');

    this.notification = new PushNotificationBuilder()
      .id(id)
      .title(title)
      .type(type)
      .read(read)
      .message(message)
      .build();
  }

  sendConfirmNotification(option: boolean) {

    this.geolocation.getCurrentPosition().then((location) => {
      console.log(location);
      let confirmNotification = new PushConfirm(
        option,
        this.notification.Id,
        location.coords.latitude,
        location.coords.longitude,
        window.localStorage.getItem("User"));
        
      this.notifService.submitTypeBoolean(confirmNotification, (data) => {
          console.log(data);
      })

    })
  }

  yes() {
    let confirm = this.alertCtrl.create({
      title: 'Você tem certeza?',
      message: 'Que deseja confirmar?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            console.log('Agree clicked');
            this.sendConfirmNotification(true);
          }
        }
      ]
    });
    confirm.present();
  }
  no() {
    let confirm = this.alertCtrl.create({
      title: 'Você tem certeza?',
      message: 'Que deseja cancelar?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            console.log('Agree clicked');
            this.sendConfirmNotification(false);
          }
        }
      ]
    });
    confirm.present();
  }
}