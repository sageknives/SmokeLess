export class SqlCommands {
  public static USER_TABLE_NAME = 'user';
  public static SMOKE_TABLE_NAME = 'smoke';

  //create tables
  public static CREATE_USER_TABLE = 'CREATE TABLE IF NOT EXISTS ' + SqlCommands.USER_TABLE_NAME + '(_id INTEGER PRIMARY KEY, username TEXT, password TEXT, goal INTEGER, loggedIn INTEGER, startDate TEXT, startGoal INTEGER, endDate TEXT, endGoal INTEGER)'
  public static CREATE_SMOKE_TABLE = 'CREATE TABLE IF NOT EXISTS ' + SqlCommands.SMOKE_TABLE_NAME + '(_id INTEGER PRIMARY KEY, entry_time_stamp TEXT, numberCount INTEGER, user_id INTEGER)'

  //add one 
  public static INSERT_USER = 'INSERT INTO ' + SqlCommands.USER_TABLE_NAME + ' VALUES(NULL,?,?,?,?,?,?,?,?)';
  public static INSERT_SMOKE = 'INSERT INTO ' + SqlCommands.SMOKE_TABLE_NAME + ' VALUES(NULL,?,?,?)';

  //update one
  public static UPDATE_USER_WHERE_ID = 'UPDATE ' + SqlCommands.USER_TABLE_NAME + ' SET username =?, password =?, goal =?,loggedIn =?, startDate =?, endDate =?, endGoal =? WHERE _id =?';
  public static UPDATE_SMOKE_WHERE_ID = 'UPDATE ' + SqlCommands.SMOKE_TABLE_NAME + ' SET entry_time_stamp =?, numberCount =?, user_id =? WHERE _id =?';

  //update timestamp by id
  public static UPDATE_SMOKE_ENTRY_TIME_STAMP_AND_NUMBERCOUNT_WHERE_ID = 'UPDATE ' + SqlCommands.SMOKE_TABLE_NAME + ' SET entry_time_stamp =?, numberCount = ? WHERE _id =?';

  //update loggedin by id
  public static UPDATE_USER_LOGGED_IN_WHERE_ID = 'UPDATE ' + SqlCommands.USER_TABLE_NAME + ' SET loggedIn =? WHERE _id =?';

  //update loggedin by loggedin
  public static UPDATE_USER_LOGGED_IN_WHERE_LOGGED_IN = 'UPDATE ' + SqlCommands.USER_TABLE_NAME + ' SET loggedIn =? WHERE loggedIn =?';

  //update user start end goals
  public static UPDATE_USER_STARTDATE_STARTGOAL_ENDDATE_ENDGOAL_WHERE_LOGGED_IN = 'UPDATE ' + SqlCommands.USER_TABLE_NAME + ' SET startDate =?, startGoal =?, endDate =?, endGoal =? WHERE loggedIn =?';

  //delete smoke entry by id 
  public static DELETE_SMOKE_WHERE_ID = 'DELETE FROM ' + SqlCommands.SMOKE_TABLE_NAME + ' WHERE _id =?';

  //get all
  public static SELECT_ALL_FROM_USER = 'SELECT * FROM ' + SqlCommands.USER_TABLE_NAME;
  public static SELECT_ALL_FROM_SMOKE = 'SELECT * FROM ' + SqlCommands.SMOKE_TABLE_NAME;

  //get all smoke by userid 
  public static SELECT_ALL_FROM_SMOKE_WHERE_USER_ID = 'SELECT * FROM ' + SqlCommands.SMOKE_TABLE_NAME + ' WHERE user_id =?';

  //get all smoke by userid between two timestamps
  public static SELECT_ALL_FROM_SMOKE_WHERE_USER_ID_BETWEEN_START_END = 'SELECT * FROM ' + SqlCommands.SMOKE_TABLE_NAME + ' WHERE user_id =? AND entry_time_stamp >= ? AND entry_time_stamp < ?';

  //get day count by userid between two timestamps
  public static SELECT_DATE_COUNT_FROM_SMOKE_WHERE_USER_ID_BETWEEN_START_END = 'SELECT date(entry_time_stamp) as date, count(*) as count FROM ' + SqlCommands.SMOKE_TABLE_NAME + ' WHERE user_id =? AND entry_time_stamp >= ? AND entry_time_stamp < ?';

  //get by id
  public static SELECT_ALL_FROM_USER_WHERE_ID = 'SELECT * FROM ' + SqlCommands.USER_TABLE_NAME + ' WHERE _id =?';
  public static SELECT_ALL_FROM_SMOKE_WHERE_ID = 'SELECT * FROM ' + SqlCommands.SMOKE_TABLE_NAME + ' WHERE _id =?';

  //get by username
  public static SELECT_ALL_FROM_USER_WHERE_USERNAME = 'SELECT * FROM ' + SqlCommands.USER_TABLE_NAME + ' WHERE username =?';

  //get by username and password
  public static SELECT_ALL_FROM_USER_WHERE_USERNAME_AND_PASSWORD = 'SELECT * FROM ' + SqlCommands.USER_TABLE_NAME + ' WHERE username =? AND password =?';

  //get by loggedIn
  public static SELECT_ALL_FROM_USER_WHERE_LOGGEDIN = 'SELECT * FROM ' + SqlCommands.USER_TABLE_NAME + ' WHERE loggedIn =?';


  public static ADD_NUMBER_COUNT_TO_SMOKING_TABLE = 'ALTER TABLE ' + SqlCommands.SMOKE_TABLE_NAME + ' ADD numberCount INTEGER';
  public static NUMBER_COUNT_EXISTS_IN_SMOKING_TABLE = 'SELECT numberCount from ' + SqlCommands.SMOKE_TABLE_NAME + ' LIMIT 1';
}