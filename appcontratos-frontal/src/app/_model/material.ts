import { DetalleMaterial } from "./detalle-material";
import { Vendedor } from "./vendedor";

export class Material {
    id: number;
    nombre: string;
    descripcion: string;
    estado: boolean;
    detalles: DetalleMaterial[];
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: string;    
}