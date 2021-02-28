import { Planner } from './planner';
import { ReviewValues } from './review.values';

describe('Planner', () => {
  function addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * Planner.MILLS_IN_A_DAY);
  }

  it ('should plan', () => {
    const d1 = new Date();

    let result = Planner.planNext(ReviewValues.VALUE_1, d1);
    expect(result.daysNext).toEqual(1);
    expect(result.nextDate).toEqual(addDays(d1, 1));

    result = Planner.planNext(ReviewValues.VALUE_4, d1);
    expect(result.daysNext).toEqual(12);
    expect(result.nextDate).toEqual(addDays(d1, 12));

    result = Planner.planNext(ReviewValues.VALUE_2, d1, addDays(d1, -122));
    expect(result.daysNext).toEqual(137);
    expect(result.nextDate).toEqual(addDays(d1, 137));

    result = Planner.planNext(ReviewValues.VALUE_0, d1);
    expect(result.daysNext).toEqual(0);
    expect(result.nextDate).toEqual(d1);
  });

  it ('should throw an error', () => {
    const d1 = new Date();

    let d2 = addDays(d1, - (Planner.PASSED_DAYS_MIN - 1));
    expect(() => Planner.planNext(ReviewValues.VALUE_1, d1, d2)).toThrow();

    d2 = addDays(d1, (Planner.PASSED_DAYS_MAX + 1));
    expect(() => Planner.planNext(ReviewValues.VALUE_1, d1, d2)).toThrow();
  });
});
