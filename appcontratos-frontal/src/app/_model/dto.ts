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