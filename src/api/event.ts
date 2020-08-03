//! event store

/** Various event types supported */
export enum EventType {
  /** A diaper change event */
  Diaper = "diaper",

  /** A nursing event */
  Nursing = "nursing",

  /** A sleep event */
  Sleep = "sleep",
}

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
  Blowout = "Blowout"
}

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

export interface IEvent {
  /** Unique identifer of this event */
  id: string;

  /** Unique identifer of baby */
  baby_id: string;

  /** Date and time the diaper change / event took place */
  at: string;

  /** Event specifics */
  event: {
   type: EventType;

   detail: {
      /** Condition the diaper is in (see `Condition`) */
      condition: Condition;

      /** Brand of the diaper (e.g., huggies, pampers, etc. */
      brand: string;

      /** Size of the diaper */
      size: number;

      /** Whether or not the diaper leaked (or worse...blew out) */
      leakage: Leakage;
    } | {
      source: Source;

      detail: Side;
    } | {
      woke_up: string;
    }
  };
}

export class Event {
  /** Unique identifer of this event */
  id: string;

  /** Unique identifer of baby */
  baby_id: string;

  /** Date and time the diaper change / event took place */
  at: Date;

  /** Event specifics */
  event: {
   type: EventType;

   detail:  DiaperDetail | NursingDetail | SleepDetail;
  };

  /** Any optional notes */
  notes?: string;

  constructor(id: string, baby_id: string, at: string, detail: DiaperDetail | NursingDetail | SleepDetail, notes?: string) {
    this.id = id;
    this.baby_id = baby_id;
    this.at = new Date(at);

    if (detail instanceof DiaperDetail) {
      this.event.type = EventType.Diaper;
    } else if (detail instanceof NursingDetail) {
      this.event.type = EventType.Nursing;
    } else if (detail instanceof SleepDetail) {
      this.event.type = EventType.Sleep;
    }

    this.event.detail = detail;
    this.notes = notes;
  }
}

export class DiaperDetail {
  /** Condition the diaper is in (see `Condition`) */
  condition: Condition;

  /** Brand of the diaper (e.g., huggies, pampers, etc. */
  brand: string;

  /** Size of the diaper */
  size: number;

  /** Whether or not the diaper leaked (or worse...blew out) */
  leakage: Leakage;

  constructor(condition: Condition, brand: string, size: number, leakage: Leakage) {
    this.condition = condition;
    this.brand = brand;
    this.size = size;
    this.leakage = leakage;
  }
}

export class NursingDetail {
  source: Source;

  detail: Side;

  constructor(source: Source, detail: Side) {
    this.source = source;
    this.detail = detail;
  }
}

export class SleepDetail {
  woke_up: Date;

  constructor(woke_up: string) {
    this.woke_up = new Date(woke_up);
  }
}

export default {
  EventType,
  Condition,
  Leakage,
  Source,
  Side,
  Event,
}
