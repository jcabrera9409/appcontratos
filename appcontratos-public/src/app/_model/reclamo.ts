import { Distrito } from "./departamento";

export class Reclamo {
    codigo: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    tipoDocumento: string;
    numeroDocumento: string;
    celular: string;
    direccion: string;
    referencia: string;
    correo: string;
    esMenorEdad: boolean;
    nombreTutor: string;
    correoTutor: string;
    tipoDocumentoTutor: string;
    numeroDocumentoTutor: string;
    tipoReclamo: string;
    tipoConsumo: string;
    codigoContrato: string;
    fechaReclamo: string;
    montoReclamado: number;
    descripcion: string;
    detalleReclamo: string;
    pedidoCliente: string;
    estado: string;
    distrito: Distrito;
}