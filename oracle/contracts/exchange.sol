// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.0;

import "./token.sol";
import "hardhat/console.sol";
import "./exchangehelper.sol";

contract TokenExchange is Ownable, ExchangeHelper {
    string public exchange_name = "KMS EX";
    address tokenAddr = 0x5FbDB2315678afecb367f032d93F642f64180aa3; // WARNING: update after deploying token
    Token public token = Token(tokenAddr);

    // Liquidity pool for the exchange
    uint private token_reserves = 0;
    uint private eth_reserves = 0;

    // Fee Pools
    uint private token_fee_reserves = 0;
    uint private eth_fee_reserves = 0;

    // Liquidity pool shares
    mapping(address => uint) private lps;
    // For Extra Credit only: to loop through the keys of the lps mapping
    address[] private lp_providers;

    // Total Pool Shares
    uint private total_shares = 0;

    // Constant: x * y = k
    uint private k;

    constructor() {}

    // Function createPool: Initializes a liquidity pool between your Token and ETH.
    // ETH will be sent to pool in this transaction as msg.value
    // amountTokens specifies the amount of tokens to transfer from the liquidity provider.
    // Sets up the initial exchange rate for the pool by setting amount of token and amount of ETH.
    function createPool(uint amountTokens) external payable onlyOwner {
        // require pool does not yet exist:
        require(token_reserves == 0, "Token reserves was not 0");
        require(eth_reserves == 0, "ETH reserves was not 0.");

        // require nonzero values were sent
        require(msg.value > 0, "Need eth to create pool.");
        uint tokenSupply = token.balanceOf(msg.sender);
        require(
            amountTokens <= tokenSupply,
            "Not have enough tokens to create the pool"
        );
        require(amountTokens > 0, "Need tokens to create pool.");

        token.transferFrom(msg.sender, address(this), amountTokens);
        token_reserves = token.balanceOf(address(this));
        eth_reserves = msg.value;
        k = token_reserves * eth_reserves;

        // Pool shares set to a large value to minimize round-off errors
        total_shares = 10 ** 5;
        // Pool creator has some low amount of shares to allow autograder to run
        lps[msg.sender] = 100;
    }

    // Function getReserves
    function getReserves() public view returns (uint, uint) {
        return (eth_reserves, token_reserves);
    }

    /* ========================= Liquidity Provider Functions =========================  */

    modifier poolExist() {
        require(eth_reserves > 0, "No liquidity pool");
        require(token_reserves > 0, "No liquidity pool");
        _;
    }

    function ethToToken(
        uint _amountETH
    ) internal view poolExist returns (uint amountToken) {
        amountToken = _amountETH * (token_reserves / eth_reserves);
    }

    // Function addLiquidity: Adds liquidity based on ETH in msg.value
    function addLiquidity() external payable poolExist {
        require(msg.value > 0, "Need to ETH to add liquidity");

        uint tokenAmount = ethToToken(msg.value);
        uint tokenSupply = token.balanceOf(msg.sender);
        require(tokenAmount <= tokenSupply, "Not enough token");

        token_reserves += tokenAmount;
        eth_reserves += msg.value;
        k = eth_reserves * token_reserves;

        token.transferFrom(msg.sender, address(this), tokenAmount);

        uint newShares = (msg.value * total_shares) / eth_reserves;
        lps[msg.sender] = newShares;
        total_shares += newShares;
    }

    // Function removeLiquidity: Removes liquidity given the desired amount of ETH to remove.
    function removeLiquidity(uint amountETH) public payable poolExist {
        uint sharesRemove = (amountETH / eth_reserves) * total_shares;

        require(sharesRemove < total_shares, "You don't own enough shares");
        require(
            sharesRemove <= lps[msg.sender],
            "Removing more ETH than your shares"
        );

        uint amountToken = ethToToken(amountETH);

        require(
            amountToken < token_reserves - 1,
            "Removing too much liquidity"
        );
        require(amountETH < eth_reserves - 1, "Removing too much liquidity");

        eth_reserves -= amountETH;
        token_reserves -= amountToken;
        k = eth_reserves * token_reserves;

        token.transfer(msg.sender, amountToken);
        payable(msg.sender).transfer(amountETH);

        total_shares -= sharesRemove;
        lps[msg.sender] -= sharesRemove;
    }

    // Function removeAllLiquidity: Removes all liquidity that msg.sender is entitled to withdraw
    function removeAllLiquidity() external payable poolExist {
        uint ethAmount = eth_reserves * (lps[msg.sender] / total_shares);
        uint tokenAmount = ethToToken(ethAmount);

        payable(msg.sender).transfer(ethAmount);
        token.transfer(msg.sender, tokenAmount);

        eth_reserves -= ethAmount;
        token_reserves -= tokenAmount;
        k = ethAmount * tokenAmount;

        total_shares -= lps[msg.sender];
        lps[msg.sender] = 0;
    }

    /* ========================= Swap Functions =========================  */

    // Function swapTokensForETH: Swaps your token with ETH
    function swapTokensForETH(
        uint amountTokens,
        uint maxSlippage
    ) external payable poolExist {
        require(amountTokens > 0, "Please swap more than 0 token");
        require(
            amountTokens <= token.balanceOf(msg.sender),
            "Not enough tokens"
        );

        uint amountETH = getAmountOut(
            token_reserves,
            eth_reserves,
            amountTokens
        );

        require(amountETH <= eth_reserves - 1, "Not enough ETH in reserve");

        require(
            checkSlippage(
                token_reserves,
                eth_reserves,
                amountTokens,
                amountETH,
                maxSlippage
            ),
            "Slippage too large"
        );

        token.transferFrom(msg.sender, address(this), amountTokens);
        payable(msg.sender).transfer(amountETH);

        token_reserves += amountTokens;
        eth_reserves -= amountETH;
    }

    // Function swapETHForTokens: Swaps ETH for your tokens
    function swapETHForTokens(uint maxSlippage) external payable poolExist {
        require(msg.value > 0, "Please swap more than 0 ETH");

        uint amountTokens = getAmountOut(
            eth_reserves,
            token_reserves,
            msg.value
        );

        require(
            amountTokens <= token_reserves - 1,
            "Not enough token in rerserve"
        );

        require(
            checkSlippage(
                eth_reserves,
                token_reserves,
                msg.value,
                amountTokens,
                maxSlippage
            ),
            "Slippage too large"
        );

        token.transfer(msg.sender, amountTokens);
        eth_reserves += msg.value;
        token_reserves -= amountTokens;
    }
}
