import { ethers, network } from "hardhat";
import { NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION, developmentChains, VOTING_DELAY, proposalsFile } from "../helper-hardhat-config";
import { moveBlocks } from '../utils/move-blocks'
import fs = require('fs')

export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);
  console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
  console.log(`Proposal description: ${PROPOSAL_DESCRIPTION}`);
  
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  )

  if(developmentChains.includes(network.name)) {
    moveBlocks(VOTING_DELAY + 1);
  }

  const proposeReceipt = await proposeTx.wait(1);

  const proposalId = proposeReceipt.events[0].args.proposalId;
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION).then(() => process.exit()).catch((error) => {
  console.log(error);
  process.exit(1);
}
);

