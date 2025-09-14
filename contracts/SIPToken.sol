// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract aipToken is ERC20 {
    constructor() ERC20("Defi Investment Token", "PORT") {
        // Mint 10 billion tokens to deployer
        _mint(msg.sender, 10000000000 * 10**18);
    }
}