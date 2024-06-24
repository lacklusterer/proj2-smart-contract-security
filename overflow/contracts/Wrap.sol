pragma solidity ^0.7.6;

contract Wrap {
	mapping(address => uint256) public balance;

	function buy() external payable {
		balance[msg.sender] += msg.value;
	}

	function sell(uint256 amount) external {
		balance[msg.sender] -= amount;
		require(balance[msg.sender] >= amount, "Not enough balance");
		payable(msg.sender).call{value: amount}("");
	}

	function getBalance() external view returns (uint256) {
		return balance[msg.sender];
	}
}
