import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from "class-validator";

export class UserCreateDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Matches(
    /(?=^.{8,26}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: "Please provide a valid strong password" }
  )
  password: string;

  @IsOptional()
  @IsString()
  role: string;
}

export class UserLoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
