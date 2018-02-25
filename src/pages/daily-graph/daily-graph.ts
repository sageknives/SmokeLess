import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { SmokingService } from '../../providers/smoking-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';
import * as moment from 'moment';
import { Entry } from '../../models/smoke/entry';
import { Chart } from 'chart.js';

interface HourCount {
  hour: number,
  count: number
}

@IonicPage()
@Component({
  selector: 'page-daily-graph',
  templateUrl: 'daily-graph.html',
})
export class DailyGraphPage {
  private title = "Daily Graph";
  private user: User = User.fromJSON({});
  private entries: Entry[] = new Array<Entry>();
  private hourCounts: HourCount[] = new Array<HourCount>();
  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }

  ionViewWillEnter() {
    this.user = this.userService.getCurrentUser();
    if (!this.user) {
      this.navCtrl.setRoot('LoginPage');
      this.toast.show("Please login to continue");
    }
    let start = moment(Date.now()).startOf('day').toISOString();
    let end = moment(start).add(1, 'day').toISOString();
    this.smokingService.getEntries(this.user.getId(), start, end)
      .then((entries: Entry[]) => {
        while (this.hourCounts.length > 0) this.hourCounts.pop();
        for (let i = 0; i < 24; i++) this.hourCounts.push({ hour: i, count: 0 });
        entries.forEach(entry => {
          let hour = moment(entry.getStart()).get('hour');
          this.hourCounts[hour].count++;
        });
        console.log("hours", this.hourCounts);
        this.graphData();
      }).catch(this.toast.showError);
  }

  gotoHome() {
    this.appCtrl.getRootNav().pop();
  }

  graphData() {
    let hours = new Array<number>();
    let counts = new Array<number>();
    let max = 0;
    this.hourCounts.forEach(hourCount => {
      let zeroToEleven = hourCount.hour % 12;
      hours.push(zeroToEleven === 0 ? 12 : zeroToEleven);
      counts.push(hourCount.count);
      if (hourCount.count > max) max = hourCount.count;
    })
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          label: "count",
          backgroundColor: "#red",
          borderColor: "#000",
          data: counts,
          fill: false,
          lineTension:0
        }
        ]
      },
      options: {
        legend: {
          display: false,
          hidden: true
        },
        responsive: true,
        title: {
          display: false,
        },
        label: {
          display: false,
          hidden: true
        },
        data: {
          datasets: {
            label: false,
            hidden: true
          }
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'hours'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'smokes'
            },
            ticks: {
              min: 0,
              suggestedMax: max + 1
            }
          }]
        }
      }
    }
    );
  }

}
