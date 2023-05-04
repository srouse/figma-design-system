# Figma Design System Widget
<!-- 
  Do not edit directly, built using contentful-readme-generator.
  Content details in Build Information below.
-->

- [Build Information](#build-information)

---


__Name__: Figma Design System Widget

__Project Abbreviation__: FDS

__Figma Widget URL__: https://www.figma.com/community/widget/1219461874726507820

__Production URL__: https://figmadesignsystem.app/

__Content__: 

- Figma Design System Widget, Figma Design System Widget, Figma Design System Widget is an attempt to integrate design system concerns (ADA, color/typography sets) with Figma structures (styles, components) as well as explore how much of a design system build tool can be created entirely within Figma leveraging existing services (Font Awesome, Google Fonts, Github repos/npm packaging).

This widget can build a significantly sized design system token set by dragging the widget on stage, choosing a name and building out the various parts of your system. From there, you can tokenize, transform (css, scss, Javascript, and Typescript), and deploy your design system all the way into a Github hosted NPM Package. It isn't designed to be used for large production designs systems quite yet, but is perfect for small to medium sized projects or for just exploring your first full design system., [object Object]

- Color Set Tokens, Color Set Tokens, - __Color Sets__. Design Systems usually step colors, so this widget will kick off creating values by choosing your step pattern and base color (the color in the center of the steps).
- __Figma Styles__. All colors created within the widget are automatically synchronized with native Figma styles.
- __Editing All Steps__. Editing one color will show all of the other dots for the other steps. The selected color will have the biggest selector, but all other selectors will be editable as well. Build a better color arc of stepped colors.
- __Locking Hue__. During editing of any one color you can lock the hue and change the hue for all colors.
- __ADA feedback__. Design Systems can be built with conventions where each color can work with ADA compliance at specific steps. This widget will surface that information and make it easy to knudge your colors into ADA compliance. 
, [object Object]

- Typography Set Tokens, Typography Set Tokens, - __Typography Sets__. Typography can also be managed as a set. A typography token can be created one by one, but also by choosing a set patter with a base font, weight, and size.
- __Google Fonts__. The tokens created with the widget are transformed into a Google Fonts embed, so each of the previews (the large sentence and the individual thumbnails) are directly from Google Fonts. If they are not available in Google Fonts (and thus not able to be transformed into a simple css file) you will be alerted immediately., [object Object]

- Icon Tokens, Icon Tokens, - __Multiple Sources__. In creating a new icon, you can choose from uploading an svg, selecting an icon on the Figma stage, or downloading from Font Awesome.
- __Font Awesome Integration__. 
- __Automatic Icon Component__. The widget will automatically create a component that has variants in the names of the icons you create. The widget is actually wrapped around that component.
- __Spacing and Offset__. Some icons work better flush to the edges and some do not. The widget will allow you to scale and nudge each specific icon into place., [object Object]

- Font Awesome Integration, Font Awesome Integration, The Font Awesome integration includes using your paid subscription. To use all the available icons in your subscription, you will need to create an api token and a kit that includes these icons. The widget will walk you through attaching that kit via the API token., [object Object]

- Effect Tokens, Effect Tokens, [object Object]

- Breakpoint Tokens, Breakpoint Tokens, [object Object]

- Custom Tokens, Custom Tokens, [object Object]

- Component Tokens, Component Tokens, (Not presently implemented) Component tokens will be created from attaching a component to the Figma Design System widget. They will only create scss transformations since direct css will create relatively unweildy results., [object Object]

- Downloading Code, Downloading Code, Tokens can be transformed instantly and copied to your clipboard with several different outputs:

- Tokens. W3C formatted tokens
- CSS Variables. Tokens transformed into css properties.
- CSS Fonts. Google font css embeds
- Javascript. Tokens transformed into a javascript object.

This is a subset of all the transformations available with the Figma Design System widget. If you would like to use the Typescript or Atomic transformations you will need to use the GitHub Deploy., [object Object]

- Deployment and Github NPM Packages, Deployment - Github NPM Packages, Deployment and Github NPM Packages, [object Object]

- Github Configuration, Github Configuration, The tokens created with the Figma Design System widget can be immediately transformed on deployment and deployed to a Github repo as well as a Github NPM package. This requires a Github account and an access token that has workflow and read:packages permissions (see below)., [object Object]

- Style Guide, Style Guide, A good design system documents in the same motion that it captures values. The Figma Design System is a living document that can be composed and presented as you will with each token set presented clearly in each widget.

<a href="https://assets.ctfassets.net/rtkhko6y3s3u/7xU711XEoyQbXkLtrW7Ayt/bc83c4067ee5ef25de8575a39567f119/Readme_Design_System_-_2023-03-19.pdf" target="_new">View Readme Design System Style Guide PDF</a>
, [object Object]

- Design System Lifecycle, Design System Lifecycle, [object Object]

## Build Information

*Dynamically built using contentful-readme-generator. Do not edit directly.*

*__updated__: 4/22/2023, 4:22:33 PM*

*__built__: 5/4/2023, 2:50:37 PM*

*__space__: rtkhko6y3s3u*

*__environment__: master*

*__entity id__: 2VGzXFpO7HEpkpuLuKgETd*

[Edit Contentful Entry](https://app.contentful.com/spaces/rtkhko6y3s3u/environments/master/entries/2VGzXFpO7HEpkpuLuKgETd)