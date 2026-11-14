export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stock: number;
  readonly isActive: boolean;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive?: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;
