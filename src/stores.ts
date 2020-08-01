// svelte stores
import { tick } from "svelte";
import { writable } from "svelte/store";
//import * as Diaper from "./stores/diaper";
//import * as Nursing from "./stores/nursing";
//import * as Sleep from "./stores/sleep";

import * as api from "./api";

interface StateEvents {
  refreshing: boolean;
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
     refreshing: false,
     diapers: [],
     nursing: [],
     sleep: [],
   }
  } as State);

  return {
    subscribe,

    handleMessage: (msg: any) => {
      console.log(msg);
    },

    refreshEvents: async (baby: string) => {
      update(s => {
        s.events.refreshing = true;
        return s;
      });

      await tick();

      const events = await api.getEvents({
        "baby": baby,
      });

      update(s => {
        s.events.refreshing = false;
        s.events.diapers = events.diapers;
        s.events.nursing = events.nursing;
        s.events.sleep = events.sleep;
        return s;
      });
    },

    createEvent: async (payload: any) => {
      const event = await api.createEvent(payload);
      console.log(event);
    },

    /*
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
    */

    now: () => update(s => {
      s.date = new Date(Date.now());
      return s;
    }),
  }
}

export const state = createState();
