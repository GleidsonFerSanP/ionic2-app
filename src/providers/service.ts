import { NavController, Platform, App } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import { Http } from "@angular/http";
import { LoadingController } from 'ionic-angular';
import { CentiResponseObject } from './../model/centi-response-object';

export abstract class Service {
    protected loader;
    constructor(
        protected http: Http,
        protected toast: Toast,
        protected app: App,
        protected platform: Platform,
        protected loading: LoadingController) { }

    private load() {
        this.loader = this.loading.create({
            content: 'Um momento por favor...',
        });
    }

    public post(url: string, obj: Object, callback) {
        this.load();
        this.loader.present().then(() => {
            this.http.post(url, JSON.stringify(obj), {})
                .subscribe((response) => {
                    this.loader.dismiss();
                    callback(response.json());
                }, (error) => {
                    console.log(error);
                    this.loader.dismiss();
                    this.requestErrors(error);
                });
        });
    }

    public get(url: string, callback) {
        this.load();
        this.loader.present().then(() => {
            this.http.get(url, {})
                .subscribe((response) => {
                    this.loader.dismiss();
                    callback(response.json());
                }, (error) => {
                    console.log(error);
                    this.loader.dismiss();
                    this.requestErrors(error);
                });
        });
    }

    protected generateMessages(objResponse: CentiResponseObject) {
        if (!objResponse.Message)
            return;
        let message = objResponse.Message.join("\n");
        this.message(message);
        this.loader.dismiss();
    }

    private requestErrors(error) {
        switch (error.status) {
            case 404:
                this.message("404 - Página não encontrada");
                break;
            case 500:
                var message = JSON.parse(error._body);
                this.message(message.Message.join("\n"));
                break;
            case 0:
                this.message("Houve algum erro, por favor tente novamente");
                break;

            default:
                break;
        }
    }

    protected getNavCtrl(): NavController {
        return this.app.getActiveNav();
    }

    protected message(text: string) {
        if (this.platform.is('android') || this.platform.is('ios')) {
            this.toast.show(text, '2000', 'center')
                .subscribe(
                toast => { console.log(toast); });
        } else {
            alert(text);
        }
    }

    protected processResult(data, callback) {
        let obj = data;
        if (obj.Success) {
            callback(data);
            return;
        }

        this.generateMessages(obj);

    }
}