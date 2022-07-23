import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EntryDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}