const hre = require("hardhat");

let account, attacker;

const auctionAddress = process.env.VICTIM_ADDRESS;
const attackerAddress = process.env.ATTACKER_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[deployer, bidder1, bidder2] = await hre.ethers.getSigners();

	const auctionFactory = await hre.ethers.getContractFactory("Auction");
	const attackerFactory = await hre.ethers.getContractFactory("Attacker");

	auction = auctionFactory.attach(auctionAddress);
	attacker = attackerFactory.attach(attackerAddress);

	const bidAmount = hre.ethers.parseEther("3");
	console.log("Bidding 3 ETH...");
	const tx = await auction.connect(bidder1).bid({ value: bidAmount });

	const receipt = await tx.wait();
	const gasFee = receipt.gasUsed.mul(tx.gasPrice);

	console.log(`Gas fee: ${ethers.utils.formatEther(gasFee)} ETH`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
