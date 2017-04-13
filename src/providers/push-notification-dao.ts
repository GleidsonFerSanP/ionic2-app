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
    this.db.executeSql(this.getSqlCreateDb(), {}).then((data) => {
      console.log("TABLE CREATED: ", data);
    }, (error) => {
      console.error("Unable to execute sql", error);
    })
  }

  public save(pushNotification: PushNotification): Promise<Object>{
    let sql = this.getSaveSql(pushNotification);
    console.log(sql);
    return this.db.executeSql(sql, []);
  }

  private getSaveSql(pushNotification: PushNotification): string{
    let array = [];
    array.push("INSERT INTO pushNotification (Id, Type, Title, Message, Read) VALUES");
    array.push("(");
    array.push("'");
    array.push(pushNotification.Id);
    array.push("'");
    array.push(",");
    array.push("'");
    array.push(pushNotification.Type);
    array.push("'");
    array.push(",");
    array.push("'");
    array.push(pushNotification.Title);
    array.push("'");
    array.push(",");
    array.push("'");
    array.push(pushNotification.Message);
    array.push("'");
    array.push(",");
    array.push("'");
    array.push(pushNotification.Read);
    array.push("'");
    array.push(")");

    return array.join('');
  }
 
  public findById(id: string): Promise<Object>{
    return this.db.executeSql('SELECT * FROM pushNotification AS p WHERE p.Id = \''+id+'\'', []);
  }
  
  public findAll(){
    return this.db.executeSql('SELECT * FROM pushNotification', []);
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
      ' READ INTEGER(1)',
      ') '
    ].join("");
  }

}
