const hre = require("hardhat");

let account, attacker;

const wrapAddress = process.env.CONTRACT1_ADDRESS;

async function main() {
	const provider = hre.ethers.provider;
	[account] = await hre.ethers.getSigners();

	const wrapFactory = await hre.ethers.getContractFactory("Wrap");

	wrap = wrapFactory.attach(wrapAddress);

	const amount = hre.ethers.parseEther("1");
	console.log("Buying with 1 ETH...");
	const tx = await wrap.connect(account).buy({ value: amount });
	const balance = await wrap.connect(account).getBalance();
	console.log(
		"Balance is now:  " + hre.ethers.formatUnits(balance, 18) + " wrapped ETH"
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
