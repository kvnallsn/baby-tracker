// svelte stores
import { writable } from "svelte/store";

export enum DiaperCondition {
  Wet = "wet",
  Dry = "dry",
  Bowel = "bowel",
}

interface DiaperEvent {
  datetime: Date,
  condition: DiaperCondition;
}

interface State {
  diapers: DiaperEvent[];
}

function createState() {
  const { subscribe, set, update } = writable({
   diapers: []
  } as State);

  return {
    subscribe,
    addDiaperEvent: (e: DiaperEvent) => update(s => {
      s.diapers.push(e);
      return s;
    })
  }
}

export const state = createState();
