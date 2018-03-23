import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { Platform } from 'ionic-angular/platform/platform';

import { AppConfig } from '../app/app-config';
import { User } from '../models/user/user';
import { SqlCommands } from '../models/database/sql-commands';
import { UniversalSQLiteInterface, MockSQLiteObject } from '../models/database/mock-database';

@Injectable()
export class UserService {
  private user: User;
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
        }).then((db: UniversalSQLiteInterface) => {
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
          db.executeSql(SqlCommands.CREATE_USER_TABLE, {})
            .then((res: any) => {
              this.db = db;
              resolve(db);
            }).catch(reject);
        }).catch(reject);
      } else {
        let db = new MockSQLiteObject();
        db.executeSql(SqlCommands.CREATE_USER_TABLE, {})
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
   * Register user and login
   * @param user 
   */
  public register(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      let db;
      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
          db = database;
          return db.executeSql(SqlCommands.SELECT_ALL_FROM_USER_WHERE_USERNAME, [user.getUsername()]);
        }).then(res => {
          if (res.rows.length > 0) reject("Username already taken");
          else return db.executeSql(SqlCommands.INSERT_USER,
            [user.getUsername(), user.getPassword(), user.getGoal(), 0, "", user.getGoal(), "", 0]);
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
      let db: UniversalSQLiteInterface;
      let dbUser: User;
      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
          db = database;
          return db.executeSql(
            SqlCommands.SELECT_ALL_FROM_USER_WHERE_USERNAME_AND_PASSWORD,
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
              startDate: result.startDate,
              startGoal: result.startGoal,
              endDate: result.endDate,
              endGoal: result.endGoal,
              loggedIn: true
            });
            return db.executeSql(SqlCommands.UPDATE_USER_LOGGED_IN_WHERE_ID, [1, dbUser.getId()]);
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
        .then((db: UniversalSQLiteInterface) => {
          return db.executeSql(
            SqlCommands.SELECT_ALL_FROM_USER_WHERE_LOGGEDIN, [1]);
        }).then((res: any) => {
          if (res.rows.length === 1) {
            let result = res.rows.item(0);
            let dbUser: User = User.fromJSON({
              _id: result._id,
              username: result.username,
              password: result.password,
              goal: result.goal,
              loggedIn: result.loggedIn,
              startDate: result.startDate,
              startGoal: result.startGoal,
              endDate: result.endDate,
              endGoal: result.endGoal
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
      let db: UniversalSQLiteInterface;
      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
          db = database;
          return db.executeSql(SqlCommands.UPDATE_USER_LOGGED_IN_WHERE_LOGGED_IN, [0, 1]);
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
      let db: UniversalSQLiteInterface;
      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
          db = database;
          //   return this.updateDataBase(db);
          // }).then((wasUpdate:boolean)=>{
          return db.executeSql(SqlCommands.UPDATE_USER_STARTDATE_STARTGOAL_ENDDATE_ENDGOAL_WHERE_LOGGED_IN,
            [user.getStartDate(), user.getStartGoal(), user.getEndDate(), user.getEndGoal(), 1]);
        }).then((res: any) => {
          return this.closeDatabase();
        }).then((wasClosed: boolean) => {
          resolve(user);
        }).catch((error: any) => {
          console.log("noo!");
          reject(error);
        });
    });
  }

  updateDataBase(db: SQLiteObject): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.executeSql('ALTER TABLE user ADD COLUMN startGoal INTEGER', {})
        .then((res: any) => {
          return db.executeSql('ALTER TABLE user ADD COLUMN startDate TEXT', {});
        }).then((res: any) => {
          return db.executeSql('ALTER TABLE user ADD COLUMN endGoal INTEGER', {});
        }).then((res: any) => {
          return db.executeSql('ALTER TABLE user ADD COLUMN endDate TEXT', {});
        }).then((res: any) => {
          resolve(true);
        }).catch(reject);
    })
  }

  getCurrentUser(): User {
    return this.user;
  }

  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      let db: UniversalSQLiteInterface;
      let users: User[] = new Array<User>();
      this.getDatabase()
        .then((database: UniversalSQLiteInterface) => {
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