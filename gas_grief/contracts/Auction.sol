// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.0;

contract Auction {
	address public highestBidder;
	uint public highestBid;
	uint public startTime;
	uint public constant delay = 1 weeks;

	constructor() {
		startTime = block.timestamp;
	}

	function bid() external payable {
		require(msg.value > highestBid, "Your bid is not enough");
		require(block.timestamp <= startTime + delay, "Auction ended");

		if (highestBidder != address(0)) {
			(bool success, ) = highestBidder.call{value: highestBid}("");
			require(success, "Refund failed");
		}

		highestBidder = msg.sender;
		highestBid = msg.value;
	}

	function getHighestBid() external view returns (address, uint) {
		return (highestBidder, highestBid);
	}
}
