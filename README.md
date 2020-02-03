<h1 align="center">
  Thumbor TS
</h1>

<p align="center" >
  Immutable TypeScript client for building Thumbor URLs.
</p>

<p align="center">
  <a
    aria-label="Yarn Package"
    href="https://yarnpkg.com/package/thumbor-ts"
  >
    <img
      src="https://img.shields.io/npm/v/thumbor-ts/latest?style=flat-square&logo=Yarn&label=thumbor-ts@latest"
    />
  </a>
  <a
    aria-label="Downloads"
    href="https://www.npmjs.com/package/thumbor-ts"
  >
    <img
      src="https://img.shields.io/npm/dm/thumbor-ts?logo=Npm&style=flat-square&label=Downloads"
    >
  </a>
  <img
    alt="Minzipped Size"
    src="https://img.shields.io/bundlephobia/minzip/thumbor-ts?style=flat-square&label=Minzipped+Size&logo=Webpack"
  />
  <a
    aria-label="GitHub Workflow CI Status master"
    href="https://github.com/Brettm12345/thumbor-ts/actions?query=workflow%3ACI"
  >
    <img
      src="https://img.shields.io/github/workflow/status/brettm12345/thumbor-ts/CI/master?label=CI&logo=github&style=flat-square&cacheSeconds=3600"
    />
  </a>
  <a aria-label="code style: prettier" href="https://prettier.io">
    <img
      src="https://img.shields.io/badge/Code_Style-prettier-ff69b4.svg?style=flat-square&logo=prettier"
    />
  </a>
  <a
    aria-label="Maintainability"
    href="https://codeclimate.com/github/Brettm12345/thumbor-ts/maintainability"
  >
    <img
      src="https://img.shields.io/codeclimate/maintainability-percentage/Brettm12345/thumbor-ts?logo=Code%20Climate&style=flat-square&label=Maintainability&cacheSeconds=3600"
    />
  </a>
  <a
    aria-label="Test Coverage"
    href="https://codeclimate.com/github/Brettm12345/thumbor-ts/test_coverage"
  >
    <img
      src="https://img.shields.io/codeclimate/coverage/Brettm12345/thumbor-ts?label=Coverage&logo=Code%20Climate&style=flat-square&cacheSeconds=3600"
    />
  </a>
  <a
    aria-label="Github commit activity"
    href="https://github.com/brettm12345/thumbor-ts/commits"
  >
    <img
      src="https://img.shields.io/github/commit-activity/m/brettm12345/thumbor-ts?label=Commit%20Activity&logo=Github&style=flat-square&cacheSeconds=360"
    />
  </a>
  <a
    aria-label="Pull Requests"
    href="https://github.com/Brettm12345/thumbor-ts/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc"
  >
    <img
      src="https://img.shields.io/badge/contributions-open-success?style=flat-square&logo=Github"
    />
  </a>
</p>

## Installation

- `yarn add thumbor-ts`
- `pnpm i thumbor-ts`
- `npm i --save thumbor-ts`

## Usage

```typescript
import Thumbor from 'thumbor-ts';

// Your encryption key is not required, but your link will be unsafe.
const thumbor = Thumbor({
  serverUrl: 'http://myserver.thumbor.com',
  securityKey: 'MY_KEY'
});

// Generate your url
const thumborUrl = thumbor
  .setImagePath('00223lsvrnzeaf42.png')
  .resize(50, 50)
  .smartCrop()
  .format('webp')
  .buildUrl();
```
