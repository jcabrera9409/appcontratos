import { Comprobante } from "./comprobante";
import { Vendedor } from "./vendedor";

export class DetalleComprobante {
    id: number;
    comentario: String;
    google_zip_id: String;
    google_pdf_id: String;
    fechaCreacion: String;
    objComprobante: Comprobante;
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: String;
}