# DEPLOY / DEV CHECKLIST

## DEV
- turn off mixpanel tracking ./ui-src/utils/mixpanel.ts

## DEPLOY
1. turn on mixpanel tracking ./ui-src/utils/mixpanel.ts
2. increment version in widget ./shared/version.ts
3. build
4. check into repo
5. deploy to Figma
6. increment version in website