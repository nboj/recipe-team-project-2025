export interface Recipe {
  id: number;
  title: string;
  description: string;
  cook_time: number;
  image: string;
  rating: number;
  steps: Step[];
}

export type Step = {
  step_no: number;
  instruction_text: string;
  est_minutes: number;
}
