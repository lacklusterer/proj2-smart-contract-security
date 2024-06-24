const hre = require("hardhat");

let account, attacker;

const auctionAddress = process.env.VICTIM_ADDRESS;
const attackerAddress = process.env.ATTACKER_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[deployer, bidder1, bidder2] = await hre.ethers.getSigners();

	const auctionFactory = await hre.ethers.getContractFactory("Auction");

	auction = auctionFactory.attach(auctionAddress);

	const [highestBidder, highestBid] = await auction.getHighestBid();
	console.log("Highest bidder: " + highestBidder);
	console.log("Highest bid: " + highestBid);
	console.log(
		"deployer's balance: ",
		hre.ethers.formatEther(await provider.getBalance(deployer)),
		"ETH"
	);
	console.log(
		"bidder1's balance: ",
		hre.ethers.formatEther(await provider.getBalance(bidder1)),
		"ETH"
	);
	console.log(
		"bidder2's balance: ",
		hre.ethers.formatEther(await provider.getBalance(bidder2)),
		"ETH"
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
