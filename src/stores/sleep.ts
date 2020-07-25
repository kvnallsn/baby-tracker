//! sleep store

export interface Event {
  /** Date and time the diaper change / event took place */
  datetime: Date,

  /** What time the baby woke up */
  wokeup?: Date,

  /** Any optional notes */
  notes: String;
}

/** Schema we will valiate against */
export function validate(e: Event): Event {
  let errors: string[] = [];

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return e;
}
