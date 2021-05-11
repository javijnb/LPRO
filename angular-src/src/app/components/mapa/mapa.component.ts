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

  //Para ubicar los marcadores de los lobos
  latitudLobo:String[] = new Array();
  longitudLobo:String[] = new Array();
  latLobo: number;
  lngLobo: number;
  
  //Para los botones de enseñar y esconder
  valor_cobertura: boolean;

/*
Gateway001: 42,170026 -8,688612
Gateway002: 42,170097 -8,688528
Gateway003: 42,169680 -8,688384
Gateway004: 42,169826 -8,688358
*/

  markers = [
    {
        lat: 42.170026,
        lng: -8.688612,
        label: 'Gateway 1'
    },
    {
        lat: 42.170097,
        lng: -8.688528,
        label: 'Gateway 2'
    },
    {
        lat: 42.169680,
        lng: -8.688384,
        label: 'Gateway 3'
    },
    {
        lat: 42.169826,
        lng: -8.688358,
        label: 'Gateway 4'
    }
  ];

  //HACER QUE ESTE ARRAY SEA DEL TIPO: {lat: number, lng: number}, y todos sus objetos dentro tengan ese formato, sin tamaño definido
  markersLobo = [];

  constructor(
    private router:Router,
    private registerService: RegisterService
  ) {

    //centro del mapa
    this.lat = 42.16973963476562;
    this.lng = -8.688470229398263;
    this.zoom = 16;
    this.mapTypeId = "satellite";

    
    
  }

  ngOnInit(): void {

    let body;
    let lobos;
    this.valor_cobertura = true;

    this.registerService.register(body, "http://localhost:9000/users/coordenadasLobo").subscribe(data => {
      lobos = data.msg;

      console.log("LOBOS lenght: ", lobos.length);

      /* PARA DEPURAR LOS DATOS RECIBIDOS DEL BACKEND (cambiar luego los markers en el HTML)
      for(let j = 0; j < lobos.length; j++){

        this.latitudLobo[j] = lobos[j].latitudestimada;
        this.longitudLobo[j] = lobos[j].longitudestimada;

        console.log("Item: "+j+": "+lobos[j].latitudestimada);
        console.log("Item: "+j+": "+lobos[j].longitudestimada);

        this.markersLobo[j].lat       = lobos[j].latitudestimada;
        this.markersLobo[j].lng       = lobos[j].longitudestimada;
        this.markersLobo[j].timestamp = lobos[j].timestamp_algoritmo;
        
        console.log("MarkerLobo lat:", this.markersLobo[j].lat);
        console.log("MarkerLobo lng:", this.markersLobo[j].lng);
          
      }
      */

      this.markersLobo = lobos;
      console.log("MarkersLobo ", this.markersLobo);


    });

  }

  cobertura(){
    if(this.valor_cobertura==true){
      this.valor_cobertura=false;
    }else{
      this.valor_cobertura=true;
    }

    console.log("Cobertura: ", this.valor_cobertura);
  }


}

