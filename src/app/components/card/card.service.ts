import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { DbService } from 'src/app/model/db.service';
import { Card } from 'src/app/model/entities/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private dbService: DbService) { }

  read(cardId: number): Observable<Card | undefined> {
    return from(this.dbService.readCard(cardId));
  }

  update(card: Card): void {
    this.dbService.updateCard(card);
  }

  delete(cardId: number): void {
    this.dbService.deleteCard(cardId);
  }
}
