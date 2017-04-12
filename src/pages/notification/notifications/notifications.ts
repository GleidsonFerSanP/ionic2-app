import { Component } from '@angular/core';

import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import { NotificationFormModal } from './../form/notification-form.modal.component';
import { NotificationReadyContentComponent } from './../notification-ready-content/notification-ready-content.component';

@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notifications.html'
})
export class NotificationsPage {

  readyContentPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController ) {

      this.readyContentPage = NotificationReadyContentComponent;
  }

  listNotifications(refresher){
     console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    // this.navCtrl.push(ListPage, {
    //   item: item
    // });
  }

  openForm(notificacao) {
    let modal = this.modalCtrl.create(NotificationFormModal);
    modal.present();
  }

  openConfirmation(notificacao) {

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
  openReady(notificacao) {

  }
}
