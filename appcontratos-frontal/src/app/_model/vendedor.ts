import { Rol } from "./rol";

export class Vendedor {
    id: number;
    nombres: String;
    correo: String;
    password: String;
    estado: Boolean;
    roles: Rol[];
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: String;
}