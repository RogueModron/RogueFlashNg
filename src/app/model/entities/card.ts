export interface Card {
    deckId: number;

    cardId: number;
    sideA: string;
    sideB: string;
    notes: string;
    tags: string;

    noBA: boolean;

    lastAB?: Date;
    nextAB?: Date;

    lastBA?: Date;
    nextBA?: Date;
}
