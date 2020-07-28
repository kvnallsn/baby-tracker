//! sleep store

export interface Event {
  /** Date and time the diaper change / event took place */
  datetime: Date,

  /** What time the baby woke up */
  wokeup?: Date,

  /** Any optional notes */
  notes: String;
}

export const TEST_DATA: Event[] = [
  {
    datetime: new Date("Sat Jul 25 2020 16:51:11 GMT-0500"),
    wokeup: undefined,
    notes: "",
  },
  {
    datetime: new Date("Sat Jul 25 2020 11:51:11 GMT-0500"),
    wokeup: new Date("Sat Jul 25 2020 12:51:11 GMT-0500"),
    notes: "",
  },
];

/** Schema we will valiate against */
export function validate(e: Event): Event {
  console.log(e);
  let errors: string[] = [];

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return e;
}
