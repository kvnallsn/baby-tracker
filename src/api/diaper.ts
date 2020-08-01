//! diaper store

/** The condition a diaper may be in */
export enum Condition {
  /** Clean diaper */
  Dry = "Dry",

  /** Pee only */
  Wet = "Wet",

  /** Poop ahead! */
  Bowel = "Bowel",
}

/** Leakage represents if the diaper leaked or did not */
export enum Leakage {
  /** All organic solids and fluids contained! */
  None = "None",

  /** All organic solids and fluids contained */
  Some = "Some",

  /** ...too much poop! */
  Blowout = "Blowout",
}

export interface ApiDiaperEvent {
  /** Date and time the diaper change / event took place */
  at: string;

  /** Condition the diaper is in (see `Condition`) */
  condition: Condition;

  /** Brand of the diaper (e.g., huggies, pampers, etc. */
  brand: string;

  /** Size of the diaper */
  size: number;

  /** Whether or not the diaper leaked (or worse...blew out) */
  leakage: Leakage;

  /** Any optional notes */
  notes?: string;
}

export class DiaperEvent {
  /** Date and time the diaper change / event took place */
  datetime: Date;

  /** Condition the diaper is in (see `Condition`) */
  condition: Condition;

  /** Brand of the diaper (e.g., huggies, pampers, etc. */
  brand: string;

  /** Size of the diaper */
  size: number;

  /** Whether or not the diaper leaked (or worse...blew out) */
  leakage: Leakage;

  /** Any optional notes */
  notes?: string;

  constructor(datetime: string, condition: Condition, brand: string, size: number, leakage: Leakage, notes?: string) {
    this.datetime = new Date(datetime);
    this.condition = condition;
    this.brand = brand;
    this.size = size;
    this.leakage = leakage;
    this.notes = notes;
  }

  static fromApi(event: ApiDiaperEvent): DiaperEvent {
    return new DiaperEvent(event.at, event.condition, event.brand, event.size, event.leakage, event.notes);
  }
}

/*
export function validate(e: Event): Event {
  let errors: string[] = [];

  if (!e.condition) {
    errors.push("Diaper condition must be defined");
  }

  if (e.size < 0 || e.size > 7) {
    errors.push("Diaper size must be between 0 and 7");
  }

  if (!e.leakage) {
    errors.push("Diaper leakage must be defined");
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return e;
}
*/
