# [acme-dns-01-vercel](https://github.com/freddieerg/acme-dns-01-vercel/blob/master/index.ts)

Vercel DNS + Let's Encrypt for Node.js

This handles ACME dns-01 challenges, compatible with ACME.js and Greenlock.js.
Passes [acme-dns-01-test](https://git.rootprojects.org/root/acme-dns-01-test.js).

# Install

```bash
npm install --save acme-dns-01-vercel
```

Generate Vercel API Token:

- <https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token>

# Usage

First you create an instance with your credentials:

```js
var dns01 = require('acme-dns-01-digitalocean').create({
	token: 'xxxx'
});
```

Then you can use it with any compatible ACME library,
such as Greenlock.js or ACME.js.

### Greenlock.js

```js
var Greenlock = require('greenlock-express');
var greenlock = Greenlock.create({
	challenges: {
		'dns-01': dns01
		// ...
	}
});
```

See [Greenlock Express](https://git.rootprojects.org/root/greenlock-express.js)
and/or [Greenlock.js](https://git.rootprojects.org/root/greenlock.js)
documentation for more details.

### ACME.js

```js
// TODO
```

See the [ACME.js](https://git.rootprojects.org/root/acme-v2.js) for more details.

### Build your own

There are only 5 methods:

- `init(config)`
- `zones(opts)`
- `set(opts)`
- `get(opts)`
- `remove(opts)`

```js
dns01
	.set({
		identifier: { value: 'foo.example.co.uk' },
		wildcard: false,
		dnsZone: 'example.co.uk',
		dnsPrefix: '_acme-challenge.foo',
		dnsAuthorization: 'xxx_secret_xxx'
	})
	.then(function() {
		console.log('TXT record set');
	})
	.catch(function() {
		console.log('Failed to set TXT record');
	});
```

See [acme-dns-01-test](https://git.rootprojects.org/root/acme-dns-01-test.js)
for more implementation details.

# Tests

You will need to add environment variables:

VERCEL_TOKEN<br />
DOMAIN

```bash
npm test
```

# Authors

- Freddie Ergatoudis

See AUTHORS for contact info.

<!-- {{ if .Legal }} -->

# Legal

MIT License |
[Terms of Use](https://therootcompany.com/legal/#terms) |
[Privacy Policy](https://therootcompany.com/legal/#privacy)

Copyright 2023

<!-- {{ end }} -->
