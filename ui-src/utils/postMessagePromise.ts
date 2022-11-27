import {
  MessageName,
  MessageRequest
} from "../../shared/types/types";

const messagePromiseCallbacks: {[key:string]:(msg:any) => void} = {};
let promiseBounceId = 0;
export default async function postMessagePromise(
  request: MessageRequest,
  args: any = {},
) {
  if (!parent?.postMessage) return;
  if (args['name'] !== undefined) {
    console.error('Can not send "name" to messagePromise');
    return;
  }

  return new Promise((resolve) => {
    const promiseId = `promise_${promiseBounceId++}`;
    messagePromiseCallbacks[promiseId] = (msg) => resolve(msg);
    // con sole.log('postMessagePromise',promiseId, Object.keys(messagePromiseCallbacks))
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

onmessage = (evt: any) => {
  const msg = evt.data.pluginMessage;
  if (msg && messagePromiseCallbacks[msg.promiseId]) {
    // con sole.log('RECIEVE MSG BOUNCE BACK (SUCCESS)', msg);
    messagePromiseCallbacks[msg.promiseId](msg);
    delete messagePromiseCallbacks[msg.promiseId];
  }else{
    // con sole.log('RECIEVE MSG BOUNCE BACK (FAIL)', msg);
  }
}
