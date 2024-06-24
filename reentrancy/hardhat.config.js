require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");
require("dotenv").config();

const local_accounts = ["LOCAL_PK_0", "LOCAL_PK_1"].map(
	(key) => process.env[key]
);

module.exports = {
	solidity: {
		compilers: [
			{ version: "0.8.0" },
			{ version: "0.6.8" },
			{ version: "0.5.0" },
		],
	},
	networks: {
		localhost: {
			url: "http://127.0.0.1:8545",
			local_accounts,
		},
	},
};
