import { Vendedor } from "./vendedor";

export class Categoria { 
    id: number;
    nombre: string;
    slug: string;
    descripcion: string;
    estado: boolean;
    objPadre: Categoria;
    subCategorias: Categoria[];
    objVendedorActualizacion: Vendedor;
    fechaActualizacion: string;
}