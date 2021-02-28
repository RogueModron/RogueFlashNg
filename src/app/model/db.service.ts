import { Inject, Injectable, Optional } from '@angular/core';
import { Db } from './db';
import { CardToReview } from './dtos/card.to.review';
import { Card } from './entities/card';
import { Deck } from './entities/deck';
import { Review } from './entities/review';
import { ReviewValues } from './planner/review.values';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  private static readonly defaultDatabaseName = 'RogueFlashNg';

  private db: Db;

  constructor(@Inject(null) @Optional() private databaseName?: string) {
    if (databaseName) {
      this.db = new Db(databaseName);
    } else {
      this.db = new Db(DbService.defaultDatabaseName);
    }
  }

  createDeck(deck: Deck): Promise<number> {
    return this.db.transaction('rw', this.db.decks, async () => {
      return await this.db.decks.add(deck);
    });
  }

  createCard(card: Card): Promise<number> {
    // TODO: Check deck's existence.
    return this.db.transaction('rw', this.db.cards, async () => {
      return await this.db.cards.add(card);
    });
  }

  createReview(review: Review): Promise<number> {
    // TODO: Check card's existence.
    return this.db.transaction('rw', this.db.reviews, async () => {
      return await this.db.reviews.add(review);
    });
  }

  readDeck(deckId: number): Promise<Deck | undefined> {
    return this.db.transaction('r', this.db.decks, async () => {
      return await this.db.decks.get(deckId);
    });
  }

  readCard(cardId: number): Promise<Card | undefined> {
    return this.db.transaction('r', this.db.cards, async () => {
      return await this.db.cards.get(cardId);
    });
  }

  readCardReviews(cardId: number): Promise<Review[]> {
    return this.db.transaction('r', this.db.reviews, async () => {
      // FIXME: Using 'where' throws:
      //  DataError: Failed to execute 'getAll' on 'IDBIndex': The parameter is not a valid key.
      // return await this.db.reviews.where({ cardId: cardId }).toArray();
      return await this.db.reviews.filter((review) => review.cardId === cardId).toArray();
    });
  }

  updateDeck(deck: Deck): void {
    this.db.transaction('rw', this.db.decks, async () => {
      // TODO: Check existence.
      await this.db.decks.put(deck);
    });
  }

  updateCard(card: Card): void {
    this.db.transaction('rw', this.db.cards, async () => {
      // TODO: Check existence.
      await this.db.cards.put(card);
    });
  }

  deleteDeck(deckId: number): void {
    this.db.transaction('rw', this.db.decks, this.db.cards, this.db.reviews, async () => {
      const cardIds = await this.db.cards.filter((card) => card.deckId === deckId).primaryKeys();
      await this.db.reviews.filter((review) => cardIds.includes(review.cardId)).delete();
      await this.db.cards.bulkDelete(cardIds);
      await this.db.decks.delete(deckId);
    });
  }

  deleteCard(cardId: number): void {
    this.db.transaction('rw', this.db.cards, this.db.reviews, async () => {
      await this.db.reviews.filter((review) => review.cardId === cardId).delete();
      await this.db.cards.delete(cardId);
    });
  }

  searchDecks(searchKey: string, limit = 10, offset = 0): Promise<Deck[]> {
    return this.db.transaction('r', this.db.decks, async () => {
      const searckKeyLowerCase = searchKey.toLocaleLowerCase();
      return await this.db.decks.filter(
        (deck) => deck.description.toLocaleLowerCase().includes(searckKeyLowerCase)
          || deck.notes.toLocaleLowerCase().includes(searckKeyLowerCase)
      ).offset(offset).limit(limit).toArray();
    });
  }

  searchCards(deckId: number, searchKey: string, limit = 10, offset = 0): Promise<Card[]> {
    return this.db.transaction('r', this.db.cards, async () => {
      const searckKeyLowerCase = searchKey.toLocaleLowerCase();
      return await this.db.cards.filter(
        (card) => card.deckId === deckId && (
          card.sideA.toLocaleLowerCase().includes(searckKeyLowerCase)
          || card.sideB.toLocaleLowerCase().includes(searckKeyLowerCase)
          || card.notes.toLocaleLowerCase().includes(searckKeyLowerCase)
          || card.tags.toLocaleLowerCase().includes(searckKeyLowerCase)
      )).offset(offset).limit(limit).toArray();
    });
  }

  searchNextCardToReview(deckId: number): Promise<CardToReview | undefined> {
    return this.db.transaction('r', this.db.cards, async () => {
      const date = new Date();
      const cards = await this.db.cards.filter(
        (card) => card.deckId === deckId &&
          card.sideA.length > 0 &&
          card.sideB.length > 0 && (
          card.nextAB === undefined || card.nextAB <= date
          || card.nextBA === undefined || card.nextBA <= date
      )).toArray();

      if (cards.length === 0) {
        return undefined;
      }
      if (cards.length === 1) {
        return this.fromCardToCardToReview(cards[0]);
      }

      const cardsByNextAB = cards.sort((cardA: Card, cardB: Card) => {
        return this.cardNextDateComparer(cardA, cardB, 'nextAB');
      });
      const cardsByNextBA = cards.sort((cardA: Card, cardB: Card) => {
        return this.cardNextDateComparer(cardA, cardB, 'nextBA');
      });
      const nextCard = [cardsByNextAB[0], cardsByNextBA[0]].sort((cardA: Card, cardB: Card) => {
        return this.cardNextDateComparer(cardA, cardB, 'nextAB', true);
      })[0];
      return this.fromCardToCardToReview(nextCard);
    });
  }

  private cardNextDateComparer(
    cardA: Card,
    cardB: Card,
    property: 'nextAB' | 'nextBA',
    crossComparison = false): number {
    const propertyA = property;
    const propertyB = crossComparison ?
      (property === 'nextAB' ? 'nextBA' : 'nextAB') :
      (property);
    const nextA: Date | undefined = cardA[propertyA];
    if (nextA === undefined) {
      return -1;
    }
    const nextB: Date | undefined = cardB[propertyB];
    if (nextB === undefined) {
      return 1;
    }
    if (nextA <= nextB) {
      return -1;
    } else {
      return 1;
    }
  }

  private fromCardToCardToReview(card: Card): CardToReview {
    const isAB = this.cardNextDateComparer(card, card, 'nextAB', true) <= 0;
    const cardToReview: CardToReview = {
      cardId: card.cardId,
      sideA: isAB ? card.sideA : card.sideB,
      sideB: isAB ? card.sideB : card.sideA,
      notes: card.notes,
      isBA: !isAB,
      lastDate: isAB ? card.lastAB : card.lastBA
    };
    return cardToReview;
  }

  review(cardToReview: CardToReview, value: ReviewValues, date: Date, next: Date): void {
    this.db.transaction('rw', this.db.cards, this.db.reviews, async () => {
      const card = await this.readCard(cardToReview.cardId);
      if (!card) {
        throw new Error(`Card not found: ${cardToReview.cardId}.`);
      }

      if (cardToReview.isBA) {
        card.lastBA = date;
        card.nextBA = next;
      } else {
        card.lastAB = date;
        card.nextAB = next;
      }
      this.updateCard(card);

      const newReview: Review = {
        cardId: cardToReview.cardId,
        isBA: cardToReview.isBA,
        date: date,
        value: value
      } as Review;
      this.createReview(newReview);
    });
  }

  resetDb(): void {
    this.db.transaction('rw', this.db.decks, this.db.cards, this.db.reviews, async () => {
      await this.db.reviews.clear();
      await this.db.cards.clear();
      await this.db.decks.clear();
    });
  }
}
