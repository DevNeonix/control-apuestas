import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.css'
})
export class InputFormComponent {
  private dataService = inject(DataService);

  public bankInicial = this.dataService.getBankInicial();
  public stakeFactor = this.dataService.getStakeFactor();
  public apuestasDiarias = this.dataService.getApuestasDiarias();
  public cuotaPromedio = this.dataService.getCuotaPromedio();
  public fechaInicio = this.dataService.getFechaInicio();
  public meta = this.dataService.getMeta();


  public guardarDatos(): void {
    const data = {
      bankInicial: this.bankInicial,
      stakeFactor: this.stakeFactor,
      apuestasDiarias: this.apuestasDiarias,
      cuotaPromedio: this.cuotaPromedio,
      fechaInicio: this.fechaInicio,
      meta: this.meta
    };
    this.dataService.guardarDatos(data);
  }

  public resetDatos(): void {
    this.dataService.resetDatos();
  }
}
