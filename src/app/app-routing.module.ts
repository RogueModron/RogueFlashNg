import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardComponent } from './components/card/card.component';
import { CardResolver } from './components/card/card.resolver';
import { CardsComponent } from './components/cards/cards.component';
import { DeckComponent } from './components/deck/deck.component';
import { DecksComponent } from './components/decks/decks.component';
import { IdGuard } from './guards/id.guard';
import { NavigationType } from './navigator/navigation-type.enum';

/*

  To apply a guard to all routes:
    https://stackoverflow.com/questions/43487827/how-to-apply-canactivate-guard-on-all-the-routes

*/

const routes: Routes = [
  { path: '', redirectTo: '/decks', pathMatch: 'full' },
  {
    path: 'decks',
    component: DecksComponent,
    data: {
      navigation: NavigationType.Decks
    }
  },
  {
    path: 'decks/:deckId',
    component: DeckComponent,
    data: {
      navigation: NavigationType.Deck
    },
    canActivate: [ IdGuard ]
  },
  {
    path: 'decks/:deckId/cards',
    component: CardsComponent,
    data: {
      navigation: NavigationType.Cards
    },
    canActivate: [ IdGuard ]
  },
  {
    path: 'decks/:deckId/cards/:cardId',
    component: CardComponent,
    data: {
      navigation: NavigationType.Card
    },
    canActivate: [ IdGuard ],
    resolve: {
      card: CardResolver
    }
  },
  {
    path: 'decks/:deckId/review',
    loadChildren: async () => {
      return await import('./modules/review/review.module').then(
        m => m.ReviewModule
      );
    },
    data: {
      navigation: NavigationType.Review
    },
    canActivate: [ IdGuard ]
  },
  { path: '**', redirectTo: '/decks' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
