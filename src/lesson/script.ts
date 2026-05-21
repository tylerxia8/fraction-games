export type AdvanceTrigger =
  | 'continue'
  | 'equivalence'
  | 'smash'
  | 'choice';

export type ScriptChoice = {
  id: string;
  label: string;
  correct?: boolean;
};

export type ScriptStep = {
  id: string;
  message: string;
  advanceOn: AdvanceTrigger;
  choices?: ScriptChoice[];
  onCorrect?: string;
  onIncorrect?: string;
  showSmash?: boolean;
};
