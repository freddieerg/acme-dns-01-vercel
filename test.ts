import * as tester from 'acme-dns-01-test';

if (!process.env.VERCEL_TOKEN) {
  console.error('Vercel token has not been provided');
  process.exit(1);
}

if (!process.env.DOMAIN) {
  console.error('Test domain has not been provided');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const challenger = require('./index').create({
  token: process.env.VERCEL_TOKEN,
});

const domain = process.env.DOMAIN;

tester.testZone('dns-01', domain, challenger).then(() => console.log('PASS'));
