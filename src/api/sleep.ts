//! sleep store

export interface ApiSleepEvent {
  /** Date and time the diaper change / event took place */
  at: string;

  /** What time the baby woke up */
  wokeup?: string;

  /** Any optional notes */
  notes?: string;
}

export class SleepEvent {
  /** Date and time the diaper change / event took place */
  datetime: Date;

  /** What time the baby woke up */
  wokeup?: Date;

  /** Any optional notes */
  notes: string;

  constructor(datetime: string, wokeup?: string, notes?: string) {
    this.datetime = new Date(datetime);
    this.wokeup = new Date(wokeup);
    this.notes = notes;
  }

  static fromApi(event: ApiSleepEvent): SleepEvent {
    return new SleepEvent(event.at, event.wokeup, event.notes);
  }
}

/*
export function validate(e: Event): Event {
  console.log(e);
  let errors: string[] = [];

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return e;
}
*/
