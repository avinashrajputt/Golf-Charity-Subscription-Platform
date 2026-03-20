/**
 * Charity Logic - Handles charity contributions and calculations
 */

import { User } from '@/types';

export class CharityLogic {
  static readonly MIN_CONTRIBUTION_PERCENT = 10;
  static readonly DEFAULT_CONTRIBUTION_PERCENT = 10;

  /**
   * Validate charity contribution percentage
   */
  static isValidContributionPercent(percent: number): boolean {
    return percent >= this.MIN_CONTRIBUTION_PERCENT && percent <= 100;
  }

  /**
   * Calculate charity contribution from subscription fee
   */
  static calculateCharityAmount(subscriptionFee: number, contributionPercent: number): number {
    if (!this.isValidContributionPercent(contributionPercent)) {
      contributionPercent = this.MIN_CONTRIBUTION_PERCENT;
    }
    return (subscriptionFee * contributionPercent) / 100;
  }

  /**
   * Calculate total monthly charity contributions
   */
  static calculateTotalMonthlyContribution(
    activeSubscribers: number,
    monthlyFee: number,
    avgCharityPercent: number
  ): number {
    return activeSubscribers * this.calculateCharityAmount(monthlyFee, avgCharityPercent);
  }

  /**
   * Distribute charity amount among multiple charities (future feature)
   */
  static splitCharityAmount(
    totalAmount: number,
    charityCount: number
  ): Record<string, number> {
    const amountPerCharity = totalAmount / charityCount;
    return {
      amount: amountPerCharity,
      count: charityCount,
    };
  }
}
