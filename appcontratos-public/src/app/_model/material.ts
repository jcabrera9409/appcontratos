export interface DetalleMaterial {
    id: number;
    nombre: string;
    descripcion: string;
    url: string;
}

export interface Material {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    detalles: DetalleMaterial[];
}