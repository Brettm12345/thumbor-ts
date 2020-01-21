# Thumbor TS

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
