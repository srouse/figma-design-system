import * as mixpanel from "mixpanel-figma";
import { Config } from "mixpanel-figma";
import { Dict } from "mixpanel-figma";
import { version } from "../../shared";

const DO_TRACK = true;

export function init(
  token: string,
  config?: Partial<Config>,
  name?: string
) {
  if (!DO_TRACK) return;
  mixpanel.init(
    token,
    config,
    name
  );
}

export function track(
  event_name: string,
  properties?: Dict,
  callback?: () => void
) {
  if (!DO_TRACK) return;
  mixpanel.track(
    event_name,
    {
      ...properties,
      version
    },
    callback
  );
}

export function identify(
  unique_id?: string,
) {
  if (!DO_TRACK) return;
  mixpanel.identify(
    unique_id
  );
}