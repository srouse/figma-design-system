import { parseSemVer } from 'semver-parser';
import { VersionIncrements } from './types';


export default function semvar(
  version : string | undefined,
  increment: VersionIncrements = VersionIncrements.patch
) {
  if (!version) {
    return '0.0.1';
  }
  const r = parseSemVer(version);
  let finalMajor = r.major;
  let finalMinor = r.minor;
  let finalPatch = r.patch;
  switch (increment) {
    case VersionIncrements.major:
      finalMajor = finalMajor+1;
      finalMinor = 0;
      finalPatch = 0;
      break;
    case VersionIncrements.minor:
      finalMinor = finalMinor+1;
      finalPatch = 0;
      break;
    case VersionIncrements.patch:
      finalPatch = finalPatch+1;
      break;
  }

  return `${finalMajor}.${finalMinor}.${finalPatch}${
    r.pre ? `-${r.pre.join('.')}` : ''}${
    r.build ? `+${r.build.join('.')}` : ''}`;
}