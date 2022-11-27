import { FREE_ICONS } from "../../../utils/addFontAwesomeKit";


export type FontAwesomeKit = {
  licenseSelected: 'free' | 'pro',
  name: string,
  status: 'published' | string,
  token: string,
  version: string,
}

export default async function findFontAwesomeKit(
  fontAwesomeApiKey: string | undefined,
  fontAwesomeKit: string | undefined,
  updateFontAwesomeKit: (fontAwesomeKit: string) => void
) : Promise<FontAwesomeKit | undefined> {
  if (fontAwesomeApiKey) {
    const authKey = await findAuthKey(fontAwesomeApiKey);
    const kit = await findKitId(authKey, fontAwesomeKit);
    if (kit) {
      await updateFontAwesomeKit(kit.token);
    }
    return kit;
  }
  await updateFontAwesomeKit(FREE_ICONS);
  return {
    licenseSelected: 'free',
    name: 'Figma Design System Free Icons',
    status: 'published',
    token: FREE_ICONS,
    version: '6.x',
  };
}

export async function findAuthKey(
  fontAwesomeApiKey: string
) : Promise<string | undefined> {
  return fetch(
    'https://api.fontawesome.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${fontAwesomeApiKey}`
      },
    }).then(r => r.json())
      .then(result => {
        return result.access_token;
      })
      .catch(err => console.error(err));
}

async function findKitId(
  authKey: string | undefined,
  fontAwesomeKit: string | undefined,
) : Promise<FontAwesomeKit | undefined> {
  if (authKey && fontAwesomeKit) {
    const kits = await findKits(authKey);
    const kit = kits.find((kit: FontAwesomeKit) => {
      return kit.token === fontAwesomeKit;
    })
    return kit;
  }
  return undefined;
}

export async function findKits(
  authKey: string | undefined,
) : Promise<FontAwesomeKit[] | []> {
  if (authKey) {
    const kits = await fetch(
      'https://api.fontawesome.com',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authKey}`
        },
        body: JSON.stringify({query: `
          {
            me {
              kits {
                name
                token
                licenseSelected
                status
                version
              }
            }
          }
        `
      })
    })
      .then(r => r.json())
      .then(result => {
        const kits = (
          result &&
          result.data && 
          result.data.me &&
          result.data.me.kits
        ) ? result.data.me.kits : [];
        return kits;
      })
      .catch(err => console.error(err));

    return kits as FontAwesomeKit[] | [];
  }
  return [];
}