// svelte stores
import { writable } from "svelte/store";
import * as Diaper from "./stores/diaper";
import * as Nursing from "./stores/nursing";
import * as Sleep from "./stores/sleep";

interface State {
  date: Date;
  diapers: Diaper.Event[];
  nursing: Nursing.Event[];
  sleep: Sleep.Event[];
}

function createState() {
  const { subscribe, set, update } = writable({
   date: new Date(Date.now()),
   diapers: [],
   nursing: [],
   sleep: [],
  } as State);

  return {
    subscribe,
    addDiaperEvent: (e: Diaper.Event) => update(s => {
      s.diapers.push(e);
      return s;
    }),
    addNursingEvent: (e: Nursing.Event) => update(s => {
      s.nursing.push(e);
      return s;
    }),
    addSleepEvent: (e: Sleep.Event) => update(s => {
      s.sleep.push(e);
      return s;
    }),
    now: () => update(s => {
      s.date = new Date(Date.now());
      return s;
    }),
  }
}

export const state = createState();
