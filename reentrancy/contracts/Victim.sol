pragma solidity ^0.8.0;

contract Victim {
	mapping(address => uint) balance;

	function deposit() public payable {
		require(msg.value >= 1 ether, "cannot deposit below 1 ether");
		balance[msg.sender] += msg.value;
	}

	function withdrawal() public {
		require(balance[msg.sender] >= 1 ether, "must have at least one ether");
		uint bal = balance[msg.sender];
		(bool success, ) = msg.sender.call{value: bal}("");
		require(success, "transaction failed");
		balance[msg.sender] -= 0;
	}

	function totalBalance() public view returns (uint) {
		return address(this).balance;
	}
}
