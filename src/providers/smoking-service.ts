import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Platform } from 'ionic-angular/platform/platform';

import { AppConfig } from '../app/app-config';
import { Entry } from '../models/smoke/entry';
import { SqlCommands } from '../models/database/sql-commands';
import { MockSQLiteObject, UniversalSQLiteInterface } from '../models/database/mock-database';

@Injectable()
export class SmokingService {
  private db: UniversalSQLiteInterface = null;
  constructor(
    private platform: Platform,
    private sqLite: SQLite
  ) {
  }

  getDatabase(): Promise<UniversalSQLiteInterface> {
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

  private openDatabase(): Promise<UniversalSQLiteInterface> {
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.sqLite.create({
          name: 'smokerless.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql(SqlCommands.CREATE_SMOKE_TABLE, {})
            .then((res: any) => {
              this.db = db;
              resolve(db);
            }).catch(reject);
        }).catch(reject);
      } else {
        let db = new MockSQLiteObject();
        db.executeSql(SqlCommands.CREATE_SMOKE_TABLE, {})
          .then((res: any) => {
            this.db = db;
            resolve(db);
          }).catch(reject);
      }
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
  public addEntry(date: string, numberCount: number, userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let db;
      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
          db = database;
          return db.executeSql(SqlCommands.INSERT_SMOKE,
            [date, userId, numberCount]);
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
        .then((db: UniversalSQLiteInterface) => {
          return db.executeSql(
            SqlCommands.SELECT_ALL_FROM_SMOKE_WHERE_ID, [id]);
        }).then(res => {
          let result = res.rows.item(0);
          entry = new Entry(result._id, result.entry_time_stamp, result.numberCount, result.user_id);
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
  public updateEntry(id: number, numberCount: number, date: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let entry: Entry;
      this.getDatabase()
        .then((db: UniversalSQLiteInterface) => {
          return db.executeSql(SqlCommands.UPDATE_SMOKE_ENTRY_TIME_STAMP_AND_NUMBERCOUNT_WHERE_ID, [date, numberCount, id])
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
        .then((db: UniversalSQLiteInterface) => {
          return db.executeSql(SqlCommands.DELETE_SMOKE_WHERE_ID, [id])
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
        .then((db: UniversalSQLiteInterface) => {
          return db.executeSql(
            SqlCommands.SELECT_ALL_FROM_SMOKE_WHERE_USER_ID_BETWEEN_START_END, [userId, start, end]);
        }).then(res => {
          for (var i = 0; i < res.rows.length; i++) {
            entries.push(new Entry(res.rows.item(i)._id, res.rows.item(i).entry_time_stamp, res.rows.item(i).numberCount, res.rows.item(i).user_id));
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
        .then((db: UniversalSQLiteInterface) => {
          return db.executeSql(
            SqlCommands.SELECT_DATE_COUNT_FROM_SMOKE_WHERE_USER_ID_BETWEEN_START_END, [userId, start, end]);
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
        .then((db: UniversalSQLiteInterface) => {
          return db.executeSql(
            SqlCommands.SELECT_ALL_FROM_SMOKE_WHERE_USER_ID, [userId]);
        }).then(res => {
          for (var i = 0; i < res.rows.length; i++) {
            entries.push(new Entry(res.rows.item(i)._id, res.rows.item(i).entry_time_stamp, res.rows.item(i).numberCount, res.rows.item(i).user_id));
          }
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(entries);
        }).catch(e => {
          reject("There was a problem adding your smoke");
        });
    });
  }


  /**TEMP! */
  public updateNumberCountToOne(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let entries: Entry[] = new Array<Entry>();
      let db: UniversalSQLiteInterface;
      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
          db = database;
          return db.executeSql(
            SqlCommands.SELECT_ALL_FROM_SMOKE, []);
        }).then(res => {
          let promises = new Array<Promise<boolean>>();
          for (var i = 0; i < res.rows.length; i++) {
            let id = res.rows.item(i)._id;
            let numberCount = 100;
            let stamp = res.rows.item(i).entry_time_stamp;
            promises.push(db.executeSql(SqlCommands.UPDATE_SMOKE_ENTRY_TIME_STAMP_AND_NUMBERCOUNT_WHERE_ID, [stamp, numberCount, id]));
          }
          return Promise.all(promises);
        }).then((wasUpdated: any[]) => {
          console.log("wasUpdated", wasUpdated);
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve();
        }).catch(e => {
          reject("There was a problem adding your smoke");
        });
    })
  }

  /**TEMP! */

  public AddNumberCountColumnToTable(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db: UniversalSQLiteInterface;

      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
          db = database;
          return this.checkIfNumberColumnExists(db);
        }).then((exists: boolean) => {
          if (exists) {
            return true;
          } else {
            return this.addColumn(db);
          }
        }).then((added: boolean) => {
          return this.closeDatabase();
        }).then((closed: boolean) => {
          resolve();
        }).catch(error => {
          reject(error);
        })
    });
  }
  /**TEMP! */

  private addColumn(db: UniversalSQLiteInterface): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.executeSql(
        SqlCommands.ADD_NUMBER_COUNT_TO_SMOKING_TABLE,
        []
      ).then((res) => {
        resolve(true);
      }).catch(error =>
        reject(error)
      )
    })
  }
  /**TEMP! */

  private checkIfNumberColumnExists(db: UniversalSQLiteInterface): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.executeSql(
        SqlCommands.NUMBER_COUNT_EXISTS_IN_SMOKING_TABLE, []
      ).then((res) => {
        resolve(true)
      }).catch(error => {
        if (error.code && error.code === 5) {
          resolve(false);
        }
        else {
          reject(error);
        }
      }).catch(reject);
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

interface HourCount {
  hour: number;
  count: number;
}