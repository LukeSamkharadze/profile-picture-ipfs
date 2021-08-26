const { create } = require('ipfs-http-client');

const ipfsClient = create('https://ipfs.infura.io:5001/api/v0');

export default ipfsClient;