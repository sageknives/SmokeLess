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
  selector: 'page-experimental-graph',
  templateUrl: 'experimental-graph.html',
})
export class ExperimentalGraphPage {

  private title = "Experimental Graph";
  private user: User = User.fromJSON({});
  private entries: Entry[] = new Array<Entry>();
  private hourCounts: HourCount[] = new Array<HourCount>();
  @ViewChild('experimentalCanvas1') experimentalCanvas1;
  experimentalChart1: any;
  @ViewChild('experimentalCanvas2') experimentalCanvas2;
  experimentalChart2: any;
  selectedDate: string = moment(Date.now()).startOf('day').toISOString();
  total: number = 0;
  average: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }

  prevDate() {
    this.selectedDate = moment(this.selectedDate).add(-1, 'day').startOf('day').toISOString();
    this.setUpAndDisplayGraph();
  }
  nextDate() {
    this.selectedDate = moment(this.selectedDate).add(1, 'day').startOf('day').toISOString();
    this.setUpAndDisplayGraph();
  }

  ionViewWillEnter() {
    this.userService.getLoggedInUser()
      .then((user: User) => {
        this.user = user;
        if (!this.user) {
          this.navCtrl.setRoot('LoginPage');
          this.toast.show("Please login to continue");
        }
        else {
          this.setUpAndDisplayGraph();
        }
      })
  }

  setUpAndDisplayGraph() {
    let total: number = 0;
    let start = moment(this.selectedDate).startOf('day').toISOString();
    let end = moment(start).add(1, 'day').toISOString();
    this.smokingService.getEntries(this.user.getId(), start, end)
      .then((entries: Entry[]) => {
        while (this.hourCounts.length > 0) this.hourCounts.pop();
        for (let i = 0; i < 24; i++) this.hourCounts.push({ hour: i, count: 0 });
        entries.forEach(entry => {
          let hour = moment(entry.getStart()).get('hour');
          this.hourCounts[hour].count += entry.getNumberCount()/100;
          total += entry.getNumberCount()/100;
        });
        console.log("hours", this.hourCounts);
        this.graphData();
        this.total = total;
        this.average = Number.parseFloat((total / 24).toFixed(2));

      }).catch(this.toast.showError);
  }

  gotoAccount() {
    this.appCtrl.getRootNav().push('AccountPage');
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
    this.experimentalChart1 = new Chart(this.experimentalCanvas1.nativeElement, {
      type: 'line',
      data: {
        labels: hours,
        datasets: [{
          label: "count",
          backgroundColor: "#red",
          borderColor: "#000",
          data: counts,
          fill: false,
          lineTension: 0
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
