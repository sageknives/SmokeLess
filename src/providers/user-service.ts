import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Platform } from 'ionic-angular/platform/platform';

import { AppConfig } from '../app/app-config';
import { User } from '../models/user/user';

@Injectable()
export class UserService {
  private user: User;
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
        db.executeSql('CREATE TABLE IF NOT EXISTS user(_id INTEGER PRIMARY KEY, username TEXT, password TEXT, goal INTEGER, loggedIn INTEGER)', {})
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
          return db.executeSql('SELECT * FROM user WHERE username =?', [user.getUsername()]);
        }).then(res => {
          if (res.rows.length > 0) reject("Username already taken");
          else return db.executeSql('INSERT INTO user VALUES(NULL,?,?,?,?)',
            [user.getUsername(), user.getPassword(), user.getGoal(), 0]);
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
      let dbUser: User;
      this.getDatabase()
        .then((database: SQLiteObject) => {
          db = database;
          return db.executeSql(
            'SELECT * FROM user WHERE username =? AND password =?',
            [user.getUsername(), user.getPassword()]);
        }).then((res: any) => {
          if (res.rows.length === 0) {
            reject("Invalid Credentials");
            return;
          }
          if (res.rows.length !== 1) {
            reject("Database error");
            return;
          }
          else {
            let result = res.rows.item(0);
            dbUser = User.fromJSON({
              _id: result._id,
              username: result.username,
              password: result.password,
              goal: result.goal,
              loggedIn: true
            });
            return db.executeSql('UPDATE user SET loggedIn =? WHERE _id =?', [1, dbUser.getId()]);
          }
        }).then((res: any) => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          this.user = dbUser;
          resolve(dbUser);
        }).catch(error => {
          reject("error logging in");
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
            'SELECT * FROM user WHERE loggedIn =?', [1]);
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
                this.user = dbUser;
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
          return db.executeSql('UPDATE user SET loggedIn =? WHERE loggedIn =?', [0, 1]);
        }).then((res: any) => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          this.user = undefined;
          resolve();
        }).catch(error => {
          reject("error logging in");
        });
    });
  }

  saveUserGoal(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }

  getCurrentUser(): User {
    return this.user;
  }

  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      let db: SQLiteObject;
      let users: User[] = new Array<User>();
      this.getDatabase()
        .then((database: SQLiteObject) => {
          db = database;
          return db.executeSql(
            'SELECT * FROM user', []);
        }).then((res: any) => {
          for (var i = 0; i < res.rows.length; i++) {
            users.push(new User(res.rows.item(i)._id, res.rows.item(i).username, res.rows.item(i).password, res.rows.item(i).goal, res.rows.item(i).loggedIn === 0 ? false : true));
          }
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(users);
        }).catch(reject);
    });
  }


}