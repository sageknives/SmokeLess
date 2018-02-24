import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { SmokingService } from '../../providers/smoking-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';
import { Entry } from '../../models/smoke/entry';

@IonicPage()
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {

  private title = "Entry";
  private entry: Entry = new Entry(undefined,undefined,undefined);
  private user:User;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }

  ionViewDidLoad() {
    this.user = this.userService.getCurrentUser();
    let id = this.navParams.get("id");
    if(id){
      this.smokingService.getEntry(id)
      .then((entry:Entry)=>{
        this.entry = entry;
      }).catch(this.toast.showError);
    }
    
  }

}
