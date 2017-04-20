import { Injectable } from '@angular/core';

import { Platform } from 'ionic-angular';

import { PushNotification } from './../model/push-notification';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class PushNotificationDao {

  db: SQLiteObject;

  constructor(
    private sqlite: SQLite,
    private platform: Platform) {
    this.createDb();
  }

  private createDb() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: "centi.db",
        location: "default"
      }).then((db) => {
        this.db = db;
        this.createTableIfNotExists();
      }, (error) => {
        console.error("Unable to open database", error);
      });
    });
  }

  private createTableIfNotExists() {
    console.log(this.getSqlCreateDb());
    this.db.executeSql(this.getSqlCreateDb(), {}).then((data) => {
      console.log("TABLE CREATED: ", data);
    }, (error) => {
      console.error("Unable to execute sql", error);
    })
  }

  public save(pushNotification: PushNotification): Promise<Object> {
    let sql = this.getSaveSql(pushNotification);
    console.log(sql);
    return this.db.executeSql(sql, []);
  }

  public update(pushNotification: PushNotification, callback) {

     this.platform.ready().then(() => {
      this.sqlite.create({
        name: "centi.db",
        location: "default"
      }).then((db) => {
        this.db = db;
        let sql = this.getUpdateSql(pushNotification);
        console.log(sql);
        this.db.executeSql(sql, [])
          .then((data) => {
            console.log(data);
            callback(data);
          })
      }, (error) => {
        console.error("Unable to open database", error);
      });
    });
  }

  private getSaveSql(pushNotification: PushNotification): string {
    let sql = `
      INSERT INTO pushNotification (Id, Type, Title, Message, Readed, CreateOn, Submitted) VALUES
      (
        '${pushNotification.Id}',
        ${pushNotification.Type},
        '${pushNotification.Title}',
        '${pushNotification.Message}',
        ${pushNotification.Readed?1:0},
        '${this.generateSqlToDate(pushNotification.Create)}',
        ${pushNotification.Submitted?1:0}
      )
      `
    return sql;
  }

  private generateSqlToDate(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minuts = date.getMinutes();
    let seconds = date.getSeconds();

    return `${year}-${month + 1}-${day} ${hour}:${minuts}:${seconds}`;
  }

  private getUpdateSql(pushNotification: PushNotification): string {
    let sql = `
      UPDATE pushNotification SET 
      Readed=${pushNotification.Readed?1:0},
      Submitted=${pushNotification.Submitted?1:0}
       WHERE Id = '${pushNotification.Id}'
      `
    return sql;
  }

  public findById(id: string): Promise<Object> {
    return this.db.executeSql('SELECT * FROM pushNotification AS p WHERE p.Id = \'' + id + '\'', []);
  }

  public findAllOnInit(callback) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: "centi.db",
        location: "default"
      }).then((db) => {
        this.db = db;
        this.db.executeSql('SELECT * FROM pushNotification ORDER BY CreateOn DESC', [])
          .then((data) => {
            callback(data);
          })
      }, (error) => {
        console.error("Unable to open database", error);
      });
    });
  }

  public findAll() {
    return this.db.executeSql('SELECT * FROM pushNotification ORDER BY CreateOn DESC', []);
  }

  private getSqlCreateDb(): string {
    return [
      ' CREATE TABLE IF NOT EXISTS ',
      ' pushNotification',
      ' (',
      ' Id VARCHAR(255) PRIMARY KEY,',
      ' Type INTEGER(11),',
      ' Title TEXT,',
      ' Message TEXT,',
      ' Readed BOOLEAN,',
      ' CreateOn DATE,',
      ' Submitted BOOLEAN',
      ')'
    ].join("");
  }

}
