import { CanActivate, ExecutionContext, Injectable, Scope } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable( {scope: Scope.REQUEST} )
export class LogedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.session.userId;

    console.log(req.session);

    if (!userId || userId == null) {
      console.log('No esta logueado');
      return false;
    }
    return true;
  }
}
