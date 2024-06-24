const hre = require("hardhat");

let victim, attacker;

const victimAddress = process.env.VICTIM_ADDRESS;
const attackerAddress = process.env.ATTACKER_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;

	const victimFactory = await hre.ethers.getContractFactory("Victim");
	const attackerFactory = await hre.ethers.getContractFactory("Attacker");

	victim = victimFactory.attach(victimAddress);
	attacker = attackerFactory.attach(attackerAddress);

	// console.log("Vittim address: " + (await victim.getAddress()));
	console.log(
		"Victim contract balance: ",
		hre.ethers.formatEther(await provider.getBalance(victim)),
		"ETH"
	);
	// console.log("Attacker address: " + (await attacker.getAddress()));
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
