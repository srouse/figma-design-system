

/**
 * PromiseSequence
 * Runs a collection of promises in sequence...
 * await PromiseSequence(
 *   children.map((child) => {
 *     return async () => {
 *       await myAsync();
 *     }
 *   })
 * );
 * @param promises
 * @return 
 */
export default async function PromiseSequence(
  promises: {():Promise<any> }[]
) : Promise<any> {
  return new Promise(async (resolve) => {
    if ( !promises.length ) {
      resolve([]);
      return;
    }
    const results: any[] = [];
    await __PromiseSequence(promises, results);
    resolve(results);
  })
}

async function __PromiseSequence(
  promises: {():Promise<any> }[],
  results: any[]
) : Promise<any>
{
  try {
    const promise = promises.shift();
    if (promise instanceof Function) {
      if ( !promises.length ) {
        return promise().then(result => {
          results.push(result);
        });
      }else{
        await promise().then(async result => {
          results.push(result);
          await __PromiseSequence(promises, results)
        });
      }
    }else{
      console.error('promise not a function...')
      return;
    }
  } catch(err: any) {
    console.error('promise seq error', err);
    return 'error';
  }
}