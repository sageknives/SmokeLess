export class Entry{
  
  constructor(
    private _id: number,
    private start: string,
    private userId: number,
    private _rev?: string
  ) { }

  getStart():string{
    return this.start;
  }

  setStart(start:string):void{
    this.start = start;
  }

  getUserId():number{
    return this.userId;
  }

  getId(): number{
    return this._id;
  }
}