import { SQLiteObject, SQLiteTransaction, } from '@ionic-native/sqlite';
import { SqlCommands } from './sql-commands';

import { Entry } from '../smoke/entry';
import { User } from '../user/user';

export interface UniversalSQLiteInterface {
  addTransaction(transaction: (tx: SQLiteTransaction) => void): void;
  /**
   * @param fn {any}
   * @returns {Promise<any>}
   */
  transaction(fn: any): Promise<any>;
  /**
   * @param fn {Function}
   * @returns {Promise<any>}
   */
  readTransaction(fn: (tx: SQLiteTransaction) => void): Promise<any>;
  startNextTransaction(): void;
  /**
   * @returns {Promise<any>}
   */
  open(): Promise<any>;
  /**
   * @returns {Promise<any>}
   */
  close(): Promise<any>;
  /**
   * Execute SQL on the opened database. Note, you must call `create` first, and
   * ensure it resolved and successfully opened the database.
   */
  executeSql(statement: string, params: any): Promise<any>;
  /**
   * @param sqlStatements {Array<string | string[] | any>}
   * @returns {Promise<any>}
   */
  sqlBatch(sqlStatements: Array<string | string[] | any>): Promise<any>;
  abortallPendingTransactions(): void;
}
export class MockSQLiteObject extends SQLiteObject implements UniversalSQLiteInterface {
  private database: BrowserWebDatabase = new BrowserWebDatabase();
  constructor() {
    super(undefined);
  }
  open(): Promise<any> {
    return Promise.resolve(true);
  }
  close(): Promise<any> {
    return Promise.resolve(true);
  }
  executeSql(statement: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      switch (statement) {
        case SqlCommands.CREATE_USER_TABLE: {
          this.database.set(SqlCommands.USER_TABLE_NAME);
          resolve(true);
          break;
        }
        case SqlCommands.CREATE_SMOKE_TABLE: {
          this.database.set(SqlCommands.SMOKE_TABLE_NAME);
          resolve(true);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_USER: {
          let rows = new Array<User>();
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          entries.forEach(entry => {
            rows.push(entry);
          })
          let result: SQLRowList = new SQLRowList(rows);
          resolve(result);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_SMOKE: {
          let rows = new Array<Entry>();
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          entries.forEach(entry => {
            rows.push(entry);
          })
          let result: SQLRowList = new SQLRowList(rows);
          resolve(result);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_USER_WHERE_ID: {
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let entry = entries.get(params[0]);
          let rows = new Array<User>(entry);
          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_USER_WHERE_USERNAME: {
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let rows = new Array<User>();
          entries.forEach(entry => {
            if (entry.getUsername() === params[0]) {
              rows.push(entry);
            }
          });
          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_USER_WHERE_USERNAME_AND_PASSWORD: {
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let rows = new Array<User>();
          entries.forEach(entry => {
            if (entry.getUsername() === params[0] && entry.getPassword() === params[1]) {
              rows.push(entry);
            }
          });
          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_USER_WHERE_LOGGEDIN: {
          let flag = params[0] === 0 ? false : true;
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let rows = new Array<User>();
          entries.forEach(entry => {
            if (entry.isLoggedIn() === flag) {
              rows.push(entry);
            }
          });
          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_SMOKE_WHERE_ID: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          let entry = entries.get(params[0]);
          let rows = new Array<Entry>(entry);
          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_SMOKE_WHERE_USER_ID: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          let rows = new Array<Entry>();
          entries.forEach(entry => {
            if (entry.getUserId() === params[0]) {
              rows.push(entry);
            }
          });
          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.SELECT_ALL_FROM_SMOKE_WHERE_USER_ID_BETWEEN_START_END: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          let rows = new Array<Entry>();
          entries.forEach(entry => {
            if (entry.getUserId() === params[0]
              && entry.getStart() >= params[1]
              && entry.getStart() < params[2]
            ) {
              rows.push(entry);
            }
          });
          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.SELECT_DATE_COUNT_FROM_SMOKE_WHERE_USER_ID_BETWEEN_START_END: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          let rows = new Array<{ date: string, count: number }>();

          entries.forEach(entry => {
            if (entry.getUserId() === params[0]
              && entry.getStart() >= params[1]
              && entry.getStart() < params[2]
            ) {
              let date = entry.getStart().substr(0, 10);
              let found = rows.find(r => r.date === date);
              if (found) {
                found.count++;
              } else {
                found.count = 1;
              }
            }
          });

          let list: SQLRowList = new SQLRowList(rows);
          resolve(list);
          break;
        }
        case SqlCommands.INSERT_USER: {
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let id = entries.size + 1;
          let entry = new User(id, params[0], params[1], params[2], params[3], params[4], params[5], params[6], params[7]);
          entries.set(id, entry);
          this.database.set(SqlCommands.USER_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.INSERT_SMOKE: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          let id = entries.size + 1;
          let timer = new Entry(id, params[0], params[2], params[1]);
          entries.set(id, timer);
          this.database.set(SqlCommands.SMOKE_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.UPDATE_USER_WHERE_ID: {
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let user = new User(
            params[8],
            params[0],
            params[1],
            params[2],
            params[3],
            params[4],
            params[5],
            params[6],
            params[7],
          )
          entries.set(user.getId(), user);
          this.database.set(SqlCommands.USER_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.UPDATE_USER_LOGGED_IN_WHERE_ID: {
          let flag = params[0] === 0 ? false : true;
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let entry = entries.get(params[1]);
          entry.setLoggedIn(flag);
          this.database.set(SqlCommands.USER_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.UPDATE_USER_STARTDATE_STARTGOAL_ENDDATE_ENDGOAL_WHERE_LOGGED_IN: {
          let flag = params[4] === 0 ? false : true;
          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          let entry: User;
          entries.forEach(e => {
            if (e.isLoggedIn() === flag) entry = e;
          });
          if (!entry) throw new Error("Not Logged in");
          entry.setStartDate(params[0]);
          entry.setStartGoal(params[1]);
          entry.setEndDate(params[2]);
          entry.setEndGoal(params[3])
          this.database.set(SqlCommands.USER_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.UPDATE_USER_LOGGED_IN_WHERE_LOGGED_IN: {
          let whereFlag = params[1] === 0 ? false : true;
          let setFlag = params[0] === 0 ? false : true;

          let entries: Map<number, User> = this.database.get(SqlCommands.USER_TABLE_NAME);
          entries.forEach(entry => {
            if (entry.isLoggedIn() === whereFlag) entry.setLoggedIn(setFlag);
          })
          this.database.set(SqlCommands.USER_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.UPDATE_SMOKE_WHERE_ID: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          let entry = new Entry(params[3], params[0], params[1],params[2]);
          entries.set(entry.getId(), entry);
          this.database.set(SqlCommands.SMOKE_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.UPDATE_SMOKE_ENTRY_TIME_STAMP_AND_NUMBERCOUNT_WHERE_ID: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          let entry = entries.get(params[2]);
          entry.setNumberCount(params[1]);
          entry.setStart(params[0]);
          this.database.set(SqlCommands.SMOKE_TABLE_NAME, entries);
          resolve();
          break;
        }
        case SqlCommands.DELETE_SMOKE_WHERE_ID: {
          let entries: Map<number, Entry> = this.database.get(SqlCommands.SMOKE_TABLE_NAME);
          entries.delete(params[0]);
          this.database.set(SqlCommands.SMOKE_TABLE_NAME, entries);
          resolve();
          break;
        }
        default: {
          throw new Error("Not Implemented");
        }
      }
    });
  }
  sqlBatch(sqlStatements: Array<string | string[] | any>): Promise<any> {
    throw new Error("Not Implemented");
  }
}

export class MobileSQLiteObject extends SQLiteObject implements UniversalSQLiteInterface {
}

class BrowserWebDatabase {
  set(name: string, map?: Map<number, any>) {
    let updatedRows: Array<any> = new Array<any>();
    if (map) {
      map.forEach(item => updatedRows.push(item));
      localStorage.setItem(name, JSON.stringify({ rows: updatedRows }));
    }
    else {
      let db = localStorage.getItem(name);
      if (!db) localStorage.setItem(name, JSON.stringify({ rows: new Array() }));
    }
  }

  get(name): Map<number, any> {
    if (name === SqlCommands.USER_TABLE_NAME) {
      let rows = JSON.parse(localStorage.getItem(name)).rows;
      let map = new Map<number, User>();
      if (rows.length) {
        rows.forEach(item => {
          map.set(item._id, new User(
            item._id,
            item.username,
            item.password,
            item.goal,
            item.loggedIn,
            item.startGoal,
            item.startDate,
            item.endGoal,
            item.endDate
          ));
        })
      }
      return map;
    }
    else if (name === SqlCommands.SMOKE_TABLE_NAME) {
      let rows = JSON.parse(localStorage.getItem(name)).rows;
      let map = new Map<number, Entry>();
      if (rows.length) {
        rows.forEach(item => {
          map.set(item._id, new Entry(
            item._id,
            item.entry_time_stamp,
            item.numberCount,
            item.userId
          ));
        })
      }
      return map;
    }
    return new Map();
  }
}

export class SQLRowList {
  rows: SqlRow;
  constructor(
    entries: any[]
  ) {
    this.rows = new SqlRow(entries);
  }
}

class SqlRow {
  length: number;
  constructor(
    private entries: any[],
  ) {
    this.length = entries.length;
  }
  item(i: number): any {
    return this.entries[i];
  }
}
