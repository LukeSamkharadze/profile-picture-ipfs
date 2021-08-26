const IPFS = require('ipfs-http-client');

export default ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
