//! API helper interface

import { Event } from "./api/event";

const URI = "https://diaprs.allisn.net/api";
const DateFormat = /^\d{4}-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}/

function http_parse<T>(text: string): T {
  return JSON.parse(text, (key, value) => {
    if (typeof value === "string" && DateFormat.test(value)) {
      return new Date(value);
    }

    return value;
  });
}

async function http_get<T>(request: RequestInfo): Promise<T> {
  const response = await fetch(request);
  const body = await response.text();
  return http_parse(body);
}

async function http_post<T>(request: RequestInfo, data: any): Promise<T> {
  const response = await fetch(request, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return http_parse(await response.text());
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

/**
 * Fetches all events from the remote server
 */
async function getEvents(params: GetEventsArgs): Promise<Event[]> {
    const url = uri('/events', params);
    const json = await http_get<{ events: Event[] }>(url.toString());

    // parse result into our structures
    return json.events.map(e => Event.fromJSON(e));
}

async function createEvent(payload: any): Promise<any> {
  const url = uri('/events/new');
  const json = await http_post<{ id: string }>(url.toString(), payload);

  return { "id": json.id }
}

export {
  // types
  Event,

  // functions
  getEvents,
  createEvent,
}
