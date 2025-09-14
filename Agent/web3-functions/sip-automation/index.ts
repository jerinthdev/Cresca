// Gelato Web3 Function: aip automation resolver/executor
// Queries ERC20TokenHome.checker()-equivalent and executes exec() when due.
// Customize RPC, contract address, and task config in deployment.

import { ethers } from "ethers";

// Minimal ABI fragments for checker and exec
const HOME_ABI = [
  "function checker() external view returns (bool canExec, bytes execPayload)",
  "function exec(address[] users) external"
];

export async function run() {
  const RPC_URL = process.env.RPC_URL as string;
  const CONTRACT = process.env.CONTRACT as string; // ERC20TokenHome address
  const EXECUTOR_PK = process.env.EXECUTOR_PK as string; // optional if using relay/sponsored

  if (!RPC_URL || !CONTRACT) {
    throw new Error("Missing RPC_URL or CONTRACT env vars");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // If using a funded EOAs executor; for sponsored mode, integrate Gelato Relay SDK instead
  const wallet = EXECUTOR_PK ? new ethers.Wallet(EXECUTOR_PK, provider) : undefined;
  const contract = new ethers.Contract(CONTRACT, HOME_ABI, wallet ?? provider);

  const [canExec, execPayload] = await contract.checker();
  if (!canExec) {
    return { canExec: false, message: "No users due" };
  }

  if (!wallet) {
    // For sponsored mode, return calldata & to for relay infra
    return { canExec: true, callData: execPayload, to: CONTRACT }; 
  }

  const tx = await wallet.sendTransaction({ to: CONTRACT, data: execPayload });
  const receipt = await tx.wait();
  return { canExec: true, txHash: receipt?.hash };
}
