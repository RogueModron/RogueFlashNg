import { ReviewValues } from './review.values';
import { PlannerResult } from './planner.result';
import { ReviewValueParameters } from './review.value.parameters';

export class Planner {
  static readonly PASSED_DAYS_MAX = 10000;
  static readonly PASSED_DAYS_MIN = 0;

  static readonly MILLS_IN_A_DAY = 24 * 60 * 60 * 1000;

  private static readonly VALUES = new Map<number, ReviewValueParameters>([
      [ ReviewValues.VALUE_0, new ReviewValueParameters( 0.00, 0.00)],
      [ ReviewValues.VALUE_1, new ReviewValueParameters( 1.00, 1.10)],
      [ ReviewValues.VALUE_2, new ReviewValueParameters( 3.00, 1.10)],
      [ ReviewValues.VALUE_3, new ReviewValueParameters( 7.00, 1.20)],
      [ ReviewValues.VALUE_4, new ReviewValueParameters(12.00, 1.30)]
  ]);

  static planNext(value: ReviewValues, valueDate: Date, previousDate?: Date): PlannerResult {
    let passedDays = 0;
    if (previousDate) {
      const timeDiff = (valueDate.getTime() - previousDate.getTime());
      passedDays = Math.round(timeDiff / Planner.MILLS_IN_A_DAY);
    }

    if (!Planner.checkPassedDaysLimits(passedDays)) {
      throw new Error(`Invalid value for passedDays: ${passedDays}.`);
    }

    const nextDays = Planner.calculateNextDays(value, passedDays);
    const nextDate = new Date(valueDate.getTime() + (nextDays * Planner.MILLS_IN_A_DAY));

    const plannerResult: PlannerResult = {
      nextDate: nextDate,
      daysNext: nextDays,
      passedDays: passedDays
    };
    return plannerResult;
  }

  private static calculateNextDays(value: ReviewValues, passedDays: number): number {
    if (value === ReviewValues.VALUE_0) {
      return 0;
    }

    const reviewValue = Planner.VALUES.get(value);
    if (!reviewValue) {
        throw new Error(`ReviewValueParameters not found for value: ${value}.`);
    }

    const daysNext = Math.floor(passedDays * reviewValue.daysMultiplier + reviewValue.daysBase);
    return Math.round(daysNext);
  }

  private static checkPassedDaysLimits(passedDays: number): boolean {
    return Planner.PASSED_DAYS_MIN <= passedDays && passedDays <= Planner.PASSED_DAYS_MAX;
  }
}
