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

interface History {
  refreshing: boolean;
  error?: string;
  loadingMore: boolean;
  hasMore: boolean;
  data: api.Event[];
}

interface Latest {
  refreshing: boolean;
  error?: string;
  diaper?: api.Event;
  nursing?: api.Event;
  sleep?: api.Event;
}

interface State {
  babyId?: string;
  locale: string;
  history: History;
  latest: Latest;
}

function createState() {
  const { subscribe, set, update } = writable({
   babyId: "dceae182-1561-4486-9f6a-fe7fa8dae491",
   locale: "en-US",
   history: {
     refreshing: false,
     error: undefined,
     loadingMore: false,
     hasMore: true,
     data: [],
   },
   latest: {
    refreshing: false,
    error: undefined,
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
        s.history.refreshing = true;
        return s;
      });

      await tick();

      try {
        const events = await api.getEvents({
          "baby": baby,
        });

        update(s => {
          s.history.refreshing = false;
          s.history.error = undefined;
          s.history.hasMore = events.length == 10;
          s.history.data = events;
          return s;
        });
      } catch (e) {
        update(s => {
          s.history.refreshing = false;
          s.history.error = "Failed to load events";
          s.history.hasMore = false;
          return s;
        });
      }
    },

    loadMoreEvents: async (baby: string, page: number) => {
      update(s => {
        s.history.loadingMore = true;
        return s;
      });

      const events = await api.getEvents({
        "baby": baby,
        "offset": page * 10,
      });

      update(s => {
        s.history.loadingMore = false;
        s.history.hasMore = events.length == 10;
        s.history.data.push(...events);
        return s;
      });
    },

    createEvent: async (payload: any) => {
      const event = await api.createEvent(payload);
      update(s => {
        if (s.history.data.length == 0) {
          // the array is empty, always add
          s.history.data.push(event);
        } else if (event.at >= s.history.data[s.history.data.length - 1].at) {
          // if this event is at least as new as the bottom of our list, then
          // add it to our data.  Otherwise wait until the user scrolls to it
          // before adding to our data.
          const idx = binarySearch(s.history.data, event);
          s.history.data.splice(idx, 0, event);
        }

        // if this event is more recent than the latest event, update
        // that structure accordingly
        switch (event.event.type) {
          case 'diaper': {
            if (s.latest.diaper === undefined || s.latest.diaper.at < event.at) {
              s.latest.diaper = event;
            }
            break;
          }

          case 'nursing': {
            if (s.latest.nursing === undefined || s.latest.nursing.at < event.at) {
              s.latest.nursing = event;
            }
            break;
          }

          case 'sleep': {
            if (s.latest.sleep === undefined || s.latest.sleep.at < event.at) {
              s.latest.sleep = event;
            }
            break;
          }

          default:
            break;    // do nothing
        }

        return s;
      });
    },

    refreshLatest: async (baby: string) => {
      update(s => {
        s.latest.refreshing = true;
        return s;
      });

      //await tick();

      try {
        const latest = await api.getLatestEvents(baby);

        update(s => {
          s.latest.refreshing = false;
          s.latest.error = undefined;
          s.latest.diaper = latest.diaper;
          s.latest.nursing = latest.nursing;
          s.latest.sleep = latest.sleep;
          return s;
        });
      } catch (e) {
        update(s => {
          s.latest.refreshing = false;
          s.latest.error = "Failed to latest events";
          return s;
        });
      }
    },

    updateEvent: async (payload: any) => {
      await api.updateEvent(payload);
    }
  }
}

export const state = createState();

export const date = writable(new Date());
