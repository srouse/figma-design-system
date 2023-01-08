import {
  DSys,
  DSysSheet,
  DSysGroup,
  DSysTokenset,
  DSysToken,
} from "../index";

function loop(obj: {}, callback: (vaue: any) => void ) {
  Object.entries(obj).map(entry => {
    const name = entry[0];
    const value = entry[1];
    if (name.indexOf('$') != 0) {
      callback(value);
    }
  });
}

export default function loopDesignSystemTokens(
  dSys: DSys,
  tokensSheetCallback?: (tokensSheet: DSysSheet) => void,
  tokenGroupCallback?: (tokenGroup: DSysGroup<any, any>) => void,
  tokenSetCallback?: (tokenset: DSysTokenset) => void,
  tokenCallback?: (token: DSysToken) => void,
) {
  loop(dSys,
    (tokensSheet: any) => {
      if (tokensSheetCallback)
        tokensSheetCallback(tokensSheet);
      loop(tokensSheet,
        (tokenGroup: any) => {
          if (tokenGroupCallback)
            tokenGroupCallback(tokenGroup as DSysGroup<any, any>);
          loop(tokenGroup,
            (tokenSet: any) => {
              if (tokenSetCallback)
                tokenSetCallback(tokenSet as DSysTokenset);
              loop(tokenSet,
                (token: any) => {
                  if (tokenCallback)
                    tokenCallback(token as DSysToken);
                }
              );
            }
          );
        }
      );
    }
  );
}