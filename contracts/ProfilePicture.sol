// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ProfilePicture is ERC721 {
  address public owner;

  string[] public images;

  mapping(string => bool) public imageExists;

  constructor() ERC721("Profile Picture", "PP") {
    owner = msg.sender;
  }

  function mint(string calldata _hash) external {
    require(!imageExists[_hash]);

    images.push(_hash);
    uint _id = images.length - 1;
    _mint(msg.sender, _id);
    imageExists[_hash] = true;
  }
}
