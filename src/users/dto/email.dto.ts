import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

export class EmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class EntryDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}