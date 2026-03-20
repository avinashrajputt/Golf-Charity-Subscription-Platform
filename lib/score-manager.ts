/**
 * Score Management - Handles golf score logic
 * Maintains rolling 5-score window
 */

import { GolfScore } from '@/types';

export class ScoreManager {
  /**
   * Get user's last 5 scores in reverse chronological order (most recent first)
   */
  static getLatestScores(scores: GolfScore[]): GolfScore[] {
    return scores
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  /**
   * Add new score and maintain rolling 5-score window
   */
  static addScore(scores: GolfScore[], newScore: GolfScore): GolfScore[] {
    const updated = [newScore, ...scores];
    return this.getLatestScores(updated);
  }

  /**
   * Validate score is within Stableford format (1-45)
   */
  static isValidScore(score: number): boolean {
    return score >= 1 && score <= 45 && Number.isInteger(score);
  }

  /**
   * Calculate average of last 5 scores
   */
  static calculateAverage(scores: GolfScore[]): number {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((acc, score) => acc + score.score, 0);
    return Math.round((sum / scores.length) * 100) / 100;
  }

  /**
   * Get score statistics
   */
  static getStatistics(scores: GolfScore[]) {
    if (scores.length === 0) {
      return {
        count: 0,
        average: 0,
        highest: null,
        lowest: null,
      };
    }

    const scoreValues = scores.map((s) => s.score);
    return {
      count: scores.length,
      average: this.calculateAverage(scores),
      highest: Math.max(...scoreValues),
      lowest: Math.min(...scoreValues),
    };
  }
}
