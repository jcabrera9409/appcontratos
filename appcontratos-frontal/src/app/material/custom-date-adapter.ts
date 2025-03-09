
import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';

// Definir formato de fecha DD/MM/YYYY
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override parse(value: string): Date | null {
    if (!value) return null;
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, month - 1, day); // Convertir a formato válido
  }

  override format(date: Date, displayFormat: string): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
