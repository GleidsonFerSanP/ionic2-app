import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class StorageUtils {

  constructor(private nativeStorage: NativeStorage) {
  }

  setItem(key: string, value: any){
    return this.nativeStorage.setItem(key, value).then((args) => console.log(args));
  }

  getItem(key: string):Promise<Object>{
   return this.nativeStorage.getItem(key);
  }

}
