// import 'fake-indexeddb/auto';
import { DbService } from './db.service';
import { CardToReview } from './dtos/card.to.review';
import { Card } from './entities/card';
import { Deck } from './entities/deck';
import { Review } from './entities/review';
import { ReviewValues } from './planner/review.values';


/*
  To test only this file:
    ng test --main 'src/app/model/db.service.spec.ts'

  See:
    https://stackoverflow.com/questions/40683673/how-to-execute-only-one-test-spec-with-angular-cli
*/

describe('DbService', () => {
  const service = new DbService('RogueFlashNgTest');

  beforeEach(() => {
    service.resetDb();
  });

  it ('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should create a deck', async () => {
    const newDeck = {
      description: 'New Deck',
      notes: 'Notes!'
    } as Deck;
    const id = await service.createDeck(newDeck);

    expect(id).toBeGreaterThan(0);
  });

  it ('should create a card', async () => {
    const newCard = {
      deckId: 1,
      sideA: 'Hello World!',
      sideB: 'Ciao Mondo!',
      notes: '',
      noBA: false
    } as Card;
    const id = await service.createCard(newCard);

    expect(id).toBeGreaterThan(0);
  });

  it ('should create a review', async () => {
    const newReview = {
      cardId: 1,
      isBA: false,
      value: 0,
      date: new Date()
    } as Review;
    const id = await service.createReview(newReview);

    expect(id).toBeGreaterThan(0);
  });

  it ('should read a deck', async () => {
    const newDeck = {
      description: 'New Deck',
      notes: 'should read a deck'
    } as Deck;
    const id = await service.createDeck(newDeck);

    const deck = await service.readDeck(id);

    expect(deck).toBeDefined();
    expect(deck?.deckId).toEqual(id);
  });

  it ('should read a card', async () => {
    const newCard = {
      deckId: 1,
      sideA: 'Hello World!',
      sideB: 'Ciao Mondo!',
      notes: 'should read a card',
      noBA: false
    } as Card;
    const id = await service.createCard(newCard);

    const card = await service.readCard(id);

    expect(card).toBeDefined();
    expect(card?.cardId).toEqual(id);
  });

  it ('should read card\'s reviews', async () => {
    const newReview = {
      cardId: 0,
      isBA: false,
      value: 0,
      date: new Date()
    } as Review;
    const id = await service.createReview(newReview);

    const reviews = await service.readCardReviews(0);

    expect(reviews).toBeDefined();
    expect(reviews?.length).toEqual(1);
    expect(reviews?.[0].reviewId).toEqual(id);
  });

  it ('should update a deck', async () => {
    const newDeck = {
      description: 'New Deck',
      notes: 'should update a deck'
    } as Deck;
    const id = await service.createDeck(newDeck);
    let deck = await service.readDeck(id);

    const notes = 'update this!';
    if (deck) {
      deck.notes = notes;
      service.updateDeck(deck);
      deck = await service.readDeck(id);
    }

    expect(deck).toBeDefined();
    expect(deck?.deckId).toEqual(id);
    expect(deck?.notes).toEqual(notes);
  });

  it ('should update a card', async () => {
    const newCard = {
      deckId: 1,
      sideA: 'Hello World!',
      sideB: 'Ciao Mondo!',
      notes: 'should update a card',
      noBA: false
    } as Card;
    const id = await service.createCard(newCard);
    let card = await service.readCard(id);

    const notes = 'update this!';
    if (card) {
      card.notes = notes;
      service.updateCard(card);
      card = await service.readCard(id);
    }

    expect(card).toBeDefined();
    expect(card?.cardId).toEqual(id);
    expect(card?.notes).toEqual(notes);
  });

  it ('should delete a deck', async () => {
    const newDeck = {
      description: 'New Deck',
      notes: 'should delete a deck'
    } as Deck;
    const deckId = await service.createDeck(newDeck);

    const newCard = {
      deckId: deckId,
      sideA: 'Hello World!',
      sideB: 'Ciao Mondo!',
      notes: 'should delete a deck',
      noBA: false
    } as Card;
    const cardId = await service.createCard(newCard);

    const newReview = {
      cardId: cardId,
      isBA: false,
      value: 0,
      date: new Date()
    } as Review;
    const reviewId = await service.createReview(newReview);

    let deck = await service.readDeck(deckId);
    let card = await service.readCard(cardId);
    let reviews = await service.readCardReviews(cardId);

    expect(deck).toBeDefined();
    expect(card).toBeDefined();
    expect(reviews?.length).toEqual(1);

    service.deleteDeck(deckId);
    deck = await service.readDeck(deckId);
    card = await service.readCard(cardId);
    reviews = await service.readCardReviews(cardId);

    expect(deck).toBeUndefined();
    expect(card).toBeUndefined();
    expect(reviews?.length).toEqual(0);
  });

  it ('should delete a card', async () => {
    const newDeck = {
      description: 'New Deck',
      notes: 'should delete a card'
    } as Deck;
    const deckId = await service.createDeck(newDeck);

    const newCard = {
      deckId: deckId,
      sideA: 'Hello World!',
      sideB: 'Ciao Mondo!',
      notes: 'should delete a card',
      noBA: false
    } as Card;
    const cardId = await service.createCard(newCard);

    const newReview = {
      cardId: cardId,
      isBA: false,
      value: 0,
      date: new Date()
    } as Review;
    const reviewId = await service.createReview(newReview);

    let deck = await service.readDeck(deckId);
    let card = await service.readCard(cardId);
    let reviews = await service.readCardReviews(cardId);

    expect(deck).toBeDefined();
    expect(card).toBeDefined();
    expect(reviews?.length).toEqual(1);

    service.deleteCard(cardId);
    deck = await service.readDeck(deckId);
    card = await service.readCard(cardId);
    reviews = await service.readCardReviews(cardId);

    expect(deck).toBeDefined();
    expect(card).toBeUndefined();
    expect(reviews?.length).toEqual(0);
  });

  it ('should search a deck', async () => {
    const newDeck = {
      description: 'New Deck',
      notes: 'should search a deck'
    } as Deck;
    const id = await service.createDeck(newDeck);

    const decks = await service.searchDecks('seARch');

    expect(decks?.length).toEqual(1);
  });

  it ('should search a card', async () => {
    const newCard = {
      deckId: 1,
      sideA: 'Hello World!',
      sideB: 'Ciao Mondo!',
      notes: 'should search a card',
      noBA: false
    } as Card;
    const id = await service.createCard(newCard);

    const cards = await service.searchCards(1, 'seARch');

    expect(cards?.length).toEqual(1);
  });

  it ('should search the next card to review', async () => {
    const newCard01 = {
      deckId: 1,
      sideA: 'A01',
      sideB: 'B01',
      noBA: false
    } as Card;
    await service.createCard(newCard01);

    const newCard02 = {
      deckId: 1,
      sideA: 'A02',
      sideB: 'B02',
      noBA: false
    } as Card;
    await service.createCard(newCard02);

    const card = await service.searchNextCardToReview(1);

    expect(card).toBeDefined();
  });

  it ('should review', async () => {
    const newCard = {
      deckId: 1,
      sideA: 'Side A',
      sideB: 'Side B',
      noBA: false
    } as Card;
    const cardId = await service.createCard(newCard);

    const cardToReview = {
      cardId: cardId,
      isBA: false
    } as CardToReview;
    service.review(cardToReview, ReviewValues.VALUE_0, new Date(), new Date());

    const card = await service.readCard(cardId);

    expect(card?.lastAB).toBeDefined();
    expect(card?.nextAB).toBeDefined();

    const reviews = await service.readCardReviews(cardId);

    expect(reviews).toHaveSize(1);
  });
});
