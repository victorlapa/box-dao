A DAO is a decentralized autonomous organization which runs in a blockchain environment.
A DAO has a currency called Governance Token which allows its holders to vote on its DAO's proposals
usually the more tokens the holder has, the more voting power its has over the other holders.

This case is an example that simulates the creation of a proposal, the voting proccess and the execution of a smart contract.

If you want to run this project on your own system, first run
yarn install

then run
yarn hardhat deploy
to run a local blockchain _KEEP ITS TERMINAL OPENED_

then you can run on another terminal

yarn hardhat run scripts/propose.ts --network localhost
to create a proposal to the DAO

yarn hardhat run scripts/vote.ts --network localhost
to vote for the first proposal stored on proposals.json

After voting for the proposal, you can check its status by running
yarn hardhat console --network localhost

and inside the console run
const governor = await ethers.getContract("GovernorContract");
it should return an 'undefined'

then you are allowed to run
await governor.state("20410873684195684007502903743313035195888380351590997192411449750453432545334")
which contains the encoded function data passed on state

if it returns 4, it means that the vote has been passed
other statuses are
0 = Pending / 1 = Active / 2 = Canceled / 3 = Defeated / 4 = Succeeded / 5 = Queued / 6 = Expired / 7 = Executed

then the proposal is allowed to be executed, you can do it by running after leaving the console by clicking ctrl+c twice
yarn hardhat run scripts/queue-and-execute.ts --network localhost
to queue and execute the proposal
