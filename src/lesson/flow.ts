/** Lesson phases: explore → instruct → check */
export type LessonPhase = 'explore' | 'instruct' | 'check' | 'complete';

export type LessonState = {
  phase: LessonPhase;
  stepId: string;
};

export const initialLessonState: LessonState = {
  phase: 'explore',
  stepId: 'start',
};

/** Advance phase when explore / instruct / check milestones are met. */
export function advancePhase(state: LessonState): LessonState {
  const order: LessonPhase[] = ['explore', 'instruct', 'check', 'complete'];
  const idx = order.indexOf(state.phase);
  if (idx < 0 || idx >= order.length - 1) return state;
  return { ...state, phase: order[idx + 1]!, stepId: 'start' };
}
