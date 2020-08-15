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
  Dry = "dry",

  /** Pee only */
  Wet = "wet",

  /** Poop ahead! */
  Bowel = "bowel",
}

/** Leakage represents if the diaper leaked or did not */
export enum Leakage {
  /** All organic solids and fluids contained! */
  None = "none",

  /** All organic solids and fluids contained */
  Some = "some",

  /** ...too much poop! */
  Blowout = "blowout"
}

/** Where the baby was feed from */
export enum Source {
  /** Feed from breast */
  Breast = "breast",

  /** Bottle-fed */
  Bottle = "bottle"
}

/** If breast, what side was used */
export enum SourceDetail {
  /** Started on left side */
  Left = "left",

  /** Started on right side */
  Right = "right",

  /** Hungry little fella! */
  Both = "both",

  /** If bottle and formula was used */
  Formula = "formula",

  /** If bottle and pumped was used */
  Pumped = "pumped",
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

  constructor(id: string, baby_id: string, at: Date, detail: DiaperDetail | NursingDetail | SleepDetail, notes?: string) {
    this.id = id;
    this.baby_id = baby_id;
    this.at = at;
    this.notes = notes;

    if (detail instanceof DiaperDetail) {
      this.event = {
        type: EventType.Diaper,
        detail: detail,
      };
    } else if (detail instanceof NursingDetail) {
      this.event = {
        type: EventType.Nursing,
        detail: detail,
      };
    } else if (detail instanceof SleepDetail) {
      this.event = {
        type: EventType.Sleep,
        detail: detail,
      };
    }
  }

  static fromJSON(event: Event): Event {
    if (event.event.type === EventType.Diaper) {
      const detail = event.event.detail as DiaperDetail;
      return new Event(
        event.id,
        event.baby_id,
        event.at,
        new DiaperDetail(
          detail.condition,
          detail.leakage,
          detail.brand,
          detail.size
        ),
        event.notes
      );
    } else if (event.event.type === EventType.Nursing) {
      const detail = event.event.detail as NursingDetail;
      return new Event(
        event.id,
        event.baby_id,
        event.at,
        new NursingDetail(
          detail.source,
          detail.detail
        ),
        event.notes
      );
    } else if (event.event.type === EventType.Sleep) {
      const detail = event.event.detail as SleepDetail;
      return new Event(
        event.id,
        event.baby_id,
        event.at,
        new SleepDetail(
          detail.woke_up,
        ),
        event.notes
      );
    }
  }
}

export class DiaperDetail {
  /** Condition the diaper is in (see `Condition`) */
  condition: Condition;

  /** Whether or not the diaper leaked (or worse...blew out) */
  leakage: Leakage;

  /** Brand of the diaper (e.g., huggies, pampers, etc. */
  brand: string;

  /** Size of the diaper */
  size: number;

  constructor(condition: Condition, leakage: Leakage, brand: string, size: number) {
    this.condition = condition;
    this.leakage = leakage;
    this.brand = brand;
    this.size = size;
  }

  get_condition(): string {
    switch (this.condition) {
      case Condition.Dry:
        return "Dry";
 
      case Condition.Wet:
        return "Wet";

      case Condition.Bowel:
        return "Bowel Movement";

      default:
      return "Unknown Diaper Condition";
    }
  }

  get_leakage(): string {
    switch (this.leakage) {
      case Leakage.None:
        return "No Leakage";

      case Leakage.Some:
        return "Some Leakage";

      case Leakage.Blowout:
        return "Blowout";

      default:
        return "";
    }
  }
}

export class NursingDetail {
  source: Source;

  detail: SourceDetail;;

  constructor(source: Source, detail: SourceDetail) {
    this.source = source;
    this.detail = detail;
  }

  get_source(): string {
    switch (this.source) {
      case Source.Bottle:
        return "Bottle Fed";

      case Source.Breast:
        return "Breast Fed";

      default:
        return "";
    }
  }

  get_detail(): string {
    switch (this.detail) {
      case SourceDetail.Left:
        return "Left Breast";

      case SourceDetail.Right:
        return "Right Breast";

      case SourceDetail.Both:
        return "Both Breasts";

      case SourceDetail.Formula:
        return "Formula";

      case SourceDetail.Pumped:
        return "Pumped";

      default:
        return "";
    }
  }
}

export class SleepDetail {
  woke_up: Date;

  constructor(woke_up: Date) {
    this.woke_up = woke_up;
  }
}

export default {
  DiaperDetail,
  SleepDetail,
  NursingDetail,
  EventType,
  Condition,
  Leakage,
  Source,
  SourceDetail,
  Event,
}
