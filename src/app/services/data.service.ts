/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private bankInicial = 100;
  private stakeFactor = 40;
  private apuestasDiarias = 5;
  private cuotaPromedio = 1.7;
  private fechaInicio = '';
  private diaActual = 1;
  private meta = 400;

  private cierres: Record<number, any> = {};
  private _datos = new BehaviorSubject<any[]>([]);
  public datos$ = this._datos.asObservable();

  constructor() {
    this.cargarDatos(); // Carga los datos desde localStorage al iniciar el servicio
  }

  public guardarDatos(data: any): void {
    this.bankInicial = data.bankInicial;
    this.stakeFactor = data.stakeFactor;
    this.apuestasDiarias = data.apuestasDiarias;
    this.cuotaPromedio = data.cuotaPromedio;
    this.fechaInicio = data.fechaInicio;
    this.meta = data.meta;

    localStorage.setItem('fechaInicio', this.fechaInicio);
    localStorage.setItem('bankInicial', this.bankInicial.toString());
    localStorage.setItem('stakeFactor', this.stakeFactor.toString());
    localStorage.setItem('apuestasDiarias', this.apuestasDiarias.toString());
    localStorage.setItem('cuotaPromedio', this.cuotaPromedio.toString());
    localStorage.setItem('meta', this.meta.toString())


    this.calcularDiaActual();
    this.generarDatos();
  }

  public resetDatos(): void {
    this.guardarDatos({
      bankInicial: 100,
      stakeFactor: 40,
      apuestasDiarias: 5,
      cuotaPromedio: 1.7,
      fechaInicio: '',
      meta: 400
    });
    localStorage.setItem('cierres', '{}');

    this.cargarDatos();
    this.calcularDiaActual();
    this.generarDatos();

  }

  public cargarDatos(): void {
    const fechaGuardada = localStorage.getItem('fechaInicio');
    if (fechaGuardada) {
      this.fechaInicio = fechaGuardada;
    }

    const bankInicialGuardada = localStorage.getItem('bankInicial');
    if (bankInicialGuardada) {
      this.bankInicial = parseFloat(bankInicialGuardada);
    }

    const stakeFactorGuardada = localStorage.getItem('stakeFactor');
    if (stakeFactorGuardada) {
      this.stakeFactor = parseFloat(stakeFactorGuardada);
    }

    const apuestasDiariasGuardada = localStorage.getItem('apuestasDiarias');
    if (apuestasDiariasGuardada) {
      this.apuestasDiarias = parseFloat(apuestasDiariasGuardada);
    }

    const cuotaPromedioGuardada = localStorage.getItem('cuotaPromedio');
    if (cuotaPromedioGuardada) {
      this.cuotaPromedio = parseFloat(cuotaPromedioGuardada);
    }

    const cierresGuardados = localStorage.getItem('cierres');
    if (cierresGuardados) {
      this.cierres = JSON.parse(cierresGuardados);
    }

    const metaGuardado = localStorage.getItem('meta');
    if (metaGuardado) {
      this.meta = parseFloat(metaGuardado);
    }

    this.calcularDiaActual();
    this.generarDatos();
  }

  public calcularDiaActual(): void {
    if (this.fechaInicio) {
      const fechaInicio = new Date(this.fechaInicio);
      const fechaActual = new Date();
      const diferenciaDias = Math.floor((fechaActual.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      this.diaActual = Math.min(diferenciaDias, 30);
    }
  }

  public generarDatos(): any[] {
    const datos: any[] = [];
    let bank = this.bankInicial;
    let totalGanancia = 0;

    let i = 0
    while(bank < this.meta) {
      const stake = bank / this.stakeFactor;
      const retorno = stake * this.cuotaPromedio * this.apuestasDiarias;
      const ganancia = retorno - stake * this.apuestasDiarias;

      // Calculamos la meta en base a la ganancia acumulada
      totalGanancia += ganancia;
      const meta = this.bankInicial + totalGanancia;

      // Obtenemos el cierre para el día siguiente (si aplica)
      const cierre = parseFloat(this.cierres[i]);
      // Guardamos los datos del día actual
      datos.push({
        dia: i + 1,
        bank: bank,
        stake: stake,
        inversion: stake * this.apuestasDiarias,
        retorno: retorno,
        ganancia: ganancia,
        meta: meta,
        cierre: isNaN(cierre) ? meta : cierre,
        gananciaReal: isNaN(cierre) ? ganancia : cierre - bank
      });

      // Si hay un cierre para el día siguiente, lo aplicamos al bank del siguiente día
      if (cierre) {
        // El cierre afecta el bank del día siguiente
        bank = cierre;
        totalGanancia = cierre - this.bankInicial; // Ajustamos totalGanancia al valor del cierre
      } else {
        // Si no hay cierre, el bank se actualiza con la ganancia normalmente
        bank += ganancia;
      }

      i++;
    }

    this._datos.next(datos); // Emitimos los datos generados
    return datos;
  }


  public getBankInicial(): number {
    return this.bankInicial;
  }

  public getStakeFactor(): number {
    return this.stakeFactor;
  }

  public getApuestasDiarias(): number {
    return this.apuestasDiarias;
  }

  public getCuotaPromedio(): number {
    return this.cuotaPromedio;
  }

  public getFechaInicio(): string {
    return this.fechaInicio;
  }

  public getMeta(): number {
    return this.meta;
  }

  public getDiaActual(): number {
    return this.diaActual;
  }

  public cierreCaja(nroDia: number, cierre: number) {
    const cierres = localStorage.getItem('cierres');
    const cierresDesdeLocalStorage = cierres ? JSON.parse(cierres) : {};

    if (cierres) {
      cierresDesdeLocalStorage[nroDia] = cierre;
      localStorage.setItem('cierres', JSON.stringify(cierresDesdeLocalStorage));
    } else {
      cierresDesdeLocalStorage[nroDia] = cierre;
      localStorage.setItem('cierres', JSON.stringify(cierresDesdeLocalStorage));
    }

  }
}
