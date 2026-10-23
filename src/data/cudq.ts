// Reflection questions matching the deck's "Great Caffeine Check-In" survey.
// This is a screening reflection, not a diagnostic tool. Question / option /
// result text lives in src/i18n (s.cudq) so it can be translated.
export const QUESTION_COUNT = 9;
export const OPTION_COUNT = 4;
export const MAX_SCORE = QUESTION_COUNT * OPTION_COUNT;

/** Kept for older imports: an array with one slot per question. */
export const CUDQ_QUESTIONS = Array.from({ length: QUESTION_COUNT }, (_, i) => i);

export type SurveyTierId = 'low' | 'watch' | 'talk';

export function scoreTier(total: number): SurveyTierId {
  if (total <= 13) return 'low';
  if (total <= 22) return 'watch';
  return 'talk';
}
