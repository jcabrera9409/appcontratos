export interface Cliente {
    id: number;
    esPersonaNatural: boolean;
    nombreCliente: string;
    apellidosCliente: string;
    razonSocial: string;
    documentoCliente: string;
}

export interface DetalleContrato {
    id: number;
    cantidad: number;
    descripcion: string;
    precio: number;
    precioTotal: number;
} 

export interface Contrato {
    id: number;
    codigo: string;
    telefono: string;
    correo: string;
    direccionEntrega: string;
    referencia: string;
    notaPedido: string;
    fechaContrato: string;
    fechaEntrega: string;
    movilidad: number;
    saldo: number;
    total: number;
    estado: string;
    objCliente: Cliente;
    detalleContrato: DetalleContrato[];
}