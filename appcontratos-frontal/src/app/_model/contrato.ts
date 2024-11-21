import { Cliente } from "./cliente";
import { DetalleContrato } from "./detalle-contrato";
import { Vendedor } from "./vendedor";

export class Contrato {
    id: number;
    objCliente: Cliente;
    telefono: String;
    correo: String;
    direccionEntrega: String;
    referencia: String;
    fechaContrato: String;
    fechaEntrega: String;
    movilidad: number;
    aCuenta: number;
    tipoAbono: String;
    recargo: number;
    saldo: number;
    total: number;
    objVendedor: Vendedor;
    estado: String;
    detalleContrato: DetalleContrato[]
}   