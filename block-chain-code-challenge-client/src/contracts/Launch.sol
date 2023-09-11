//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ICO.sol";


contract Launch is Initializable{
    Idatabase dataStorage;
    uint lastIndex;

    event PresaleCreated(address indexed created, address indexed token);

    function initialize(address db) external initializer{

        dataStorage = Idatabase(db);

    }

    receive() external payable{}

    fallback() external payable{
        createNewICO();
    }


    function createNewICO() public payable returns(address){

        DataParam memory newICOData;
        vestingStruct memory vesting;

        (
            newICOData.tokenAddress,
            newICOData.presaleSupply,
            newICOData.liquiditySupply,
            newICOData.presaleStartTime,
            newICOData.presaleEndTime,
            newICOData.softCap,
            newICOData.hardCap

        ) =  abi.decode(msg.data[4:], (

            address,
            uint,
            uint,
            uint,
            uint,
            uint,
            uint
        ));

        (
            newICOData.ratePerBNB,
            newICOData.routerAddress,
            newICOData.exchangeListingRateBNB,
            newICOData.minAmount,
            newICOData.maxAmount,
            newICOData.lockLiquidity,
            newICOData.burnRemaining

        ) =  abi.decode(msg.data[228:], (

            uint,
            address,
            uint,
            uint,
            uint,
            bool,
            bool
        ));

        (
            newICOData.liquidityLockTime,
            newICOData.whiteListEnabled,
            newICOData.Vesting,
            newICOData.bnbFee,
            newICOData.bnbCreationfee,
            vesting.firstPercent,
            vesting.firstReleaseTime

        ) =  abi.decode(msg.data[452:], (

            uint,
            bool,
            bool,
            bool,
            bool,
            uint,
            uint

        ));

        (vesting.cyclePercent, vesting.cycleReleaseTime, vesting.cycleCount) =  abi.decode(msg.data[676:], (uint, uint, uint));


        IERC20Upgradeable token = IERC20Upgradeable(newICOData.tokenAddress);

        newICOData.presaleSupply *= (10 ** IERC20MetadataUpgradeable(newICOData.tokenAddress).decimals());
        newICOData.ratePerBNB *= (10 ** IERC20MetadataUpgradeable(newICOData.tokenAddress).decimals());
        newICOData.exchangeListingRateBNB *= (10 **IERC20MetadataUpgradeable(newICOData.tokenAddress).decimals());

        lastIndex++;

        ICOparam memory _icoBase = _makeICOObject(lastIndex,newICOData);

        ICO icoContract = new ICO();

        address newcontract = address(icoContract);

        ICO(payable(newcontract)).initialize(_icoBase, vesting);

        if(newICOData.Vesting){
            ICO(payable(newcontract)).setVestingExternal();
        }

        IERC20Upgradeable feeToken = IERC20Upgradeable(dataStorage.getFeeToken());

        if(!newICOData.bnbCreationfee){
            if(dataStorage.getLunchStakingPoolFee() > 0){

                feeToken.transferFrom(msg.sender, dataStorage.getStakingPoolAddress(), dataStorage.getLunchStakingPoolFee());
                motherPool(dataStorage.getStakingPoolAddress()).receiveTokenFee(address(feeToken), dataStorage.getLunchStakingPoolFee());

            }

            if(dataStorage.getLunchAdminWalletFee() > 0){

                feeToken.transferFrom(msg.sender, dataStorage.getAdmin(), dataStorage.getLunchAdminWalletFee());

            }

        }else{
            (bool sent,) = payable(dataStorage.getAdmin()).call{value: msg.value}("");
            require(sent, "F");

        }



        uint amount = _totalFees(newICOData.liquiditySupply, newICOData.presaleSupply, newICOData.hardCap, newICOData.exchangeListingRateBNB);

        token.transferFrom(msg.sender, address(icoContract), amount);

        emit PresaleCreated(address(icoContract),newICOData.tokenAddress);

        return address(newcontract);

    }




    function _makeICOObject(uint256 _lastIndex,DataParam memory newICOData) internal returns (ICOparam memory){
        ICOparam memory x = ICOparam(
            _lastIndex,
            true, // IsLive true by default
            msg.sender,
            address(this),
            newICOData,
            Fees(
                dataStorage.getFeesBNBPercent(),
                dataStorage.getICOAdminWalletFee(),
                dataStorage.getICOStakingPoolFee(),
                dataStorage.getStakingPoolAddress(),
                dataStorage.getAdmin()
            )
        );


        return x;
    }


    function _totalFees(uint256 _liquiditySupply, uint256 _presaleSupply, uint hardcap, uint exchangeListingRateBNB) internal view returns(uint256){

        uint256 extraTokenForLiquidity =  _liquiditySupply * hardcap / 10000;

        extraTokenForLiquidity *= exchangeListingRateBNB;
        extraTokenForLiquidity /= 1e18;

        uint256 extraTokenForAdminFees = _presaleSupply * dataStorage.getICOStakingPoolFee() / 10000;
        uint256 totalFees = _presaleSupply * dataStorage.getICOAdminWalletFee() / 10000;

        return (_presaleSupply + extraTokenForLiquidity + extraTokenForAdminFees + totalFees);
    }

    function changeDatabase(address newDatabase) external{
        require(dataStorage.getAdmin() == msg.sender);

        dataStorage = Idatabase(newDatabase);
    }

    function getDB() external view returns(address){
        return address(dataStorage);
    }



}