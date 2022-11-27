

export default function cleanName(
  name: string
) {
  let finalName = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  finalName = finalName.replace(/-{2,}/g, '-');
  return finalName;
}