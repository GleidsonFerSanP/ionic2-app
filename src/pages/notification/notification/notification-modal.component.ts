import { Component } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Device } from '@ionic-native/device';

import { NavParams, AlertController, Platform, Events } from 'ionic-angular';

import { Toast } from '@ionic-native/toast';

import { Geolocation } from '@ionic-native/geolocation';
import { PushNotification } from './../../../model/push-notification';
import { PushNotificationBuilder } from './../../../model/push-notification.builder';
import { PushConfirm } from './../../../model/push-confirm';
import { NotificationService } from './../../../providers/notification-service';
import { Page } from './../../page';

@Component({
  selector: 'notification-modal',
  templateUrl: './notification-modal.component.html'
})
export class NotificationModalComponent extends Page {

  notification: PushNotification;

  constructor(
    public events: Events,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private notifService: NotificationService,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic,
    public platform: Platform,
    public toast: Toast,
    private device: Device) {

    super(toast, platform);

    this.loadNotification();
  }

  loadNotification() {
    let id = this.navParams.get('Id');
    let type = this.navParams.get('Type');
    let status = this.navParams.get('Status');
    let title = this.navParams.get('Title');
    let message = this.navParams.get('Message');

    this.notification = new PushNotificationBuilder()
      .id(id)
      .title(title)
      .type(type)
      .status(status)
      .message(message)
      .build();
  }

  sendConfirmNotification(option: boolean) {

    this.diagnostic.isLocationEnabled().then((enable) => {

      if (enable === false) {
        this.message("Por favor ative o GPS");
        return;
      }

      this.geolocation.getCurrentPosition().then((location) => {
        console.log(location);
        let confirmNotification = new PushConfirm(
          option,
          this.notification.Id,
          location.coords.latitude,
          location.coords.longitude,
          window.localStorage.getItem("User"),
          this.device.uuid,
          `${this.device.manufacturer}-${this.device.model}`);

        this.notifService.submitTypeBoolean(confirmNotification, (data) => {
          console.log(data);
          if (data.Success) {

            this.notification.Status = 3;
            // this.dao.update(this.notification, ()=>{
            //    console.log(data);
            //   this.events.publish('notification:update', {}, Date.now());
            // })

          }
        })

      }, (error) => { console.log(error) });

    }, (error) => console.log(error));

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