import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  username: String;
  password: String;



  constructor(private validateService:ValidateService, private authService:AuthService, private router:Router) { }




  ngOnInit(): void {
  }




  onLoginSubmit(){

    const user = {
      username: this.username,
      password: this.password
    }

    console.log("Username: ", this.username);
    console.log("Password: ", this.password);


    // Campos obligatorios!
    if(!this.validateService.validateLogin(user)){

      console.log("Rellene todos los campos");
      return false;

    // Si están todos los campos, llamamos al servicio de autenticación
    }else{

      this.authService.authenticateUser(user).subscribe(data => {

        console.log("Información recibida de la funcion authenticateUser: ", data);

        if((data as any).success){
          console.log("EXITO EN LOGIN");
          this.authService.storeUserData((data as any).token, (data as any).user);
          console.log("ESTADO DE LOGIN ALMACENADO");
          this.router.navigate(['dashboard']);

        }else{
          console.log("USUARIO O CONTRASEÑA INCORRECTOS");
          this.router.navigate(['login']);
        }

      });

    }

    


  }

  

}
