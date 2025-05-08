import { DetalleMaterial, Material } from "./material";
import { Producto } from "./producto";

export class Carrito {
    codigo: string = '';
    esPersonaNatural: boolean = true;
    documentoCliente: string = '';
    nombreCliente: string = '';
    apellidoCliente: string = '';
    razonSocialCliente: string = '';
    telefonoCliente: string = '';
    emailCliente: string = '';
    tipoEnvio: string = ''; 
    direccionEntrega: string = '';
    referenciaEntrega: string = '';
    notasPedido: string = '';
    montoEnvio: number = 0;
    descuento: number = 0;
    detalle: ItemCarrito[] = [];
}

export class ItemCarrito {
    producto: Producto;
    material: Material;
    detalleMaterial: DetalleMaterial;
    cantidad: number;
}