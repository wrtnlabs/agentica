import { getConnectors, getConnectorsList } from './getConnectors';

describe('getConnectorsList', () => {
  it('should return a list of connectors', async () => {
    const connectors = await getConnectorsList();
    expect(connectors).toEqual({
      connectors: [
        '@wrtnio/connector-google-map',
      ],
      version: '1.0.0',
    });
  });
})

describe('getConnectors', () => {
  it('should return a list of connectors', async () => {
    const connectors = await getConnectors();
    expect(connectors).toEqual([
      { name: '@WRTNIO/CONNECTOR GOOGLE-MAP', value: '@wrtnio/connector-google-map' }
    ]);
  });
})

