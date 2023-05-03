import axios from 'axios';

interface Options {
  token?: string;
}

interface Zones {
  dnsHosts: string[];
}

interface IChallenge {
  type: string;
  identifier: {
    type: string;
    value: string;
  };
  wildcard: boolean;
  dnsHost: string;
  dnsPrefix?: string;
  dnsZone: string;
  dnsAuthorization: string;
}

export class Challenge {
  module = 'acme-dns-01-vercel';
  options: Options;

  constructor(options: Options = {}) {
    this.options = options;
  }

  static create(config) {
    return new Challenge(config);
  }

  async init() {
    return null;
  }

  async zones({ dnsHosts }: Zones) {
    const zones = [];
    let next = 0;

    while (next !== null) {
      const r = await axios.get(`https://api.vercel.com/v5/domains`, {
        headers: {
          Authorization: `Bearer ${this.options.token}`,
        },
        params: {
          next,
        },
      });

      next = r.data.pagination.next;
      zones.push(
        ...r.data.domains
          .filter((it) => it.serviceType === 'zeit.world')
          .map((it) => it.name)
      );
    }

    return zones;
  }

  async set({ challenge }: { challenge: IChallenge }) {
    await axios.post(
      `https://api.vercel.com/v2/domains/${challenge.dnsZone}/records`,
      {
        name: challenge.dnsPrefix,
        type: 'TXT',
        value: challenge.dnsAuthorization,
      },
      {
        headers: {
          Authorization: `Bearer ${this.options.token}`,
        },
      }
    );

    return null;
  }

  async get({ challenge }: { challenge: IChallenge }) {
    let next = 0;

    while (next !== null) {
      const r = await axios.get(
        `https://api.vercel.com/v4/domains/${challenge.dnsZone}/records`,
        {
          headers: {
            Authorization: `Bearer ${this.options.token}`,
          },
          params: {
            next,
          },
        }
      );

      next = r.data.pagination.next;
      const entry = r.data.records.find(
        (it) =>
          it.name === challenge.dnsPrefix &&
          it.value === challenge.dnsAuthorization
      );
      if (entry)
        return {
          dnsAuthorization: entry.value,
        };
    }

    return null;
  }

  async remove({ challenge }: { challenge: IChallenge }) {
    let next = 0;

    while (next !== null) {
      const r = await axios.get(
        `https://api.vercel.com/v4/domains/${challenge.dnsZone}/records`,
        {
          headers: {
            Authorization: `Bearer ${this.options.token}`,
          },
          params: {
            next,
          },
        }
      );

      next = r.data.pagination.next;

      const entry = r.data.records.find(
        (it) =>
          it.name === challenge.dnsPrefix &&
          it.value === challenge.dnsAuthorization
      );
      if (entry) {
        await axios.delete(
          `https://api.vercel.com/v2/domains/${challenge.dnsZone}/records/${entry.id}`,
          {
            headers: {
              Authorization: `Bearer ${this.options.token}`,
            },
          }
        );
      }
    }

    return null;
  }
}
