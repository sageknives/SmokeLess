import * as moment from 'moment';

export class User{
  
  constructor(
    private _id: number,
    private username: string,
    private password: string,
    private goal: number,
    private loggedIn: boolean = false,
    private startGoal?: number,
    private startDate?: string,
    private endGoal?: number,
    private endDate?: string,
    private _rev?: string
  ) { }

  public getId(): number{
    return this._id;
  }

  public getUsername(): string {
    return this.username;
  }

  public getPassword(): string {
    return this.password;
  }

  public getRev(): string{
    return this._rev;
  }

  public getGoal(): number{
    return this.goal;
  }

  public getStartGoal(): number{
    return this.startGoal;
  }
  public getStartDate(): string{
    return this.startDate;
  }
  public setStartDate(startDate: string):void{
    this.startDate = startDate;
  }
  public getEndGoal():number{
    return this.endGoal;
  }
  public getEndDate(): string{
    return this.endDate;
  }
  public setEndDate(endDate: string):void{
    this.endDate = endDate;
  }

  public getDayGoal(dateString:string):number{
    if(!this.startDate) return this.goal;
    let todayMoment = moment(dateString);
    let startMoment = moment(this.startDate);
    if(startMoment.isAfter(todayMoment)) return this.goal;
    let endMoment = moment(this.endDate);
    if(endMoment.isBefore(todayMoment)) return this.endGoal;
    let dateDifference = endMoment.diff(startMoment,'days');
    let countDiffence = this.startGoal - this.endGoal;
    let dayCounts = new Array<number>();
    let dayChangeCount = Math.ceil(dateDifference/countDiffence);
    let count = 0;
    let tempGoal = this.startGoal;
    while(startMoment.diff(endMoment,'days') !==0){
      count++;
      if(count%dayChangeCount ===0) tempGoal--;
      dayCounts[startMoment.toISOString().split('T')[0]] = tempGoal;
      startMoment.add(1,'day');
    }
    return dayCounts[dateString.split('T')[0]];
  }
  public getDayGoals():number[]{
    if(!this.startDate) return [this.goal];
    let startMoment = moment(this.startDate);
    let endMoment = moment(this.endDate);
    let dateDifference = endMoment.diff(startMoment,'days');
    let countDiffence = this.startGoal - this.endGoal;
    let dayCounts = new Array<number>();
    let dayChangeCount = Math.ceil(dateDifference/countDiffence);
    let count = 0;
    let tempGoal = this.startGoal;
    while(startMoment.diff(endMoment,'days') !==0){
      count++;
      if(count%dayChangeCount ===0) tempGoal--;
      dayCounts[startMoment.toISOString().split('T')[0]] = tempGoal;
      startMoment.add(1,'day');
    }
    return dayCounts;
  }
  
  public static fromJSON(doc: any): User {
    return new User(
      doc._id,
      doc.username,
      doc.password,
      doc.goal,
      doc.loggedIn,
      doc.startGoal,
      doc.startDate,
      doc.endGoal,
      doc.endDate,
      doc._rev
    );
  }
}