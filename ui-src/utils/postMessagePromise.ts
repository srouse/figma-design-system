import {
  MessageName,
  MessageRequest
} from "../../shared/types/types";

const messagePromiseCallbacks: {[key:string]:(msg:any) => void} = {};
let promiseBounceId = 0;
export default async function postMessagePromise(
  request: MessageRequest,
  args = {},
) {
  if (!parent?.postMessage) return;
  return new Promise((resolve) => {
    const promiseId = `promise_${promiseBounceId++}`;
    messagePromiseCallbacks[promiseId] = (msg) => resolve(msg);
    setTimeout(() => {
      parent.postMessage({pluginMessage: {
        name: MessageName.promiseBounce,
        request,
        promiseId,
        ...args
      }}, "*");
    }, 0);
  });
}

window.onmessage = (evt: any) => {
  const msg = evt.data.pluginMessage;
  if (messagePromiseCallbacks[msg.promiseId]) {
    messagePromiseCallbacks[msg.promiseId](msg);
    delete messagePromiseCallbacks[msg.promiseId];
  }
}
