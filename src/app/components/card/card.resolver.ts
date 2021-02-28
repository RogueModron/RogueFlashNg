import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Card } from 'src/app/model/entities/card';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root',
})
export class CardResolver implements Resolve<Card> {

  constructor(
    private cardService: CardService,
    private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Card | Observable<Card> | Promise<Card> {
    const param = route.paramMap.get('cardId');
    const id = Number.parseInt(param || '');

    return this.cardService.read(id).pipe(
      take(1),
      mergeMap((card) => {
        if (card) {
          return of(card);
        } else {
          // TODO: Log.
          this.router.navigate(['']);
          return EMPTY;
        }
      })
    );
  }

}
