# Figma Design Tokens Widget
<!-- 
  Do not edit directly, built using contentful-readme-generator.
  Content details in Build Information below.
-->

- [Description](#description)
- [How To Use](#how-to-use)
  * [`yarn start`](#yarn-start)
  * [`yarn build`](#yarn-build)
  * [`yarn test`](#yarn-test)
- [Organization](#organization)
- [How To Deploy](#how-to-deploy)
- [Build Information](#build-information)

---


__Project Abbreviation__: scu-figma-design-tokens-widget

__URL Slug__: readme-project/figma-design-tokens-widget

__Developer Emails__: scott.rouse@summitcreditunion.com

__Repo URL__: https://bitbucket.org/summitcu/figma-design-system

__Design File__: https://www.figma.com/file/6wQ9i846LX5us14gANKrH4/Figma-Design-System?node-id=0%3A1

__Services Utilized__: 

- Figma, https://www.figma.com/

## Description

Figma Design Tokens Widget is a Figma Widget that takes values created and managed in Figma and creates compliant Design Tokens. 

[w3 Design Tokens Community](https://www.w3.org/community/design-tokens/)
[Design Tokens Home](https://www.designtokens.org/)
[Design Tokens Proposed Tokens Format](https://second-editors-draft.tr.designtokens.org/format/)

## How To Use

### `yarn start`

This is the only command you need to run in development. It will start the following processes for you:

- bundling (both widget and iframe code)
- typechecking (both widget and iframe code)
- vite dev server (for iframe development)

### `yarn build`

This runs bundling with minification turned on. You should run this command before releasing your widget.

### `yarn test`

This runs typechecking and makes sure that your widget builds without errors.

## Organization

This widget uses:

- [esbuild](https://esbuild.github.io/) for bundling
- [vite](https://vitejs.dev/) and [react](https://reactjs.org/) for the iframe
- [typescript](https://www.typescriptlang.org/) for typechecking

| file/folder   | description                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| manifest.json | The widget's [manifest.json](https://www.figma.com/widget-docs/widget-manifest/) |
| shared        | Contains code shared by both widget and iframe code                              |
| widget-src/   | Contains the widget code                                                         |
| ui-src/       | Contains the iframe code                                                         |

## How To Deploy

Deployed via Figma Widgets.

## Build Information

*Dynamically built using contentful-readme-generator. Do not edit directly.*

*__updated__: 9/19/2022, 1:59:24 PM*

*__built__: 2/4/2023, 12:44:38 PM*

*__space__: 7gg213tt004u*

*__environment__: sandbox*

*__entity id__: 1sLAcBpHGHrYx0LlBVYd3m*

[Edit Contentful Entry](https://app.contentful.com/spaces/7gg213tt004u/environments/sandbox/entries/1sLAcBpHGHrYx0LlBVYd3m)