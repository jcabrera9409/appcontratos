export interface DetalleMaterial {
    id: number;
    nombre: string;
    url: string;
}

export interface Material {
    id: number;
    nombre: string;
    descripcion: string;
    detalles: DetalleMaterial[];
}