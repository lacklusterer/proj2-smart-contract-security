const hre = require("hardhat");

let account, auction, attacker;

async function main() {
	const provider = hre.ethers.provider;
	[account] = await hre.ethers.getSigners();

	auction = await deployContract("Auction", account);
	attacker = await deployContract("Attacker", account);
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
