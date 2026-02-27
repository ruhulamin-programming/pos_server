export class CreateProductDto {
  id: string;
  productName: string;
  categoryId: string;
  description: string;
  productImage: string;
  quantity: number;
  price: number;
}

export class ProductResponseDto {
  id: string;
  productName: string;
  categoryId: string;
  description: string;
  productImage: string;
  quantity: number;
  price: number;
  category: any;
}
