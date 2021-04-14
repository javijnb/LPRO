import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  lat: number;
  lng: number;
  zoom: number;
  mapTypeId: string;

  constructor() {

    this.lat = 42.221138;
    this.lng = -8.735002;
    this.zoom = 12;
    this.mapTypeId = "terrain";
    
  }

  ngOnInit(): void {
  }

}
