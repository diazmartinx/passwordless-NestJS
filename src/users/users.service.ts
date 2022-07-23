import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { EntryDto } from './dto/email.dto';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

    generateCode(length: number) {
        const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    async knock(email: string) {

        const code = this.generateCode(4);

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            }
        });

        let newUser : User;

        if (user) {
            // user exist -> update code

            newUser = await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    code,
                    codeRetries: 5,
                    lastEmailSentAt: Math.floor(Date.now()/1000/60), // convert to minutes
                }

        })} else {
            // user doesn't exist -> create user

            newUser = await this.prisma.user.create({
                data: {
                    email,
                    code,
                    lastEmailSentAt: Math.floor(Date.now()/1000/60) // convert to minutes
                }
            });

        
        }
        // send email with code
        const timeleft = 10 - (Math.floor(Date.now()/1000/60) - newUser.lastEmailSentAt);

        return {
            message: "email sent to " + email + " next email can be send in " + timeleft + " minutes",
            code,
            codeRetries: 5,
            email : newUser.email,
        }

    }


    async entry(entryDto: EntryDto) {

        let response : {
            message: String, // message to show to the user
            codeRetries: Number, // number of retries left
            email: String,      // email of the user
            userId: Number,    // user id
        }

        const user = await this.prisma.user.findUnique({
            where: {
                email: entryDto.email,
            }
        });

        if (user.code === entryDto.code.toLowerCase()) { // check if code is correct

            // code is correct -> login user
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    codeRetries: 5, // CAMBIAR A 0 !!!!
                    confirmed: true,
                }
            });

            return response = {
                message: "login successful",
                codeRetries: null,
                email: null,
                userId: user.id,
            }
            
        } else {
            // code is incorrect -> update codeRetries // render the same page with the error but with -1 retries
            await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    codeRetries: user.codeRetries - 1,//ASD
                }

        })};

        return response = {
            message: "login failed",
            codeRetries: user.codeRetries - 1,
            email: user.email,
            userId: null,
        }
    }

    async userData(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        return user;
    }




}

