# Thumbor TS

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/brettm12345/thumbor-ts/CI?style=flat-square)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/thumbor-ts?style=flat-square)
![David](https://img.shields.io/david/brettm12345/thumbor-ts?style=flat-square)
[![Maintainability](https://api.codeclimate.com/v1/badges/7cf8bb2f98bbd77fbe60/maintainability)](https://codeclimate.com/github/Brettm12345/thumbor-ts/maintainability)

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
const thumbor = Thumbor({ serverUrl: 'http://myserver.thumbor.com', securityKey: 'MY_KEY' });

// Generate your url
const thumborUrl = thumbor
    .setImagePath('00223lsvrnzeaf42.png')
    .resize(50, 50)
    .smartCrop()
    .format('webp')
    .buildUrl();
```
