require("@nomicfoundation/hardhat-toolbox");
require("hardhat-tracer");
require("dotenv").config();

module.exports = {
	solidity: {
		compilers: [{ version: "0.8.0" }, { version: "0.6.8" }],
	},
	networks: {
		localhost: {
			url: "http://127.0.0.1:8545",
		},
	},
};
