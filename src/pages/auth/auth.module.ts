import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { LoginPage } from './login/login';

import { LostPasswordModal } from './lost-password/lost-password-modal.component';

@NgModule({
    declarations: [
        LoginPage,
        LostPasswordModal
    ],
    imports: [
        IonicPageModule.forChild(LoginPage),
        IonicPageModule.forChild(LostPasswordModal)
    ],
    entryComponents: [
        LoginPage,
    ],
    exports:[LoginPage, LostPasswordModal]
})
export class AuthModule { }