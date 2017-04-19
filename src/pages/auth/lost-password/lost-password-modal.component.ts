import { Component } from '@angular/core';
import { Toast } from '@ionic-native/toast';
import { ViewController, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Page } from './../../page';

import { Usuario } from './../../../model/usuario';

import { AuthService } from './../../../providers/auth-service';

@Component({
  templateUrl: 'lost-password-modal.component.html'
})
export class LostPasswordModal extends Page {
  
  form: FormGroup;
  usuario: Usuario = new Usuario();
  submitAttempt: boolean = false;

  constructor(
    private viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    protected toast: Toast,
    protected platform: Platform) {

    super(toast, platform);

    this.form = this.formBuilder.group({
      user: ['', Validators.required]
    });
  }

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

  submit(data) {

    if (this.form.invalid) {
      this.message('Por favor preenha seu Usuário');
      return;
    }

    this.auth.forgetpass(this.usuario, (data) => {
      this.submitAttempt = true;
     
      if (data.Success) {
        this.usuario = new Usuario();
        this.viewCtrl.dismiss(data);
      }

      this.message(data.Message.join("\n"));
    })
  }
}
