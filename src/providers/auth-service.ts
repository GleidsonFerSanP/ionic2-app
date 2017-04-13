import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Response, Http } from "@angular/http";
import 'rxjs';

import { Usuario } from './../model/usuario';
import { Device } from './../model/device';

@Injectable()
export class AuthService{

  constructor(private http: Http) {
  }

  public login(usuario: Usuario) : Observable<Response>{
     return this.http
      .post('/login', JSON.stringify(usuario));
  }

  public registerDevice(device: Device) : Observable<Response>{
     return this.http
      .post('/regdevice', JSON.stringify(device));
  }

  public unregisterDevice(usuario: Usuario) : Observable<Response>{
     return this.http
      .get('/devunregister?user='+usuario.User);
  }
  public forgetpass(usuario: Usuario) : Observable<Response>{
     return this.http
      .get('/forgetpass?user='+usuario.User);
  }
}
