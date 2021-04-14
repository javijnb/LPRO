import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  //private URL = "http://localhost:9000/admin/registro";

  constructor(private http:HttpClient) { }

  register(producto, URL): Observable<any>{

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
      });
    let options = { headers: headers };
    
    let json = JSON.stringify(producto);
    console.log(json);

    return this.http.post( URL, json, options).pipe(map(res =>(res)));
    
    

  }
}