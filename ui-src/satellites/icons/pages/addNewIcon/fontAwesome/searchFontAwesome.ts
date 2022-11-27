import { FontAwesomeKit } from "./findFontAwesomeKit";

const searchCache: {[key:string]:any} = {};

export default async function searchFontAwesome(
  searchTerm: string,
  kit: FontAwesomeKit | undefined
) {
  if (searchTerm === '' || !kit) return;
    const cacheId = `${searchTerm}-${kit.licenseSelected}`;
    if (!searchCache[cacheId]) {
      const result = await fetch(
        'https://api.fontawesome.com',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({query: `
            {
              search(
                version: "${kit.version}",
                query: "${searchTerm}",
                first: 30
              ) {
                id
                familyStylesByLicense {
                  ${kit.licenseSelected} {
                    family
                    style
                  }
                }
              } 
            }
          `
      })
      })
        .then(r => r.json())
        .then(result => {
          searchCache[cacheId] = result.data.search;
          return result.data.search;
        });
      return result;
    }
    return searchCache[cacheId];
}