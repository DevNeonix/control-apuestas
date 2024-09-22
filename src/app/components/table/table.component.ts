 
import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AsyncPipe, DecimalPipe, NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    DecimalPipe,
    NgForOf,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  private dataService = inject(DataService);
  public datos= this.dataService.datos$;
  public fechaInicio ?: any;
  public diaActual = 0;

  public isEditable: number | null = null;

  ngOnInit(): void {
    this.dataService.datos$.subscribe(()=>{
      this.fechaInicio = this.dataService.getFechaInicio();
      const fechaInicio = new Date(this.fechaInicio);
      const fechaActual = new Date();
      // @ts-ignore
      const diferenciaTiempo = fechaActual - fechaInicio;
      const diferenciaDias = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24)) + 1; // +1 para contar desde el primer día
      this.diaActual = Math.min(diferenciaDias, 30);
    })

  }

  cierreCaja($event: any, index: number) {
    const cierre = $event.target.value;
    this.dataService.cierreCaja(index, cierre);
    this.dataService.cargarDatos();
    this.dataService.generarDatos();
    this.isEditable = null;
  }
}
