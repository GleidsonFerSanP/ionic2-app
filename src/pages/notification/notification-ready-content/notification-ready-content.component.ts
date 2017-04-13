import { Component, OnInit } from '@angular/core';

import { NavParams, AlertController } from 'ionic-angular';

import { PushNotification } from './../../../model/push-notification';

@Component({
  selector: 'app-notification-ready-content',
  templateUrl: './notification-ready-content.component.html'
})
export class NotificationReadyContentComponent implements OnInit {

  notification: PushNotification;

  constructor(private navParams: NavParams, private alertCtrl: AlertController) {

    this.notification = this.navParams.get('notification');

  }

  ngOnInit() {
  }

  sim(){
 let confirm = this.alertCtrl.create({
      title: 'Você tem certeza?',
      message: 'Que este texto está correto?',
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
          }
        }
      ]
    });
    confirm.present(); 
 }
  nao(){
 let confirm = this.alertCtrl.create({
      title: 'Você tem certeza?',
      message: 'Que este texto está correto?',
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
          }
        }
      ]
    });
    confirm.present();
  }
}