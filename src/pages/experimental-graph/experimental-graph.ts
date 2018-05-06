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

  // public decayRateTestHalfLife2() {
  //   let mg = 1.5;
  //   let halfLife = 2;
  //   let dayHours96 = this.getNumberHoursArray2();
  //   let today = new Array<number>();
  //   for (let now = 72; now < dayHours96.length; now++) {
  //     let count = 0;
  //     for (let past = now; past >= 0; past--) {
  //       let hourMg = mg * dayHours96[past];
  //       let n = (now - past) / halfLife;
  //       let mgCounted = (hourMg / Math.pow(2, n));
  //       if (mgCounted.toString().includes("e")) break;
  //       count = count + mgCounted;
  //       console.log(
  //         "HOUR:" + past +
  //         ", hour mg:" + hourMg +
  //         ", hourMgCounted:" + mgCounted +
  //         ", count so far:" + count
  //       )
  //     }
  //     today.push(count);
  //   }
  //   for (let i = 0; i < today.length; i++) {
  //     let numberText = (i % 12 === 0) ? 12 : i % 12;
  //     console.log(numberText + ": " + today[i])
  //   }
  // }

  setUpAndDisplayGraph() {
    let total: number = 0;
    let momentStart = moment(this.selectedDate).add(-3, 'day').startOf('day');
    let start = momentStart.toISOString();
    let end = moment(start).add(4, 'day').toISOString();
    let hourCount = new Array<number>();
    this.smokingService.getEntries(this.user.getId(), start, end)
      .then((entries: Entry[]) => {
        // while (this.hourCounts.length > 0) this.hourCounts.pop();
        for (let i = 0; i < 96; i++) {
          let temp = moment(this.selectedDate).add(-3, 'day').startOf('day').add(i, 'hour');
          hourCount[temp.get('date') + "-" + temp.get('hour')] = 0;
        }
        entries.forEach(entry => {
          let day = moment(entry.getStart()).get('date');
          let hour = moment(entry.getStart()).get('hour');
          let count = entry.getNumberCount()/100;
          hourCount[day + "-" + hour] += count;
          total += entry.getNumberCount() / 100;
        });

        let mg = 1;
        let halfLife = 2;
        let today = new Array<number>();
        for (let now = 72; now < 96; now++) {
          let count = 0;
          for (let past = now; past >= 0; past--) {
            let temp2 = moment(this.selectedDate).add(-3, 'day').startOf('day').add(past, 'hour');

            let hourMg = mg * hourCount[temp2.get('date')+"-"+temp2.get('hour')];
            let n = (now - past) / halfLife;
            let mgCounted = (hourMg / Math.pow(2, n));
            if (mgCounted.toString().includes("e")) break;
            count = count + mgCounted;
            // console.log(
            //   "HOUR:" + past +
            //   ", hour mg:" + hourMg +
            //   ", hourMgCounted:" + mgCounted +
            //   ", count so far:" + count
            // )
          }
          today.push(count);
        }
        // console.log("hours", today);
        this.graphData(today);
        this.total = total;
        this.average = Number.parseFloat((total / 24).toFixed(2));

      }).catch(this.toast.showError);
  }

  gotoAccount() {
    this.appCtrl.getRootNav().push('AccountPage');
  }

  graphData(dosage:number[]) {
    let hours = new Array<number>();
    let counts = new Array<number>();
    let max = 0;
    dosage.forEach((dose:number,i:number) => {
      let zeroToEleven = i % 12;
      hours.push(zeroToEleven === 0 ? 12 : zeroToEleven);
      counts.push(dose);
      if (dose > max) max = dose;
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
