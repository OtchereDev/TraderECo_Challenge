import { ValidationError } from "class-validator";

export const validatorError = (errors: ValidationError[]) => {
  const errorObj: any = {};

  errors.forEach((error) => {
    errorObj[error.property] = Object.values(error.constraints as any);
  });

  return errorObj;
};
