import { parseSemVer } from 'semver-parser';

export default function semvar(
  version : string | undefined,
  increment?: {
    major: number,
    minor: number,
    patch: number,
  }
) {
  if (!version) {
    return '0.0.1';
  }
  const r = parseSemVer(version);
  console.log(r, increment);
  let finalMajor = r.major;
  let finalMinor = r.minor;
  let finalPatch = r.patch;
  if (increment) {
    finalMajor = r.major + increment.major;
    finalMinor = r.minor + increment.minor;
    finalPatch = r.patch + increment.patch;
  }
  return `${finalMajor}.${finalMinor}.${finalPatch}${
    r.pre ? `-${r.pre.join('.')}` : ''}${
    r.build ? `+${r.build.join('.')}` : ''}`;
}