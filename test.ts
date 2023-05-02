import * as tester from 'acme-dns-01-test';
import { Challenge } from './index';

const deps = {
  token: 'uEio0Hl3rCn0EzmYQPWixjEu',
};

const challenger = Challenge.create(deps);

tester
  .testZone('dns-01', 'emmakirbydesign.co.uk', challenger)
  .then(() => console.log('PASS'));
