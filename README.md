# Thumbor TS

<h2 align="center">
  Immutable TypeScript client for building Thumbor URLs.
</h2>

<p align="center">
  <a
    aria-label="Npm Package"
    href="https://www.npmjs.com/package/thumbor-ts"
  >
    <img
      src="https://img.shields.io/npm/v/thumbor-ts/latest?style=flat-square"
    >
  </a>
  <a
    aria-label="CI Status"
    href="https://github.com/Brettm12345/thumbor-ts/actions"
  >
  <img
    src="https://img.shields.io/github/workflow/status/brettm12345/thumbor-ts/CI?style=flat-square"
  >
  <img alt="Npm Bundle Size" src="https://img.shields.io/bundlephobia/minzip/thumbor-ts?style=flat-square">
  <a
    aria-label="Dependencies"
    href="https://github.com/Brettm12345/thumbor-ts/network/dependencies"
  >
    <img
      alt="Number of outdated dependencies"
      src="https://img.shields.io/david/brettm12345/thumbor-ts?style=flat-square"
    >
  </a>
  <a aria-label="code style: prettier" href="https://prettier.io">
    <img
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
    >
  </a>
  <a
    aria-label="Maintainability"
    href="https://codeclimate.com/github/Brettm12345/thumbor-ts/maintainability"
  >
    <img
      src="https://api.codeclimate.com/v1/badges/7cf8bb2f98bbd77fbe60/maintainability"
    >
  </a>
  <a
    aria-label="Test Coverage"
    href="https://codeclimate.com/github/Brettm12345/thumbor-ts/test_coverage"
  >
    <img
      src="https://api.codeclimate.com/v1/badges/7cf8bb2f98bbd77fbe60/test_coverage"
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
