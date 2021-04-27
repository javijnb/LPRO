import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  timestamp:String[] = new Array();
  AnimalID:number[] = new Array();
  gatewayID:number[] = new Array();
  RSSI:String[] = new Array();
  latitud:String[] = new Array();
  longitud:String[] = new Array();

  tablas:boolean;


  constructor(
    private authService:AuthService,
    private router:Router,
    private registerService: RegisterService
  ) { }

  ngOnInit(): void {

    let body;
    let objetos;
    this.tablas = false;
    this.registerService.register(body, "http://localhost:9000/users/listarGateways").subscribe(data => {

      objetos = data.msg;

      // Recorremos cada elemento gateway devuelto y guardamos sus campos en las variables globales
      for (let i = 0; i < objetos.length; i++) {
        this.timestamp[i] = objetos[i].timestamp_server;
        this.AnimalID[i] = objetos[i].AnimalID;
        this.gatewayID[i] = objetos[i].gatewayID;
        this.RSSI[i] = objetos[i].RSSI;
        this.latitud[i] = objetos[i].latitud;
        this.longitud[i] = objetos[i].longitud;
      }
      
    })

    // console.log("RSSI: ", this.RSSI);

  }

  onLogoutClick(){
    this.authService.logout();
    console.log("Cerrando sesión...");
    this.router.navigate(['/login']);
    return false;
  }

  popupContacto(){
    Swal.fire({
      title: '<strong><b>proxectoluada@gmail.com</b></strong>',
      icon: 'info',
      html:
        'Mande un email a esta dirección sobre calquera inquedanza sobre o proxecto ou da plataforma',
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: false,
      confirmButtonText:
        '<i class="fa fa-thumbs-up"></i> Grazas!',
      confirmButtonAriaLabel: 'Thumbs up, great!',
    })
  }

  updateTablas(cadena){
    if(cadena=="mapa"){
      this.tablas = false;
    }else{
      this.tablas = true;
    }
    console.log("Variable tablas: ", this.tablas);
  }


  


}
