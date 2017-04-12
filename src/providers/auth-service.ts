import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Response, Http } from "@angular/http";
import 'rxjs';

import { Usuario } from './../model/usuario';
import { Device } from './../model/device';

import { LocationTracker } from './../providers/location-tracker';

@Injectable()
export class AuthService{

  constructor(private http: Http, private location: LocationTracker) {
  }

  public login(usuario: Usuario) : Observable<Response>{
     return this.http
      .post('/login', JSON.stringify(usuario));
  }

  public registerDevice(device: Device) : Observable<Response>{
     return this.http
      .post('/regdevice', JSON.stringify(device));
  }
}
