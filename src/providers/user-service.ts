import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Platform } from 'ionic-angular/platform/platform';

import { AppConfig } from '../app/app-config';
import { User } from '../models/user/user';

@Injectable()
export class UserService {
  private db: SQLiteObject = null;
  constructor(
    private platform: Platform,
    private sqLite: SQLite
  ) {
  }

  // getDatabase(): Promise<SQLiteObject> {
  //   return new Promise((resolve, reject) => {
  //     this.platform.ready()
  //       .then(() => {
  //         return this.sqLite.create({
  //           name: 'smokerless.db',
  //           location: 'default'
  //         });
  //       }).then((db: SQLiteObject) => {
  //         db.executeSql('CREATE TABLE IF NOT EXISTS entry(rowid INTEGER PRIMARY KEY, date TEXT)', {})
  //           .then((res: any) => {
  //             resolve(db);
  //           }).catch(reject);
  //       }).catch(reject);
  //   });
  // }

  getDatabase(): Promise<SQLiteObject> {
    return new Promise((resolve, reject) => {
      this.platform.ready()
        .then(() => {
          if (this.db) return this.db;
          else return this.openDatabase();
        }).then((db: SQLiteObject) => {
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
        db.executeSql('CREATE TABLE IF NOT EXISTS user(_id INTEGER PRIMARY KEY, username TEXT, password TEXT, goal INTEGER, loggedIn BOOLEAN)', {})
          .then((res: any) => {
            this.db = db;
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
   * Register user and login
   * @param user 
   */
  public register(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      let db;
      this.getDatabase()
        .then((database: SQLiteObject) => {
          db = database;
          return db.executeSql('SELECT * FROM user WHERE username =?',[user.getUsername()]);
        }).then(res => {
          if(res.rows.length > 0) reject("Username already taken");
          else return db.executeSql('INSERT INTO user VALUES(NULL,?,?,?,?)',
            [user.getUsername(), user.getPassword(), user.getGoal(), false]);
        }).then(res => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(user);
        }).catch(e => {
          reject("There was a problem registering");
        });
    });
  }

  login(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      let db: SQLiteObject;
      this.getDatabase()
        .then((database: SQLiteObject) => {
          db = database;
          return db.executeSql(
            'SELECT * FROM user WHERE username =? AND password =?',
            [user.getUsername(), user.getPassword()]);
        }).then((res: any) => {
          if (res.rows.length === 1) {
            let result = res.rows.item(0);
            let dbUser: User = User.fromJSON({
              _id: result._id,
              username: result.username,
              password: result.password,
              goal: result.goal,
              loggedIn: true
            });
            db.executeSql('UPDATE user SET loggedIn =?', [true])
              .then((res: any) => {
                return this.closeDatabase();
              }).then((wasClosed: boolean) => {
                resolve(dbUser);
              }).catch(error => {
                reject("error logging in");
              })
          } else if (res.rows.length === 0) {
            reject("Invalid Credentials");
          } else {
            reject("Database error");
          }
        }).catch(error => {
          console.log(error);
          reject(error)
        });
    });
  }

  getLoggedInUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.getDatabase()
        .then((db: SQLiteObject) => {
          return db.executeSql(
            'SELECT * FROM user WHERE loggedIn =?', [true]);
        }).then((res: any) => {
          if (res.rows.length === 1) {
            let result = res.rows.item(0);
            let dbUser: User = User.fromJSON({
              _id: result._id,
              username: result.username,
              password: result.password,
              goal: result.goal,
              loggedIn: result.loggedIn
            });
            this.closeDatabase()
              .then((wasClosed: boolean) => {
                resolve(dbUser);
              }).catch(reject);
          } else if (res.rows.length === 0) {
            reject("No user");
          } else {
            reject("Database error");
          }
        }).catch(error => {
          console.log(error);
          reject(error);
        });
    })
  }



  logout(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let db: SQLiteObject;
      this.getDatabase()
        .then((database: SQLiteObject) => {
          db = database;
          return db.executeSql('UPDATE user SET loggedIn =? WHERE loggedIn =?', [false, true]);
        }).then((res: any) => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve();
        }).catch(error => {
          reject("error logging in");
        });
    });
  }

  saveUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }

  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(User.fromJSON({}));
    });
  }

  private createUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(user);
    })
  }
}