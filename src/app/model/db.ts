import { Dexie } from 'dexie';
import { Card } from './entities/card';
import { Deck } from './entities/deck';
import { Review } from './entities/review';

export class Db extends Dexie {

  decks: Dexie.Table<Deck, number>;
  cards: Dexie.Table<Card, number>;
  reviews: Dexie.Table<Review, number>;

  constructor(databaseName: string) {
    super(databaseName);

    this.version(1).stores({
        decks: '++deckId, description, notes',
        cards: '++cardId, deckId, sideA, sideB, notes, tags, nextAB, nextBA',
        reviews: '++reviewId, cardId'
    });

    this.decks = this.table('decks');
    this.cards = this.table('cards');
    this.reviews = this.table('reviews');
  }
}
