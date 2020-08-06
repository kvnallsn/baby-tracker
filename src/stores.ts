// svelte stores
import { tick } from "svelte";
import { writable } from "svelte/store";

import * as api from "./api";

function binarySearch(arr: api.Event[], event: api.Event): number {
  if (arr.length == 0) {
    return 0;
  }

  if (event.at > arr[0].at) {
    return 0;
  }

  if (event.at < arr[arr.length - 1].at) {
    return arr.length;
  }
  
  var m = 0;
  var n = arr.length - 1;
  while (m <= n) {
    var k = Math.floor((n + m) / 2);
    if (event.at < arr[k].at) {
      m = k + 1;
    } else if (event.at > arr[k].at) {
      n = k - 1;
    } else {
      return k;
    }
  }

  return m;
}

interface Events {
  refreshing: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  data: api.Event[];
}

interface Latest {
  refreshing: boolean;
  diaper: api.Event;
  nursing: api.Event;
  sleep: api.Event;
}

interface State {
  events: Events;
  latest: Latest;
}

function createState() {
  const { subscribe, set, update } = writable({
   events: {
     refreshing: false,
     loadingMore: false,
     hasMore: true,
     data: [],
   },
   latest: {
    refreshing: false,
    diaper: undefined,
    nursing: undefined,
    sleep: undefined
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
        s.events.hasMore = events.length == 10;
        s.events.data = events;
        return s;
      });
    },

    loadMoreEvents: async (baby: string, page: number) => {
      update(s => {
        s.events.loadingMore = true;
        return s;
      });

      const events = await api.getEvents({
        "baby": baby,
        "offset": page * 10,
      });

      update(s => {
        s.events.loadingMore = false;
        s.events.hasMore = events.length == 10;
        s.events.data.push(...events);
        return s;
      });
    },

    createEvent: async (payload: any) => {
      const event = await api.createEvent(payload);
      update(s => {
        const idx = binarySearch(s.events.data, event);
        s.events.data.splice(idx, 0, event);
        return s;
      });
    },

    refreshLatest: async (baby: string) => {
      update(s => {
        s.latest.refreshing = true;
        return s;
      });

      //await tick();

      const latest = await api.getLatestEvents(baby);

      update(s => {
        s.latest.refreshing = false;
        s.latest.diaper = latest.diaper;
        s.latest.nursing = latest.nursing;
        s.latest.sleep = latest.sleep;
        return s;
      });
    },
  }
}

export const state = createState();

export const date = writable(new Date());
