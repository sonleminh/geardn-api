import { Product } from "../modules/product/entities/product.entity";

export interface ProductWithPrice extends Product {
  original_price: number | null;
}
