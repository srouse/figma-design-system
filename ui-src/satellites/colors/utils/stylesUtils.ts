import {
  DSysTokenset,
  MessageRequest,
} from '../../../../shared';
import postMessagePromise from '../../../utils/postMessagePromise';


export async function stylesToDSysTokenset(folderName: string) {
  // const group: DSysTokenset;

  const results = await postMessagePromise(
    MessageRequest.getColorStyles
  );

  console.log(results);
}