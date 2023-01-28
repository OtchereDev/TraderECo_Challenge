import { GetProductDTO, ProductCreateDTO } from "../dtos/products";
import { Product } from "../models/products";
import { validate } from "class-validator";
import { Request, Response } from "express";
import status, { StatusCodes } from "http-status-codes";
import { validatorError } from "../helpers/formatValidatorError";

export const AddProduct = async function (req: Request, res: Response) {
  const productDTO = new ProductCreateDTO();
  productDTO.name = req.body.name;
  productDTO.description = req.body.description;
  productDTO.imageUrl = req.body.imageUrl;
  productDTO.price = req.body.price;

  // verify input parameters
  const errors = await validate(productDTO);

  if (errors.length) {
    res.status(status.BAD_REQUEST).json({
      errors: validatorError(errors),
      message: "Could not handle this request",
    });
    return;
  }

  let product = new Product(req.body);

  try {
    const result = await product.save();
    res.status(status.CREATED).json({
      message: "Product successfully created",
      product: result,
    });
    return;
  } catch (err: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: err.message,
      status: status.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const GetProductDetail = async function (req: Request, res: Response) {
  // validate param
  const getProductDTO = new GetProductDTO();
  getProductDTO.productId = req.params.productId;

  const errors = await validate(getProductDTO);

  if (errors.length) {
    res.status(status.BAD_REQUEST).json({
      errors: validatorError(errors),
      message: "Could not handle this request",
    });
    return;
  }

  try {
    const product = await Product.findById(req.params.productId);

    if (!product) throw new Error("Products does not exist");
    res.status(StatusCodes.CREATED).json({
      message: "Product successfully fetched",
      product,
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: status.INTERNAL_SERVER_ERROR,
    });
  }
};

export const GetProducts = async function (req: Request, res: Response) {
  const search = req.query.search || "";
  const page =
    req.query.page?.length && !isNaN(parseInt(req.query.page as string))
      ? parseInt(req.query.page as string)
      : 1;
  const pageSize =
    req.query.pageSize?.length && !isNaN(parseInt(req.query.pageSize as string))
      ? parseInt(req.query.pageSize as string)
      : 20;

  try {
    const products = await Product.find({
      ...(search?.length && { name: { $regex: search, $options: "i" } }),
    })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await Product.find({
      ...(search?.length && { name: { $regex: search, $options: "i" } }),
    }).count();

    res.status(StatusCodes.OK).json({
      message: "Product successfully fetched",
      data: {
        totalCount,
        page: page,
        pageSize: pageSize,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0,
        products,
      },
    });
  } catch (error) {}
};

export const UpdateProduct = async function (req: Request, res: Response) {
  // validate param
  const getProductDTO = new GetProductDTO();
  getProductDTO.productId = req.params.productId;

  const errors = await validate(getProductDTO);

  if (errors.length) {
    res.status(status.BAD_REQUEST).json({
      errors: validatorError(errors),
      message: "Could not handle this request",
    });
    return;
  }

  const productDTO = new ProductCreateDTO();
  productDTO.name = req.body.name;
  productDTO.description = req.body.description;
  productDTO.imageUrl = req.body.imageUrl;
  productDTO.price = req.body.price;

  // verify input parameters
  const bodyErrors = await validate(productDTO);

  if (errors.length) {
    res.status(status.BAD_REQUEST).json({
      errors: validatorError(bodyErrors),
      message: "Could not handle this request",
    });
    return;
  }

  try {
    const product = await Product.updateOne(
      { _id: req.params.productId },
      req.body
    );
    res.status(StatusCodes.CREATED).json({
      message: "Product successfully updated",
      product,
    });
    return;
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: status.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const DeleteProduct = async function (req: Request, res: Response) {
  const getProductDTO = new GetProductDTO();
  getProductDTO.productId = req.params.productId;

  const errors = await validate(getProductDTO);

  if (errors.length) {
    res.status(status.BAD_REQUEST).json({
      errors: validatorError(errors),
      message: "Could not handle this request",
    });
    return;
  }

  try {
    await Product.deleteOne({ _id: req.params.productId });
    res.status(StatusCodes.NO_CONTENT).json({
      message: "Product successfully deleted",
    });
    return;
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: status.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};
