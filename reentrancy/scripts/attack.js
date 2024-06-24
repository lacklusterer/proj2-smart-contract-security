const hre = require("hardhat");

let victimAcc, attackerAcc, victimContract, attackerContract;

async function main() {
	const provider = hre.ethers.provider;
	[victimAcc, attackerAcc] = await hre.ethers.getSigners();

	victimContract = await deployContract("Victim", victimAcc);
	attackerContract = await deployContract("Attacker", attackerAcc);

	await getInfo(provider);
	await depositToVictim(victimAcc, "100");

	await sendETH(attackerAcc, attackerContract.target, "1");

	const ethAmount = hre.ethers.utils.parseEther("1");

	console.log("Before attack:");
	await getInfo(provider);

	console.log("Begin attack");
	const tx = await attackerContract
		.connect(attackerAcc)
		.attack({ value: ethAmount });
	console.log(tx);

	console.log("After attack:");
	await getInfo(provider);
}

/*-----------------------------*/
/*----------Functions----------*/

async function deployContract(contractName, deployer) {
	const Contract = await hre.ethers.getContractFactory(contractName, deployer);
	console.log(`Deploying ${contractName} contract...`);
	const contract = await Contract.deploy();
	await contract.waitForDeployment();
	console.log(`${contractName} deployed to: ` + (await contract.getAddress()));
	console.log("\n");
	return contract;
}

async function sendETH(fromSigner, toAddr, amount) {
	console.log(
		`Sending ${amount} ETH from ${fromSigner.address} to ${toAddr}...`
	);
	const sendingValue = hre.ethers.parseEther(amount);
	const tx = await fromSigner.sendTransaction({
		to: toAddr,
		value: sendingValue,
	});
	console.log("\n");
}

async function depositToVictim(depositor, amount) {
	console.log(`Depositing ${amount} ETH to Victim contract...`);
	const depositValue = hre.ethers.parseEther(amount);
	await victimContract.connect(depositor).deposit({ value: depositValue });
	console.log("\n");
}

async function getInfo(provider) {
	console.log(
		"Victim balance: ",
		hre.ethers.formatEther(await provider.getBalance(victimAcc)),
		"ETH"
	);
	console.log(
		"Attacker balance: ",
		hre.ethers.formatEther(await provider.getBalance(attackerAcc)),
		"ETH"
	);
	console.log(
		"Victim contract balance: ",
		hre.ethers.formatEther(await provider.getBalance(victimContract)),
		"ETH"
	);
	console.log(
		"Attacker contract balance: ",
		hre.ethers.formatEther(await provider.getBalance(attackerContract)),
		"ETH"
	);
	console.log("\n");
}

/*----------Functions----------*/
/*-----------------------------*/

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
