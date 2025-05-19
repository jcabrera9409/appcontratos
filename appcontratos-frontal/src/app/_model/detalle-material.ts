import { Material } from "./material";
import { Vendedor } from "./vendedor";

export class DetalleMaterial {
    id: number;
    nombre: string;
    url: string;
    descripcion: string;
    estado: boolean;
    objMaterial: Material;
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: string;
}