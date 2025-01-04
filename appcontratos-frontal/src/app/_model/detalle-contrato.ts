import { Plantilla } from "./plantilla";

export class DetalleContrato {
    id: number;
    cantidad: number;
    descripcion: String;
    precio: number;
    precioTotal: number;
    objPlantilla: Plantilla;
}