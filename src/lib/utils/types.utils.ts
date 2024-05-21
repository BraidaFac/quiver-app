export type Article = {
	ID_ARTICULO: string;
	CODIGO_PRODUCTO: string;
	NOMBRE: string;
	DESCRIPCIONGRUPOSUPERRUBRO: string;
	DESCRIPCIONSUPERRUBRO: string;
	DESCRIPCIONRUBRO: string;
	DESCRIPCION_MARCA: string;
	TALLES: string;
	STOCKTOTAL: number;
	PRECIOVENTA: number;
	ACTIVO: number;
	searchTerms?: string;
	PRECIOEFECTIVO?: number;
	stocks?: {
		[key: string]: [] | null;
	};
};
