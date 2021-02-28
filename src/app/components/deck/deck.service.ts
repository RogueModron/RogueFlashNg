import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { DbService } from 'src/app/model/db.service';
import { Deck } from 'src/app/model/entities/deck';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(private dbService: DbService) { }

  read(deckId: number): Observable<Deck | undefined> {
    return from(this.dbService.readDeck(deckId));
  }

  update(deck: Deck): void {
    this.dbService.updateDeck(deck);
  }

  delete(deckId: number): void {
    this.dbService.deleteDeck(deckId);
  }
}
