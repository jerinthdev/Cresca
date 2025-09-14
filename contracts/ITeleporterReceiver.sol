// SPDX-License-Identifier: MIT
// Minimal interface for Teleporter message reception.
pragma solidity ^0.8.18;

interface ITeleporterReceiver {
    function receiveTeleporterMessage(
        bytes32 originBlockchainID,
        address originSenderAddress,
        bytes calldata message
    ) external;
}