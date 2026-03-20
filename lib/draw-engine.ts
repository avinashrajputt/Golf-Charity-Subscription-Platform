/**
 * Draw Engine - Handles monthly draw calculations
 * Supports both random and algorithmic (weighted) draw types
 */

import { Draw, DrawWinner, GolfScore } from '@/types';

export class DrawEngine {
  /**
   * Random draw - standard lottery-style
   */
  static generateRandomDraw(count: number = 5): number[] {
    const numbers: Set<number> = new Set();
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
  }

  /**
   * Algorithmic draw - weighted by most/least frequent user scores
   */
  static generateAlgorithmicDraw(userScores: GolfScore[][], count: number = 5): number[] {
    const scoreFrequency: Record<number, number> = {};

    // Count frequency of each score
    userScores.forEach((scores) => {
      scores.forEach((score) => {
        scoreFrequency[score.score] = (scoreFrequency[score.score] || 0) + 1;
      });
    });

    // Sort by frequency (desc) and select top scores
    const sortedScores = Object.entries(scoreFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map((entry) => parseInt(entry[0]));

    // Pad with random numbers if needed
    const randomNumbers = this.generateRandomDraw(count);
    const combined = [...new Set([...sortedScores, ...randomNumbers])].slice(0, count);

    return combined.sort((a, b) => a - b);
  }

  /**
   * Calculate matching numbers between user scores and draw numbers
   */
  static calculateMatches(userScores: number[], drawnNumbers: number[]): number {
    return userScores.filter((score) => drawnNumbers.includes(score)).length;
  }

  /**
   * Determine match type and prize eligibility
   */
  static getMatchType(matchCount: number): '5-match' | '4-match' | '3-match' | null {
    if (matchCount === 5) return '5-match';
    if (matchCount === 4) return '4-match';
    if (matchCount === 3) return '3-match';
    return null;
  }

  /**
   * Calculate prize pool distribution
   */
  static calculatePrizeDistribution(
    totalSubscribers: number,
    monthlyFee: number
  ): {
    '5-match': number;
    '4-match': number;
    '3-match': number;
  } {
    const prizePool = totalSubscribers * monthlyFee * 0.3; // 30% to prizes

    return {
      '5-match': prizePool * 0.4,
      '4-match': prizePool * 0.35,
      '3-match': prizePool * 0.25,
    };
  }

  /**
   * Split prize among multiple winners
   */
  static calculatePrizePerWinner(totalPrize: number, winnersCount: number): number {
    return winnersCount > 0 ? totalPrize / winnersCount : 0;
  }
}
