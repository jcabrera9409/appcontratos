export interface Departamento {
    id: number;
    nombre: string;
    provincias: Provincia[];
}

export interface Provincia {
    id: number;
    nombre: string;
    distritos: Distrito[];
}

export interface Distrito {
    id: number;
    nombre: string;
    monto: number;
}
