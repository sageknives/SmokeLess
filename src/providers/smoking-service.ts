import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Platform } from 'ionic-angular/platform/platform';

import { AppConfig } from '../app/app-config';
import { Entry } from '../models/smoke/entry';

@Injectable()
export class SmokingService {
  private db: SQLiteObject = null;
  constructor(
    private platform: Platform,
    private sqLite: SQLite
  ) {
  }

  getDatabase(): Promise<SQLiteObject> {
    return new Promise((resolve, reject) => {
      this.platform.ready()
        .then(() => {
          if (this.db) return this.db;
          else return this.openDatabase();
        }).then((db: SQLiteObject) => {
          this.db = db;
          resolve(db);
        }).catch(reject);
    });
  }

  private openDatabase(): Promise<SQLiteObject> {
    return new Promise((resolve, reject) => {
      this.sqLite.create({
        name: 'smokerless.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS smoke(_id INTEGER PRIMARY KEY, entry_time_stamp TEXT, user_id INTEGER)', {})
          .then((res: any) => {
            resolve(db);
          }).catch(reject);
      }).catch(reject);
    })
  }

  private closeDatabase(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.close().then(() => {
        console.log("DB closed");
        this.db = null;
        resolve(true);
      }).catch(reject)
    })
  }

  /**
   * Add Entry
   * @param date {Date} the timestamp
   * @param userId {number} the user id 
   */
  public addEntry(date: string, userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let db;
      this.getDatabase()
        .then((database: SQLiteObject) => {
          db = database;
          return db.executeSql('INSERT INTO smoke VALUES(NULL,?,?)',
            [date, userId]);
        }).then(res => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(true);
        }).catch(e => {
          reject("There was a problem adding your smoke");
        });
    });
  }

  /**
   * get Entry
   * @param id {number} the smoke id 
   */
  public getEntry(id: number): Promise<Entry> {
    return new Promise((resolve, reject) => {
      let entry: Entry;
      this.getDatabase()
        .then((db: SQLiteObject) => {
          return db.executeSql(
            'SELECT * FROM smoke WHERE _id =?', [id]);
        }).then(res => {
          let result = res.rows.item(0);
          entry = new Entry(result._id, result.entry_time_stamp, result.user_id);
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(entry);
        }).catch(e => {
          reject("There was a problem adding your smoke");
        });
    });
  }

  /**
   * update Entry
   * @param id {number} the smoke id 
   */
  public updateEntry(id: number, date: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let entry: Entry;
      this.getDatabase()
        .then((db: SQLiteObject) => {
          return db.executeSql('UPDATE smoke SET entry_time_stamp =? WHERE _id =?', [date, id])
        }).then(res => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(true);
        }).catch(e => {
          reject("There was a problem updating your smoke");
        });
    });
  }

  /**
   * delete Entry
   * @param id {number} the smoke id 
   */
  public deleteEntry(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let entry: Entry;
      this.getDatabase()
        .then((db: SQLiteObject) => {
          return db.executeSql('DELETE FROM smoke WHERE _id =?', [id])
        }).then(res => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(true);
        }).catch(e => {
          reject("There was a problem deleting your smoke");
        });
    });
  }

  /**
   * get Entries between dates
   * @param userId {number} the user id 
   * @param start {string} the start iso string
   * @param end {string} the end iso string
   */
  public getEntries(userId: number, start: string, end: string): Promise<Entry[]> {
    return new Promise((resolve, reject) => {
      let entries: Entry[] = new Array<Entry>();
      this.getDatabase()
        .then((db: SQLiteObject) => {
          return db.executeSql(
            'SELECT * FROM smoke WHERE user_id =? AND entry_time_stamp >= ? AND entry_time_stamp < ?', [userId, start, end]);
        }).then(res => {
          for (var i = 0; i < res.rows.length; i++) {
            entries.push(new Entry(res.rows.item(i)._id, res.rows.item(i).entry_time_stamp, res.rows.item(i).user_id));
          }
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(entries);
        }).catch(e => {
          reject("There was a problem getting your entries");
        });
    });
  }

  /**
   * get Entries between dates
   * @param userId {number} the user id 
   * @param start {string} the start iso string
   * @param end {string} the end iso string
   */
  public getDayCount(userId: number, start: string, end: string): Promise<number[]> {
    return new Promise((resolve, reject) => {
      let counts: number[] = new Array<number>();
      this.getDatabase()
        .then((db: SQLiteObject) => {
          return db.executeSql(
            'SELECT date(entry_time_stamp) as date, count(*) as count FROM smoke WHERE user_id =? AND entry_time_stamp >= ? AND entry_time_stamp < ?', [userId, start, end]);
        }).then(res => {
          for (var i = 0; i < res.rows.length; i++) {
            counts[res.rows.item(i).date] = res.rows.item(i).count;
          }
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(counts);
        }).catch(e => {
          reject("There was a problem getting your entries");
        });
    });
  }

  /**
   * get Entries all
   * @param id {number} the smoke id 
   */
  public getAllEntries(userId: number): Promise<Entry[]> {
    return new Promise((resolve, reject) => {
      let entries: Entry[] = new Array<Entry>();
      this.getDatabase()
        .then((db: SQLiteObject) => {
          return db.executeSql(
            'SELECT * FROM smoke WHERE user_id =?', [userId]);
        }).then(res => {
          for (var i = 0; i < res.rows.length; i++) {
            entries.push(new Entry(res.rows.item(i)._id, res.rows.item(i).entry_time_stamp, res.rows.item(i).user_id));
          }
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(entries);
        }).catch(e => {
          reject("There was a problem adding your smoke");
        });
    });
  }

  /**
   * get Entries all
   * @param id {number} the smoke id 
   */
  // public getAllEntriesCountPerHour(day:string,userId: number): Promise<HourCount[]> {
  //   return new Promise((resolve, reject) => {
  //     let hours: HourCount[] = new Array<HourCount>();
  //     this.getDatabase()
  //       .then((db: SQLiteObject) => {
  //         return db.executeSql(
  //           'SELECT * FROM smoke WHERE user_id =?', [userId]);
  //       }).then(res => {
  //         for (var i = 0; i < res.rows.length; i++) {
  //           let hour: HourCount ={
  //             hour:res
  //           }
  //           hours.push(new HourCount(res.rows.item(i)._id, res.rows.item(i).entry_time_stamp, res.rows.item(i).user_id));
  //         }
  //         return this.closeDatabase();
  //       }).then((wasClosed: boolean) => {
  //         resolve(entries);
  //       }).catch(e => {
  //         reject("There was a problem adding your smoke");
  //       });
  //   });
  // }
}

interface HourCount{
  hour:number;
  count:number;
}