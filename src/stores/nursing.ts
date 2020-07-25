//! nursing store

/** Where the baby was feed from */
export enum Source {
  /** Feed from breast */
  Breast = "Breast",

  /** Bottle-fed */
  Bottle = "Bottle"
}

/** If breast, what side was used */
export enum Side {
  /** Started on left side */
  Left = "Left",

  /** Started on right side */
  Right = "Right",

  /** Hungry little fella! */
  Both = "Both",

  /** If bottle and formula was used */
  Formula = "Formula",

  /** If bottle and pumped was used */
  Pumped = "Pumped",
}


export interface Event {
  /** Date and time the diaper change / event took place */
  datetime: Date,

  /** How the baby was fed */
  source: Source;

  /** If breast, what side */
  side: Side;

  /** Any optional notes */
  notes: String;
}

/** Schema we will valiate against */
export function validate(e: Event): Event {
  let errors: string[] = [];

  if (e.source === undefined || e.source === null) {
    errors.push("Source must be defined");
  }

  if (e.side === undefined || e.side === null) {
    errors.push(`${e.source === Source.Bottle ? "Contents" : "Side"} must be defined`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return e;
}
