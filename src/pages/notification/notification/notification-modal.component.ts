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
    let authorized = this.navParams.get('Authorized');

    this.notification = new PushNotificationBuilder()
      .id(id)
      .title(title)
      .authorized(authorized)
      .type(type)
      .status(status)
      .message(message)
      .build();
  }

  sendConfirmNotification() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.diagnostic.isLocationEnabled().then((enable) => {

        if (enable === false) {
          this.message("Por favor ative o GPS");
          return;
        }

        this.captureLocationAndSubmit((data) => {

        })

      }, (error) => console.log(error));

    } else {
      this.captureLocationAndSubmit((response) => {

      });
    }

  }

  private captureLocationAndSubmit(callback) {
    this.geolocation.getCurrentPosition().then((location) => {
      let confirmNotification = new PushConfirm(
        this.notification.Authorized,
        this.notification.Id,
        location.coords.latitude,
        location.coords.longitude,
        window.localStorage.getItem("User"),
        this.device.uuid === null ? 'dev' : this.device.uuid,
        this.notification.Status,
        `${this.device.manufacturer}-${this.device.model}`);
      let submitting = false;

      if (!submitting) {
        submitting = true;
        this.notifService.update(confirmNotification, (response) => {
          console.log(response);
          setTimeout(function () {
            submitting = false;
          }, 1000);
          callback(response);
        })
      }
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
            this.notification.Authorized = 2;
            this.sendConfirmNotification();
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
            this.notification.Authorized = 1;
            this.sendConfirmNotification();
          }
        }
      ]
    });
    confirm.present();
  }
}