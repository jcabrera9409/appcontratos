import { Vendedor } from "./vendedor";

export class Plantilla {
    id: number;
    nombre: String;
    descripcion: String;
    precio: number;
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: String;
}