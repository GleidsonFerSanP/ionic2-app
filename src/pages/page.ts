import { Platform } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

export abstract class Page {

      constructor(
        protected toast: Toast,
        protected platform: Platform) {}

    protected message(text: string) {

        if (this.platform.is('android') || this.platform.is('ios')) {
            this.toast.show(text, '2000', 'center')
                .subscribe(
                toast => { console.log(toast); });

        } else {
            alert(text);
        }
    }

}