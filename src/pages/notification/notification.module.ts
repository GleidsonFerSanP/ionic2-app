import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';

import { NotificationsPage } from './notifications/notifications';
import { NotificationFormModal } from './form/notification-form.modal.component';
import { NotificationReadyContentComponent } from './notification-ready-content/notification-ready-content.component'

@NgModule({
    declarations: [
        NotificationsPage,
        NotificationFormModal,
        NotificationReadyContentComponent
    ],
    imports: [
        IonicPageModule.forChild(NotificationsPage)
    ],
    entryComponents: [
        NotificationsPage,
        NotificationFormModal,
        NotificationReadyContentComponent
    ],
    exports:[NotificationsPage]
})
export class NotificationPageModule { }