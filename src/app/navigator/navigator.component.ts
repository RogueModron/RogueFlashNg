import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NavigationType } from './navigation-type.enum';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit {

  lastDeckId = 0;
  lastCardId = 0;

  deckEnabled = false;
  cardsEnabled = false;
  cardEnabled = false;
  reviewEnabled = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // TODO: Log errors for every subscription in the whole app.

    this.router.events.pipe(
      filter(e => e instanceof ActivationEnd),
      map(e => e as ActivationEnd)
    ).subscribe((e) => {
      const navigationType = e.snapshot.data.navigation as NavigationType | NavigationType.Decks;
      switch (navigationType) {
        case NavigationType.Deck:
          this.deckEnabled = true;
          this.cardsEnabled = false;
          this.cardEnabled = false;
          this.reviewEnabled = false;
          break;
        case NavigationType.Cards:
          this.deckEnabled = true;
          this.cardsEnabled = true;
          this.cardEnabled = false;
          this.reviewEnabled = false;
          break;
        case NavigationType.Card:
          this.deckEnabled = true;
          this.cardsEnabled = true;
          this.cardEnabled = true;
          this.reviewEnabled = false;
          break;
        case NavigationType.Review:
          this.deckEnabled = true;
          this.cardsEnabled = true;
          this.cardEnabled = false;
          this.reviewEnabled = true;
          break;
        default:
          this.deckEnabled = false;
          this.cardsEnabled = false;
          this.cardEnabled = false;
          this.reviewEnabled = false;
          break;
      }

      const parseId = (idParam: string | null) => {
        let value = Number.NaN;
        if (idParam) {
          value = Number.parseInt(idParam);
        }
        if (Number.isNaN(value)) {
          throw new Error('Id is not a number.');
        }
        return value;
      };

      if (this.deckEnabled) {
        this.lastDeckId = parseId(e.snapshot.paramMap.get('deckId'));
      } else {
        this.lastDeckId = 0;
      }
      if (this.cardEnabled) {
        this.lastCardId = parseId(e.snapshot.paramMap.get('cardId'));
      } else {
        this.lastCardId = 0;
      }
    });
  }

}
