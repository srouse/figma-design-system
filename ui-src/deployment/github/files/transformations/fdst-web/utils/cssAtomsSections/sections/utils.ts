import { DSysBreakpointToken } from "../../../../../../../../../shared";

export function breakpointStart(
  breakpoint?: DSysBreakpointToken,
) {
  if (
    breakpoint
  ) {
    let maxWidth: number | undefined;
    let minWidth: number = 0;
    if ( breakpoint.$direction === 'down' ) {
      maxWidth = breakpoint.$value;
    }else if( breakpoint.$direction === 'up' ) {
      minWidth = breakpoint.$value;
    }
    return `\n@media screen ${
      maxWidth ?
        ` and (max-width: ${
          maxWidth
        }px)` : ''
    }${
      minWidth !== 0 ?
        `and (min-width: ${
          minWidth
        }px)` : ``
    } {\n` ;
  }
  return '';
}

export function breakpointEnd(
  breakpoint?: any,
) {
  return breakpoint ? `\n}` : '';
}
