import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {
    for (const key of route.paramMap.keys) {
      if (key === 'id' || key.endsWith('Id')) {
        const param = route.paramMap.get(key);
        const id = Number.parseInt(param || '');
        if (Number.isNaN(id) || id <= 0) {
          return this.router.parseUrl('');
        }
      }
    }
    return true;
  }

}
