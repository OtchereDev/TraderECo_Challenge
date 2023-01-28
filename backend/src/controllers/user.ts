import { UserCreateDTO, UserLoginDTO } from "../dtos/user";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { validatorError } from "../helpers/formatValidatorError";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export const UserCreate = async function (req: Request, res: Response) {
  const userDTO = new UserCreateDTO();
  userDTO.name = req.body.name;
  userDTO.email = req.body.email;
  userDTO.password = req.body.password;
  userDTO.role = req.body.role;

  // verify input parameters
  const errors = await validate(userDTO);

  if (errors.length) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: validatorError(errors),
      message: "Could not handle this request",
    });
    return;
  }

  const salt: any = bcrypt.genSaltSync(10) as any;

  const user = new User({
    ...req.body,
    email: req.body.email?.toLowerCase(),
    password: bcrypt.hashSync(req.body.password, salt),
  });

  try {
    const result = await user.save();
    res.status(StatusCodes.CREATED).json({
      message: "User successfully created",
      user: result,
    });
    return;
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const UserLogin = async function (req: Request, res: Response) {
  const userDTO = new UserLoginDTO();
  userDTO.email = req.body.email;
  userDTO.password = req.body.password;

  // verify input parameters
  const errors = await validate(userDTO);

  if (errors.length) {
    res.status(StatusCodes.BAD_REQUEST).json({
      errors: validatorError(errors),
      message: "Could not handle this request",
    });
    return;
  }

  try {
    const user = await User.findOne({
      email: req.body.email?.toLowerCase(),
    }).select(["name", "email", "password", "createdAt", "updatedAt", "role"]);
    console.log(user);

    if (user == null) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Incorrect user credentials",
      });
      return;
    }

    const isSamePassword = bcrypt.compareSync(
      req.body.password,
      user.password as string
    );
    if (!isSamePassword) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Incorrect user credentials",
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "3d",
      }
    );

    const { password, ...data } = (user as any)._doc;

    res.status(StatusCodes.OK).json({
      message: "Successfully logged in",
      data: {
        token,
        user: data,
      },
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};

export const CurrentUser = async function (req: Request, res: Response) {
  const [, token] = (req.headers.authorization || "").split(" ");

  if (!token.length) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "JWT Token is required",
    });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findOne({
      email: decoded.email,
      _id: decoded.userId,
    });
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Invalid user credentials",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: "User successfully fetched",
      data: user,
    });
    return;
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
    return;
  }
};
