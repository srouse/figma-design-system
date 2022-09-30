import { MessageRequest } from "../../shared/types/types";

export default function bounceBack(
  message: {promiseId: string, request: MessageRequest},
  args: {}
) {
  figma.ui.postMessage({
    request: message.request,
    promiseId: message.promiseId,
    ...args,
  });
}