import {
  IsMongoId,
  IsNumberString,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator";
import type { ProductType } from "../models/products";

export class ProductCreateDTO {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsUrl()
  imageUrl: string;

  @IsNumberString()
  price: string;
}

export class GetProductDTO {
  @IsMongoId()
  productId: string;
}
