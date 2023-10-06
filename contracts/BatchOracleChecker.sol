// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IDelayedOracleLike {
    function lastUpdateTime() external view returns (uint256 _lastUpdateTime);

    function shouldUpdate() external view returns (bool _shouldUpdate);
}

interface IOracleRelayerLike {
    struct OracleRelayerCollateralParams {
        IDelayedOracleLike oracle;
        uint256 safetyCRatio;
        uint256 liquidationCRatio;
    }

    function cParams(
        bytes32 _cType
    ) external view returns (OracleRelayerCollateralParams memory _cParams);
}

/**
 * @title  BatchOracleChecker
 * @notice Checks the Delayed Oracles (for a given list of Collateral Types) should be updated and returns a boolean array of the results.
 */
contract BatchOracleChecker {
    struct OracleStatus {
        bytes32 cType;
        IDelayedOracleLike oracle;
        bool shouldUpdate;
    }

    mapping(bytes32 => OracleStatus) public delayedOracles;

    constructor(
        IOracleRelayerLike _oracleRelayer,
        bytes32[] memory _collateralTypes
    ) {
        OracleStatus[] memory _data = new OracleStatus[](
            _collateralTypes.length
        );

        for (uint256 _i; _i < _collateralTypes.length; _i++) {
            bytes32 _cType = _collateralTypes[_i];

            _data[_i] = OracleStatus({
                cType: _cType,
                oracle: _oracleRelayer.cParams(_cType).oracle,
                shouldUpdate: _oracleRelayer
                    .cParams(_cType)
                    .oracle
                    .shouldUpdate()
            });
        }

        // encode return data
        bytes memory _encodedData = abi.encode(_data);

        // force constructor return via assembly
        assembly {
            let dataStart := add(_encodedData, 32) // abi.encode adds an additional offset
            return(dataStart, sub(msize(), dataStart))
        }
    }
}
