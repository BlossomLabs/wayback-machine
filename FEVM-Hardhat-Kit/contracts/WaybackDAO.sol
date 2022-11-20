// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MementoToken.sol";
import "./VestigeNFT.sol";

contract WaybackDAO {
    MementoToken public token;

    event Donation(bytes32 _hash, uint256 _amount);

    constructor() {
        token = new MementoToken();
    }

    function donate(bytes32 _hash) public payable {
        emit Donation(_hash, msg.value);
    }

    function redeem(uint256 _amount) public {
        uint256 redemptionAmount = _amount * address(this).balance / token.totalSupply();
        payable(msg.sender).transfer(redemptionAmount);
        token.burn(msg.sender, _amount);
    }
}