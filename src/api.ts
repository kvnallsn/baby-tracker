//! API helper interface

import { ApiDiaperEvent, DiaperEvent } from "./api/diaper";
import { ApiNursingEvent, NursingEvent } from "./api/nursing";
import { ApiSleepEvent, SleepEvent } from "./api/sleep";

const URI = "http://10.1.0.101:5050";

interface GetEventsArgs {
  baby: string;
  type?: string;
  limit?: number;
  offset?: number;
}

async function http_get<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  const body = await response.json();
  return body;
}

interface Events {
  diapers: DiaperEvent[];
  nursing: NursingEvent[];
  sleep: SleepEvent[];
}

async function getEvents(params: GetEventsArgs): Promise<Events> {
    const url = new URL(`${URI}/events`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

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
