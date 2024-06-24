const hre = require("hardhat");

let victimAcc, attackerAcc, victim, attacker;

async function main() {
	const provider = hre.ethers.provider;
	[victimAcc, attackerAcc] = await hre.ethers.getSigners();

	victim = await deployContract("Victim", victimAcc);
	attacker = await deployContract("Attacker", attackerAcc);
	console.log(
		"Victim contract balance: ",
		hre.ethers.formatEther(await provider.getBalance(victim)),
		"ETH"
	);
	console.log(
		"Attacker contract balance: ",
		hre.ethers.formatEther(await provider.getBalance(attacker)),
		"ETH"
	);
}

async function deployContract(contractName, deployer) {
	const Contract = await hre.ethers.getContractFactory(contractName, deployer);
	console.log(`Deploying ${contractName} contract...`);
	const contract = await Contract.deploy();
	await contract.waitForDeployment();
	console.log(`${contractName} deployed to: ` + (await contract.getAddress()));
	return contract;
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
