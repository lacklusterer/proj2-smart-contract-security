const hre = require("hardhat");

let account, victim;

const victimAddress = process.env.VICTIM_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[account] = await hre.ethers.getSigners();

	const victimFactory = await hre.ethers.getContractFactory("Victim");

	victim = victimFactory.attach(victimAddress);

	const depositAmount = "100";
	const depositValue = hre.ethers.parseEther(depositAmount);
	console.log(`Depositing ${depositAmount} ETH to Victim contract...`);
	await victim.deposit({ value: depositValue });
	console.log("Done");
	console.log(
		"Victim contract balance: ",
		hre.ethers.formatEther(await provider.getBalance(victim)),
		"ETH"
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
