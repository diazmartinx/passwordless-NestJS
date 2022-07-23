import { Body, Controller, Get, Session , Post, Next, UseGuards, Res, UseFilters } from '@nestjs/common';
import { EmailDto, EntryDto } from './dto/email.dto';

import { UsersService } from './users.service';
import { Response } from 'express';
import { LogedGuard } from '../common/guards';
import { User } from '../common/decorators/user.decorator';
import { LoginFilter } from 'src/common/filters/login.filter';

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}
    
    @Get('knock')
    getKnock( @Res() res: Response ) {
        return res.render( 'partials/knock_email', {layout:"layouts/login", title:"Send Email"} )
    }

    @Post('knock') // Send the code to the email
    async knock(@Body() emailDto: EmailDto, @Res() res: Response) {
        const data = await this.usersService.knock(emailDto.email)
        //delete data.code; //ELIMINAR EN PROD !
        console.log(data);
        return res.render('partials/entry_code', {layout:"layouts/login", title:"Send Code", data});
    }

    @Post('entry')
    async entry(@Body() entryDto: EntryDto, @Session() expressSession: Record<string,any>, @Res() res: Response, @Next() next: Function) {

        const data = await this.usersService.entry(entryDto);
        
        if (data.userId) { // if the code is correct, set cookie and redirect to the profile
 
            expressSession.userId = await data.userId;
                
            return res.redirect('/users/redirect');

        } else if (data.codeRetries === 0) { // if the code is wrong too many times, logout
            return res.redirect('/users/knock');
        }

        // if the code is wrong, render the same page with the error but with -1 retries
        return res.render('partials/entry_code', {layout:"layouts/login", title:"Send Code", data});
    }

    @Post('logout')
    logOut(@Session() expressSession: Record<string,any>, @Res() res: Response, @Next() next: Function) {

        expressSession.userId = null;

        expressSession.save(function (err) {
            if (err) next (err);

            expressSession.regenerate(function (err) {
                if (err) next (err);
                return res.redirect('/');
            });
        })

    }

    @UseGuards(LogedGuard)
    @UseFilters(LoginFilter)
    @Get('me')
    async me(@User() userId: number, @Res() res: Response) {
        const userData = await this.usersService.userData(userId);
        return res.render('profile', {layout:"layouts/main", title:"Profile", userData})
    }

    @Get('redirect')
    redirect(@Res() res: Response) {
        // this route is only for the redirect after the login
        // just set the cookies that are needed to validate LogedGuard
        return res.redirect('/users/me');
    }

}