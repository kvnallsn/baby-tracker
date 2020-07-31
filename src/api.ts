//! API helper interface

import { ApiDiaperEvent, DiaperEvent } from "./api/diaper";
import { ApiNursingEvent, NursingEvent } from "./api/nursing";
import { ApiSleepEvent, SleepEvent } from "./api/sleep";

const URI = "https://diaprs.allisn.net/api";

async function http_get<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  const body = await response.json();
  return body;
}
 
function uri(endpoint: string, args?: any): URL {
  const url = new URL(`${URI}${endpoint}`);
  if (args) {
    Object.keys(args).forEach(key => url.searchParams.append(key, args[key]));
  }
  return url;
}


interface GetEventsArgs {
  baby: string;
  type?: string;
  limit?: number;
  offset?: number;
}

interface Events {
  diapers: DiaperEvent[];
  nursing: NursingEvent[];
  sleep: SleepEvent[];
}

/**
 * Fetches all events from the remote server
 */
async function getEvents(params: GetEventsArgs): Promise<Events> {
    const url = uri('/events', params);
    const json = await http_get<{ events: { diapers: ApiDiaperEvent[], nursing: ApiNursingEvent[], sleep: ApiSleepEvent[] }}>(url.toString());

    // parse result into our structures
    let diapers = [];
    for (const [, event] of Object.entries(json.events.diapers)) {
      diapers.push(DiaperEvent.fromApi(event));
    }

    let nursing = [];
    for (const [, event] of Object.entries(json.events.nursing)) {
      nursing.push(NursingEvent.fromApi(event));
    }

    let sleep = [];
    for (const [, event] of Object.entries(json.events.sleep)) {
      nursing.push(SleepEvent.fromApi(event));
    }

    return {
      diapers: diapers,
      nursing: nursing,
      sleep: sleep,
    };
}

export {
  // types
  DiaperEvent,
  NursingEvent,
  SleepEvent,

  // functions
  getEvents,
}
