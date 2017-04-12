import {Component} from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'notification-form.modal.component.html'
})
export class NotificationFormModal {

  constructor(
    private viewCtrl: ViewController,
    public navCtrl: NavController,) {
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  submit(data){
    this.viewCtrl.dismiss(data);
  }

}