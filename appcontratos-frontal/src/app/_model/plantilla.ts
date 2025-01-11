import { Vendedor } from "./vendedor";

export class Plantilla {
    id: number;
    nombre: String;
    descripcion: String;
    precio: number;
    estado: boolean;
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: String;
}