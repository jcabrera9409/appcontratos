export interface Categoria {
    id: number;
    nombre: string;
    slug: string;
    cantidadProductos: number;
    subCategorias: Categoria[];
}