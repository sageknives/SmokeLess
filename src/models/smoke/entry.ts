export class Entry{
  
  constructor(
    private _id: number,
    private entry_time_stamp: string,
    private userId: number,
    private _rev?: string
  ) { }

  getStart():string{
    return this.entry_time_stamp;
  }

  setStart(start:string):void{
    this.entry_time_stamp = start;
  }

  getUserId():number{
    return this.userId;
  }

  getId(): number{
    return this._id;
  }
}