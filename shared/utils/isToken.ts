import {
  DSysLevel
} from '../types/designSystemTypes';

export default function isToken(thing: any) {
  if (
    thing &&
    thing.$extensions &&
    thing.$extensions['dsys.level'] === DSysLevel.token
  ) {
    return true;
  }
  return false;
}