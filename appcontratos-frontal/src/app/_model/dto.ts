import { Vendedor } from "./vendedor";

export interface ResetPasswordRequest {
    token: string;
    password: string;
}

export interface ChangeStatusRequest {
    id: number;
    estado: boolean;
    estadoString: String;
    objVendedor: Vendedor;
	fechaActualizacion: String;
}

export interface SendEmailDetalleComprobanteRequest {
    id_contrato: number;
    id_detalleComprobante: number;
}

export interface ReporteContratosIngresos {
    fechaContrato: Date;
    nroContratos: number;
    totalIngresos: number;
}

export interface ReporteTipoAbonoDTO {
    tipoAbono: String;
    totalIngresos: number;
}

export interface ReportePlantillaIngresosDTO {
    nombre: String;
    cantidad: number;
}