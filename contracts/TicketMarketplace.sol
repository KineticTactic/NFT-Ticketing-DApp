// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./TicketNFT.sol";

contract TicketMarketplace {
    TicketNFT public ticket;
    address public owner;

    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    constructor(address ticketAddress) {
        ticket = TicketNFT(ticketAddress);
        owner = msg.sender;
    }

    function listTicket(uint256 tokenId, uint256 price) external {
        require(ticket.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Price must be > 0");

        ticket.transferFrom(msg.sender, address(this), tokenId);

        listings[tokenId] = Listing(msg.sender, price, true);
    }

    function buyTicket(uint256 tokenId) external payable {
        Listing memory listed = listings[tokenId];
        require(listed.active, "Not listed");
        require(msg.value == listed.price, "Incorrect amount");

        (bool success, ) = payable(listed.seller).call{value: msg.value}("");
        require(success, "Transfer failed");
        ticket.transferFrom(address(this), msg.sender, tokenId);

        listings[tokenId].active = false;
    }
}
