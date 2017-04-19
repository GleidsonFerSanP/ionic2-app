import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { NotificationsPage } from './notifications/notifications';
import { NotificationFormModal } from './form/notification-form.modal.component';
import { NotificationModalComponent } from './notification/notification-modal.component'

@NgModule({
    declarations: [
        NotificationsPage,
        NotificationFormModal,
        NotificationModalComponent
    ],
    imports: [
        IonicPageModule.forChild(NotificationsPage)
    ],
    entryComponents: [
        NotificationsPage,
        NotificationFormModal,
        NotificationModalComponent
    ],
    exports:[NotificationsPage]
})
export class NotificationPageModule { }