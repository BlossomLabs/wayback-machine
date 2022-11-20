// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Unipool.sol";
import "./WaybackDAO.sol";

contract VestigeNFT /*is ERC721("Vestige", "VTG")*/ {

    struct Vestige {
        string dealCID;
        uint256 totalReceived;
        address keeper;
        Unipool unipool;
    }

    uint256 public totalSupply = 0;
    mapping(bytes32 => Vestige) public vestiges;
    WaybackDAO public dao;

    constructor(WaybackDAO _dao) {
        dao = _dao;
    }

    function mint(bytes32 _hash, address _to, string calldata _dealCID) public {
        // _safeMint(_to, uint256(_hash));
        Unipool _unipool = new Unipool(dao.token(), dao.token(), 3650 days);
        vestiges[_hash] = Vestige(_dealCID, 0, _to, _unipool);
        totalSupply++;
    }

    function donate(bytes32 _hash) public payable {
        vestiges[_hash].totalReceived += msg.value;
        payable(vestiges[_hash].keeper).transfer(msg.value / 2);
        dao.donate{value:msg.value / 2}(_hash);
    }

    function unipool(bytes32 _hash) public view returns(Unipool) {
        return vestiges[_hash].unipool;
    }
}