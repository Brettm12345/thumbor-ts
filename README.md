# Thumbor TS

<p align="center">

![npm (tag)](https://img.shields.io/npm/v/thumbor-ts/latest?style=flat-square) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/brettm12345/thumbor-ts/CI?style=flat-square) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/thumbor-ts?style=flat-square) ![David](https://img.shields.io/david/brettm12345/thumbor-ts?style=flat-square) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Maintainability](https://api.codeclimate.com/v1/badges/7cf8bb2f98bbd77fbe60/maintainability)](https://codeclimate.com/github/Brettm12345/thumbor-ts/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/7cf8bb2f98bbd77fbe60/test_coverage)](https://codeclimate.com/github/Brettm12345/thumbor-ts/test_coverage)

</p>

Immutable TypeScript client for building Thumbor URLs.

## Installation

```sh
yarn add thumbor-ts
npm install --save thumbor-ts
```

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
