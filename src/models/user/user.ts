export class User{
  
  constructor(
    private _id: string,
    private username: string,
    private password: string,
    private goal: number,
    private loggedIn: boolean = false,
    private _rev?: string
  ) { }

  public getId(): string{
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
  
  public static fromJSON(doc: any): User {
    return new User(
      doc._id,
      doc.username,
      doc.password,
      doc.goal,
      doc.loggedIn,
      doc._rev
    );
  }
}