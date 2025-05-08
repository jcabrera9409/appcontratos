import { Categoria } from "./categoria";
import { DetalleMaterial, Material } from "./material";

export interface ProductoImagen {
    id: number;
    nombre: string;
    url: string;
}

export interface Producto {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string;
    descripcionTecnica: string;
    precio: number;
    descuento: number;
    precioFinal: number;
    tiempoFabricacion: number;
    imagenes: ProductoImagen[];
    materiales: Material[];
    objDetalleMaterialDefecto: DetalleMaterial;
    objCategoria: Categoria;
}