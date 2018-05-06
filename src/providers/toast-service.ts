import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AlertInputOptions } from 'ionic-angular/components/alert/alert-options';

@Injectable()
export class ToastService {
  private loader: Loading;
  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
  }
  show(message) {
    let toast = this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  showError(error) {
    let message = error._body
    if (message) {
      this.show(message);
    } else {
      this.show(error);
    }
  }

  showLoading(message?: string) {
    this.hideLoading();
    this.loader = this.loadingController.create({
      content: message ? message : 'Please wait...'
    });

    this.loader.present();
  }

  hideLoading() {
    if (this.loader) {
      this.loader.dismiss();
      this.loader = undefined;
    }
  }

  alert(title: string, message: string) {
    let alert = this.alertController.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  choosePercentage(percents: number[]): Promise<number> {
    return new Promise((resolve, reject) => {
      let inputs: AlertInputOptions[] = new Array<AlertInputOptions>();
      for (let i = 0; i < percents.length; i++) {
        let input: AlertInputOptions = {
          value: percents[i] + "",
          label: percents[i] + "%",
          type: 'radio',
          checked: percents[i] === 100
        }
        inputs.push(input);
      }
      let alert = this.alertController.create({
        title: "Smoke now?",
        message: "Do you want to smoke now or can you wait 5 minutes more?",
        inputs: inputs,
        buttons: [
          {
            text: 'Wait',
            role: 'cancel',
            handler: () => {
              console.log('cancel');
            }
          },
          {
            text: 'Smoke',
            role: 'smoke',
            handler: () => {
              console.log('Smoke');
            }
          }
        ]
      });
      alert.present();
      alert.onDidDismiss((data: any, role: string) => {
        if (role === 'smoke') {
          let percent = Number.parseFloat(data);
          resolve(percent);
        }
        else {
          resolve();
        }
      });
    });
  }

  messageConfirm(title: string, message: string, cancelMessage?: string, acceptMessage?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {


      let alert = this.alertController.create({
        title: title,
        message: message,
        buttons: [
          {
            text: cancelMessage ? cancelMessage : 'Dismiss',
            role: 'cancel',
            cssClass: "left-2-button buttons-2",
            handler: () => {
              console.log('Dismissed');
            }
          },
          {
            text: acceptMessage ? acceptMessage : 'Respond',
            role: 'accept',
            cssClass: "right-2-button buttons-2",
            handler: () => {
              console.log('accept');
              //should redirect?
            }
          }
        ]
      });
      alert.present();
      alert.onDidDismiss((data: any, role: string) => {
        resolve(role === 'accept');
      });
    });
  }


}