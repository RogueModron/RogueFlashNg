import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { DbService } from 'src/app/model/db.service';
import { CardToReview } from 'src/app/model/dtos/card.to.review';
import { Planner } from 'src/app/model/planner/planner';
import { ReviewValues } from 'src/app/model/planner/review.values';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private dbService: DbService) { }

  read(deckId: number): Observable<CardToReview | undefined> {
    return from(this.dbService.searchNextCardToReview(deckId));
  }

  review(card: CardToReview, value: ReviewValues, date: Date): void {
    const plannerResult = Planner.planNext(value, date, card.lastDate);
    this.dbService.review(card, value, date, plannerResult.nextDate);
  }
}
