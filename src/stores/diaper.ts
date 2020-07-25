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
  No = "No",

  /** All organic solids and fluids contained */
  Yes = "Yes",

  /** ...too much poop! */
  Blowout = "Blowout",
}

export interface Event {
  /** Date and time the diaper change / event took place */
  datetime: Date,

  /** Condition the diaper is in (see `Condition`) */
  condition: Condition;

  /** Brand of the diaper (e.g., huggies, pampers, etc. */
  brand: String;

  /** Size of the diaper */
  size: Number;

  /** Whether or not the diaper leaked (or worse...blew out) */
  leakage: Leakage;

  /** Any optional notes */
  notes: String;
}
