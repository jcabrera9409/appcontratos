import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MaterialService } from '../../_service/material.service';
import { DetalleMaterial, Material } from '../../_model/material';
import { map, Observable, startWith } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogo-material',
  standalone: true,
  imports: [MatDialogModule, CommonModule, MatAutocompleteModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './catalogo-material.component.html',
  styleUrl: './catalogo-material.component.css'
})
export class CatalogoMaterialComponent implements OnInit {

  materialSeleccionado: Material;

  dataMateriales: Material[] = [];
  dataMateriales$: Observable<Material[]>;

  formGroup: FormGroup;
  
  constructor(
    private materialService: MaterialService,
  ) { 
    this.formGroup = new FormGroup({
      "material": new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.cargarMateriales();
  }

  cargarMateriales(): void {
    this.materialService.listarMaterialesActivos().subscribe({
      next: (data) => {
        this.dataMateriales = data;
        this.iniciarMateriales();
      },
      error: (err) => {
        console.error('Error al cargar materiales:', err);
      }
    });
  }

  private iniciarMateriales() {
    this.formGroup.get('material')!.valueChanges.subscribe((material: Material) => {
      const selected = this.dataMateriales.find(d => d.nombre === (material?.nombre || material));
      this.materialSeleccionado = selected ? selected : null;
    });

    this.dataMateriales$ = this.formGroup.get('material')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterMaterial(value))
    );

    this.formGroup.get('material')!.setValue(this.dataMateriales[0]);
    this.materialSeleccionado = this.dataMateriales[0];
  }

  private _filterMaterial(value: any): Material[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value?.nombre?.toLowerCase() || '';
    return this.dataMateriales.filter(d => d.nombre.toLowerCase().includes(filterValue));
  }
  
  displayMaterial(material: Material): string {
    return material && material.nombre ? material.nombre : '';
  }
}
