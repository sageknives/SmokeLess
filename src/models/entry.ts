export class Entry{
  
  constructor(
    private _id: string,
    private start: string,
    private _rev?: string
  ) { }

  getStart():string{
    return this.start;
  }
}