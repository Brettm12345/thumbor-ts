# Thumbor TS

TypeScript client for building Thumbor URLs.

## Usage

```typescript
import Thumbor from 'thumbor-ts';

// Your encryption key is not required, but your link will be unsafe.
const thumbor = new Thumbor('http://myserver.thumbor.com', 'MY_KEY');

// Generate your url
const thumborUrl = thumbor
    .setImagePath('00223lsvrnzeaf42.png')
    .resize(50, 50)
    .smartCrop(true)
    .buildUrl();
```