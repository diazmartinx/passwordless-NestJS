import { Get, Controller, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private appService: AppService) {}

  @Get()
  root( @Res() res: Response, @Session() expressSession: Record<string,any>) {
    console.log(expressSession);
    return res.render( 'index', {title:"Index"} )
  }
}
