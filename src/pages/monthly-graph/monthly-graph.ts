import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { UserService } from '../../providers/user-service';
import { SmokingService } from '../../providers/smoking-service';
import { ToastService } from '../../providers/toast-service';
import { User } from '../../models/user/user';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Entry } from '../../models/smoke/entry';

interface DayCount {
  day: number,
  count: number
}

@IonicPage()
@Component({
  selector: 'page-monthly-graph',
  templateUrl: 'monthly-graph.html',
})
export class MonthlyGraphPage {
  private title = "Monthly Graph";
  private user: User = User.fromJSON({});
  private dayCounts: DayCount[] = new Array<DayCount>();
  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  selectedDate: string = moment(Date.now()).startOf('day').toISOString();
  total:number = 0;
  average:number = 0;
  //daysOfTheWeek = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    private userService: UserService,
    private smokingService: SmokingService,
    private toast: ToastService
  ) {
  }

  prevDate(){
    this.selectedDate = moment(this.selectedDate).add(-1,'month').startOf('day').toISOString();
    this.setUpAndDisplayGraph();
  }
  nextDate(){
    this.selectedDate = moment(this.selectedDate).add(1,'month').startOf('day').toISOString();
    this.setUpAndDisplayGraph();
  }

  ionViewWillEnter() {
    this.userService.getLoggedInUser()
    .then((user:User)=>{
      this.user = user;
      if (!this.user) {
        this.navCtrl.setRoot('LoginPage');
        this.toast.show("Please login to continue");
      }
      else{
        let today = moment(this.selectedDate);
        while(today.get('date')!==1) today.add(-1,'day');
        this.selectedDate = today.startOf('day').toISOString();
        this.setUpAndDisplayGraph();
      }
    })
  }

  setUpAndDisplayGraph(){
    let total:number = 0;
    let start = moment(this.selectedDate).startOf('day').toISOString();
    let end = moment(start).add(1, 'month').toISOString();
    this.smokingService.getEntries(this.user.getId(), start, end)
      .then((entries: Entry[]) => {
        while (this.dayCounts.length > 0) this.dayCounts.pop();
        let daysInMonth = moment(start).daysInMonth();
        for (let i = 0; i < daysInMonth; i++) this.dayCounts.push({ day: i, count: 0 });
        entries.forEach(entry => {
          let date = moment(entry.getStart()).get('date')-1;
          this.dayCounts[date].count++;
          total++;
        });
        console.log("days", this.dayCounts);
        this.graphData();
        this.total = total;
        this.average = Number.parseFloat((total / daysInMonth).toFixed(2));
      }).catch(this.toast.showError); 
  }

  gotoHome() {
    this.appCtrl.getRootNav().pop();
  }

  graphData() {
    let days = new Array<number>();
    let counts = new Array<number>();
    let max = 0;
    this.dayCounts.forEach(hourCount => {
      days.push(hourCount.day+1);
      counts.push(hourCount.count);
      if (hourCount.count > max) max = hourCount.count;
    })
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: "count",
          backgroundColor: "#000",
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
              labelString: 'day'
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
