// svelte stores
import { writable } from "svelte/store";
import * as Diaper from "./stores/diaper";
import * as Nursing from "./stores/nursing";
import * as Sleep from "./stores/sleep";

import * as api from "./api";

interface StateEvents {
  diapers: api.DiaperEvent[];
  nursing: api.NursingEvent[];
  sleep: api.SleepEvent[];
}

interface State {
  date: Date;
  events: StateEvents;
}

function createState() {
  const { subscribe, set, update } = writable({
   date: new Date(Date.now()),
   events: {
     diapers: [],
     nursing: [],
     sleep: [],
   }
  } as State);

  return {
    subscribe,

    refreshEvents: async (baby: string) => {
      const events = await api.getEvents({
        "baby": baby,
      });

      update(s => {
        s.events.diapers = events.diapers;
        s.events.nursing = events.nursing;
        s.events.sleep = events.sleep;
        return s;
      });
    },

    addDiaperEvent: (e: Diaper.Event) => update(s => {
      //s.events.diapers.push(e);
      return s;
    }),

    addNursingEvent: (e: Nursing.Event) => update(s => {
      //s.events.nursing.push(e);
      return s;
    }),

    addSleepEvent: (e: Sleep.Event) => update(s => {
      //s.events.sleep.push(e);
      return s;
    }),

    now: () => update(s => {
      s.date = new Date(Date.now());
      return s;
    }),
  }
}

export const state = createState();
