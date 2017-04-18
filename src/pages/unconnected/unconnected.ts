import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-unconnected',
  templateUrl: 'unconnected.html',
})
export class Unconnected {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private diagnostic: Diagnostic) {

  }

  atualizar() {
    if (this.diagnostic.switchToWifiSettings) {
      this.diagnostic.switchToWifiSettings();
    } else {
      this.diagnostic.switchToSettings();
    }
  }

  private showSettings() {

    this.platform.ready().then(() => {

      if (this.diagnostic.switchToWifiSettings) {
        this.diagnostic.switchToWifiSettings();
      } else {
        this.diagnostic.switchToSettings();
      }

    })
  }

}
