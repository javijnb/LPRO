import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
//import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authToken: any;
  user: any;

  constructor(private http:HttpClient) {

  }

  // COMPROBAMOS LLAMANDO A BACKEND SI LOS CREDENCIALES SON CORRECTOS
  authenticateUser(user){

    let url = "http://localhost:9000/users/authenticate";

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
      });
    let options = { headers: headers };

    let json = JSON.stringify(user);
    //console.log(json);

    return this.http.post( url, json, options).pipe(map(res =>(res)));
  }


  // ALMACENAMOS LOS CREDENCIALES (username y tokenJWT) en LOCALSTORAGE del navegador, sin comprometer la seguridad
  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  /*
  loggedIn(){
    return tokenNotExpired();
  }
  */


}
