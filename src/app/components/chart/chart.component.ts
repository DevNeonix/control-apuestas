import { Component, inject, OnInit, Signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Chart, ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { ElementRenderedDirective } from '../../directives/element-rendered.directive';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [
    ElementRenderedDirective,
    BaseChartDirective
  ],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {

  private dataService = inject(DataService);

  public lineChartData: ChartDataset[] = [];
  public lineChartLabels: string[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public lineChartType: any = 'line';

  ngOnInit(): void {
    this.dataService.datos$.subscribe((datos) => this.generarGrafico(datos));
  }

  generarGrafico(datos: any[]): void {
    const dias = datos.map((dato) => dato.dia.toString());
    const bankValues = datos.map((dato) => dato.bank);
    const metaValues = datos.map((dato) => dato.meta);

    // Configuramos los datos para el gráfico
    this.lineChartData = [
      {
        data: bankValues,
        label: 'Bank Inicial',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1,
      },
      {
        data: metaValues,
        label: 'Meta',
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
        tension: 0.1,
      },
    ];

    // Etiquetas (días) para el eje X
    this.lineChartLabels = dias;
  }
}
