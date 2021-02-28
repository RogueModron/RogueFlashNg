import { ReviewValues } from '../planner/review.values';

export interface Review {
    cardId: number;
    isBA: boolean;

    reviewId: number;
    value: ReviewValues;
    date: Date;
}
