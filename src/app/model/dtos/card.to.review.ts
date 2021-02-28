export interface CardToReview {
    cardId: number;
    sideA: string;
    sideB: string;
    notes: string;

    isBA: boolean;

    lastDate?: Date;
}
