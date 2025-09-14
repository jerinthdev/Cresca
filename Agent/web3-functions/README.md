# Gelato Web3 Function – aip Automation

This Web3 Function checks `ERC20TokenHome.checker()` and executes `exec()` when deposits are due.

## Configure

Set environment variables for your task or local run:

- RPC_URL – RPC endpoint for the chain hosting `ERC20TokenHome`
- CONTRACT – Address of the deployed `ERC20TokenHome`
- EXECUTOR_PK – Optional private key of a funded executor EOA. Omit when using sponsored mode and Gelato Relay.

## How it works

- `checker()` scans `activeaipUsers` and builds calldata for `exec(address[])` if any user is due.
- The Web3 Function returns `{ canExec, callData, to }` for relay, or sends the transaction directly when `EXECUTOR_PK` is provided.

## Notes

- Gelato Automation has been removed from the contracts. Use Gelato Tasks with this Web3 Function as the resolver.
- Consider setting `gelatoExecutor` and `gelatoRestricted=true` on the contract to restrict who can call `exec`.
