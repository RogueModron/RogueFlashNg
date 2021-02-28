import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { DbService } from 'src/app/model/db.service';
import { Deck } from 'src/app/model/entities/deck';
import { DecksView } from './decks.view';

@Injectable({
  providedIn: 'root'
})
export class DecksService {

  constructor(private dbService: DbService) { }

  create(): Observable<number> {
    const deck: Deck = {
      // deckId: undefined,
      description: '',
      notes: ''
    } as Deck;
    return from(this.dbService.createDeck(deck));
  }

  search(searchKey: string): Observable<DecksView> {
    return from(this.dbService.searchDecks(searchKey)).pipe(
      concatMap(decks => decks),
      map((deck) => {
        const decksView: DecksView = {
          id: deck.deckId,
          description: deck.description,
          notes: deck.notes
        };
        return decksView;
      })
    );
  }
}
