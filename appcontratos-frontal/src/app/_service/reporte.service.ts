import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ReporteContratosIngresos, ReporteTipoAbonoDTO } from '../_model/dto';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  protected url: String = `${environment.HOST}/reportes`

  constructor(protected http: HttpClient) { }

  reporteContratosIngresos(fechaInicio: Date, fechaFin: Date) {
    const inicio = fechaInicio.toISOString().split('T')[0];
    const fin = fechaFin.toISOString().split('T')[0];
    return this.http.get<ReporteContratosIngresos[]>(`${this.url}/contratos-ingresos?fechaInicio=${inicio}&fechaFin=${fin}`);
  }

  reporteTipoAbono(fechaInicio: Date, fechaFin: Date) {
    const inicio = fechaInicio.toISOString().split('T')[0];
    const fin = fechaFin.toISOString().split('T')[0];
    return this.http.get<ReporteTipoAbonoDTO[]>(`${this.url}/tipo-abono?fechaInicio=${inicio}&fechaFin=${fin}`);
  }

  reportePlantillaIngresos(fechaInicio: Date, fechaFin: Date) {
    const inicio = fechaInicio.toISOString().split('T')[0];
    const fin = fechaFin.toISOString().split('T')[0];
    return this.http.get<ReporteContratosIngresos[]>(`${this.url}/plantilla-ingresos?fechaInicio=${inicio}&fechaFin=${fin}`);
  }
}
