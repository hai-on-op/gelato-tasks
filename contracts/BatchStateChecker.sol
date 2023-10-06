// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IAccountingEngineLike {
    function auctionDebt() external returns (uint256 _auctionId);

    function auctionSurplus() external returns (uint256 _auctionId);

    function transferExtraSurplus() external;
}

interface IPIDRateSetterLike {
    function updateRate() external;
}

/**
 * @title  BatchStateChecker
 * @notice This contract is used to try to brute call all of the functions that are needed for maintaing the system state updated.
 */
contract BatchStateChecker {
    struct GlobalStatus {
        bool shouldUpdateRate;
        bool shouldAuctionDebt;
        bool shouldAuctionSurplus;
        bool shouldTransferSurplus;
    }

    constructor(
        IAccountingEngineLike _accountingEngine,
        IPIDRateSetterLike _pidRateSetter
    ) {
        GlobalStatus memory _data;

        try _pidRateSetter.updateRate() {
            _data.shouldUpdateRate = true;
        } catch {}

        try _accountingEngine.auctionDebt() {
            _data.shouldAuctionDebt = true;
        } catch {}

        try _accountingEngine.auctionSurplus() {
            _data.shouldAuctionSurplus = true;
        } catch {}

        try _accountingEngine.transferExtraSurplus() {
            _data.shouldTransferSurplus = true;
        } catch {}

        // encode return data
        bytes memory _encodedData = abi.encode(_data);

        // force constructor return via assembly
        assembly {
            let dataStart := add(_encodedData, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
