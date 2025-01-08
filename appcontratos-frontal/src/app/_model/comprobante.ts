import { Contrato } from "./contrato";
import { DetalleComprobante } from "./detalle-comprobante";
import { Vendedor } from "./vendedor";

export class Comprobante {
    id: number;
    notaContador: String;
    mostrarContrato: boolean;
    objContrato: Contrato;
    detalleComprobante: DetalleComprobante[];
    fechaCreacion: String;
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: String;
}