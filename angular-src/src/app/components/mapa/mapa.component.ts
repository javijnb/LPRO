import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  //Para centrar el mapa
  lat: number;
  lng: number;
  zoom: number;
  mapTypeId: string;

  //Para ubicar los marcadores
  latitud:String[] = new Array();
  longitud:String[] = new Array();
  
  markers = [
    {
        lat: 42.17242766052489,
        lng: -8.676862545159361,
        label: 'Gateway 1 (rotonda)'
    },
    {
        lat:42.17284113386385,
        lng: -8.683870620349603,
        label: 'Gateway 2 (deportes)'
    },
    {
        lat: 42.16733853541521,
        lng: -8.682424371415232,
        label: 'Gateway 3 (CITEXVI)'
    },
    {
        lat: 42.1700644489694,
        lng: -8.688578430207395,
        label: 'Gateway 4 (Teleco)'
  }
  ];

  constructor(
    private router:Router,
    private registerService: RegisterService
  ) {

    //centro del mapa (Vigo centro)
    this.lat = 42.16783474239765;
    this.lng = -8.68245011564502;
    this.zoom = 15;
    this.mapTypeId = "terrain";

    
    
  }

  ngOnInit(): void {

    let body;
    let objetos;
    this.registerService.register(body, "http://localhost:9000/users/listarGateways").subscribe(data => {

      objetos = data.msg;

      // Recorremos cada elemento gateway devuelto y guardamos sus campos en las variables globales
      for (let i = 0; i < objetos.length; i++) {
        this.latitud[i] = objetos[i].latitud;
        this.longitud[i] = objetos[i].longitud;
      }
      
    })

    console.log("Latitudes: ", this.latitud);
    console.log("Longitudes: ", this.longitud);

  }

}
