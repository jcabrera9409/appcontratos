export class Mensaje {
    estado: string;
    mensaje: string;
    error: any;

    constructor(estado, mensaje, error?: any) {
        this.estado = estado;
        this.mensaje = mensaje;
        this.error = error;
    }
}