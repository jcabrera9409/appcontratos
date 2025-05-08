import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Departamento } from '../_model/departamento';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService extends GenericService<Departamento> {

  private departamentoCambio = new Subject<Departamento[]>();

  constructor(
      http: HttpClient
    ) { 
      super(
        http,
        `${environment.HOST}/departamentos`
      )
    }

    getDepartamentoCambio() {
      return this.departamentoCambio.asObservable();
    }

    setDepartamentoCambio(departamento: Departamento[]) {
      this.departamentoCambio.next(departamento);
    }
  
}
