import fs from 'fs';

// Design Tokens
const designTokens = fs.readFileSync(
  './shared/types/designTokenTypes.ts',
  { encoding: 'utf8' },
);

const designSystemTokens = fs.readFileSync(
  './shared/types/designSystemTypes.ts',
  { encoding: 'utf8' },
);

// write them both to a typscript file
fs.writeFileSync(
  './shared/types/typeExports.ts',
`export const designTokenTypes = \`${designTokens}\`;

export const designSystemTypes = \`${designSystemTokens}\`;
`
);

console.log('Created typings file.');
