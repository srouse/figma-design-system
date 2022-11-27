
export const FREE_ICONS = '65cfadde64';

export default function addFontAwesomeKit(
  kitId: string = FREE_ICONS,
) {
  // should only have one at a time...
  const otherFAScripts = [...document.querySelectorAll('[data-fa]')];
  otherFAScripts.map((script) => {
    script.remove();
  });
  const script = document.createElement('script');
  script.setAttribute('crossorigin', 'anonymous');
  script.setAttribute('src', `https://kit.fontawesome.com/${kitId}.js`);
  script.setAttribute('data-fa', ``);
  document.getElementsByTagName('head')[0].appendChild(script);
}

/*
<script
  src="https://kit.fontawesome.com/65cfadde64.js"
  crossorigin="anonymous">
</script>
*/