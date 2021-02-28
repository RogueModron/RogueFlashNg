import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { DbService } from 'src/app/model/db.service';
import { Card } from 'src/app/model/entities/card';
import { CardsView } from './cards.view';

@Injectable({
  providedIn: 'root'
})
export class CardsService {

  constructor(private dbService: DbService) { }

  create(deckId: number): Observable<number> {
    const card: Card = {
      deckId: deckId,

      // cardId: undefined,
      sideA: '',
      sideB: '',
      notes: '',
      tags: '',

      noBA: false
    } as Card;
    return from(this.dbService.createCard(card));
  }

  search(
    deckId: number,
    searchKey: string): Observable<CardsView> {
    return from(this.dbService.searchCards(deckId, searchKey)).pipe(
      concatMap(cards => cards),
      map((card) => {
        return {
          deckId: card.deckId,
          cardId: card.cardId,
          sideA: card.sideA,
          sideB: card.sideB,
          notes: card.notes
        } as CardsView;
      })
    );
  }
}
