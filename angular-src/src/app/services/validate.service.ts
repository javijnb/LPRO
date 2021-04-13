import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateLogin(user){

    if(user.username == undefined || user.password == undefined){
      return false;
    }else{
      return true;
    }
    
  }
}
