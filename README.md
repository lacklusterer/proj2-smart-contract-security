# SMART CONTRACT SECURITIES

[Report](./pr2rp.docx)

## Setup

1. Change directory for each individual POC folders, then install hardhat
development environment to compile contracts and run them on simulated
environment.

```bash
npm i
```

2. To execute the attack, first start the hardhat local chain simulation

```bash
npx hardhat node
```

3. Then, simply run the attack scripts in numbered order. Supplement scripts to
view more details about the state of the attack is also provided without number.

```bash
npx hardhat run scripts/1-...
npx hardhat run scripts/2-...
npx hardhat run scripts/get-info.js
```

## Attack POCs

[Reentrancy](./reentrancy/) 
[Gas griefing](./gas_grief/READM.md) 
[Overflow](./overflow/) 
[Oracle Manipulation](./oracle/) 
