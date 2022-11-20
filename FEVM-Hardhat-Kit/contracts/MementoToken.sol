// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MementoToken is ERC20, Ownable {

    constructor() ERC20("Memento", "MTO") {
    }

    function faucet() external {
        _mint(msg.sender, 100e18);
    }
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}