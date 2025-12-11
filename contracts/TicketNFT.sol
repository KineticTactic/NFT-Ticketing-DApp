// contracts/TicketNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721Enumerable, Ownable {
    uint256 public nextId = 1;

    constructor() ERC721("FinopolyTicket", "FNT") Ownable(msg.sender) {}

    function mintTicket(address to) external returns (uint256) {
        uint256 tokenId = nextId;
        _safeMint(to, tokenId);
        nextId++;
        return tokenId;
    }

    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner);
        uint256[] memory ids = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            ids[i] = tokenOfOwnerByIndex(owner, i);
        }

        return ids;
    }

}
