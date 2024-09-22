import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InputFormComponent } from './components/input-form/input-form.component';
import { ChartComponent } from './components/chart/chart.component';
import { TableComponent } from './components/table/table.component';

@Component({
  standalone: true,
  imports: [ RouterModule, InputFormComponent, ChartComponent, TableComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'apuesta';
}
