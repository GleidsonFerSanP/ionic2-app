import {Component} from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: 'lost-password-modal.component.html'
})
export class LostPasswordModal {
  form: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public navCtrl: NavController) {
        this.form = this.formBuilder.group({
      user: ['', Validators.required]
    });
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  submit(data){
    this.viewCtrl.dismiss(data);
  }

}
