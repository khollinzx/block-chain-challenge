//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";



interface Idatabase{
    function requestKYCandAudit() external;
    function getPresaleActive() external view returns(bool);
    function endPresale() external;
    function getLockAddress() external view returns(address);
    function getLastIndex() external returns(uint);

    function getPermitted(address user) external view returns(bool);
    function getLunchStakingPoolFee() external view returns(uint);
    function getLunchAdminWalletFee() external view returns(uint);
    function getBurnFee() external view returns(uint);
    function getStakingPoolAddress() external view returns(address);
    function getFeesBNBPercent() external view returns(uint);
    function getICOAdminWalletFee() external view returns(uint);
    function getICOStakingPoolFee() external view returns(uint);
    function getFeeToken() external view returns(address);
    function getAdmin() external view returns(address);
    function getfeeBNBShared() external view returns(uint);
    function getAuthorised(address user) external view returns(bool);
    function getMintAddress() external view returns(address);

}