//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./BasicStructs.sol";
import "./Idatabase.sol";
import "./IPancakePair.sol";
import "./IPancakeFactory.sol";
import "./IPancakeRouter.sol";



interface IFactory{
    function updateAsSaleEnded(address _ico) external;
    function getDB() external view returns(address);
}

interface motherPool {
    function receiveTokenFee(address _token, uint256 amount) external;
}

interface ILock{
    function launchLock(address owner,  address token_, address beneficiary_, uint256 releaseTime_, uint256 amount_, bool _liquidity) external ;
}

contract ICO is Initializable{

    // ICO attributes here
    ICOparam public icoInfo;
    IERC20Upgradeable token;
    IFactory factory;
    // ENS Burn address
    address DEAD;
    bool public isKYC;
    bool public isAudit;


    mapping(address => bool) whitelisted;
    address[] public _whitelist;
    address[] public buyerAddresses;
    address[] claimedAddresses;
    bool isWhiteListed;
    uint256 public totalWhitelisted;
    uint tokenRemainderBeforeBurn;


    uint256 raisedBNB;
    uint256 public soldToken;
    uint256 bnbToLiquidity;

    bool public isCanceled;
    bool public isFinalized;


    mapping(address => uint256) purchase;
    mapping(address => uint256) spentBNB;
    mapping(address => bool) public claimedRefund;
    mapping(address => bool) contributed;
    // Some Events
    //event Bought(address indexed user, uint amount, uint newbalance, uint totalContribution, uint totalRaised, uint tokensSold);
    //event Withdrawn(address indexed user, uint amount, uint newbalance, uint totalContribution, uint totalRaised, uint tokensSold);
    //emit Claimed(address indexed user, uint tokenAmount);
    event LPTokensLocked(address indexed owner, address indexed beneficiary, address indexed pairAddress, uint totalLocked, uint lockTime);


    // Pancake info
    address pancakeRouterAddress;
    IPancakeRouter02 pancakeSwapRouter;
    address pancakeSwapPair;



    //Vesting

    struct VestingPeriod{
        uint percent;
        uint startTime;
        uint vestingCount;
        uint MaxClaim;
    }

    vestingStruct public vesting;

    uint maxPercent;
    bool public Vesting;
    uint VestingCount;

    VestingPeriod _vestingPeriod;

    mapping(uint => VestingPeriod) PeriodtoPercent;
    mapping(address => uint) TotalBalance;
    mapping(address => uint) claimCount;
    mapping(address => uint) claimedAmount;
    mapping(address => uint) claimmable;

    event Bought(address indexed user, uint amount, uint newbalance, uint totalContribution, uint totalRaised, uint tokensSold);
    event pairExists(address indexed pair);



    function initialize (ICOparam memory _data, vestingStruct memory _struct) external initializer{
        icoInfo = _data;
        isWhiteListed = icoInfo.data.whiteListEnabled;
        Vesting = icoInfo.data.Vesting;
        DEAD = 0x000000000000000000000000000000000000dEaD;
        token = IERC20Upgradeable(icoInfo.data.tokenAddress);
        factory = IFactory(msg.sender);

        vesting = _struct;

        pancakeRouterAddress = icoInfo.data.routerAddress;
        IPancakeRouter02 _uniswapV2Router = IPancakeRouter02(pancakeRouterAddress);
        pancakeSwapRouter = _uniswapV2Router;
        pancakeSwapPair = IPancakeFactory(_uniswapV2Router.factory()).getPair(icoInfo.data.tokenAddress, _uniswapV2Router.WETH());

        if(pancakeSwapPair == address(0)){

            pancakeSwapPair = IPancakeFactory(_uniswapV2Router.factory()).createPair(icoInfo.data.tokenAddress, _uniswapV2Router.WETH());
        }else{
            emit pairExists(pancakeSwapPair);
        }


    }


    function setIsKYCAndAudit(bool kyc,bool audit) external{
        require(Idatabase(address(IFactory(factory).getDB())).getAuthorised(msg.sender));//Not Factory
        isKYC = kyc;
        isAudit = audit;
    }

    receive() external payable{
        buyTokens();
    }

    function getUsersPurchase(address _user) external view returns(uint256){
        return purchase[_user];
    }

    function getContribution(address _user) external view returns(uint256){
        return spentBNB[_user];
    }

    function getPresaleSupply() external view returns(uint){
        return icoInfo.data.presaleSupply;
    }

    function getLiquiditySupply() external view returns(uint){
        uint totalTokensForLiwuidity = icoInfo.data.liquiditySupply * token.balanceOf(address(this)) /10000;

        return totalTokensForLiwuidity;
    }

    function getLocekdtokens() external view returns(uint){
        if(isFinalized){
            uint256 _amount = IERC20Upgradeable(pancakeSwapPair).balanceOf(address(Idatabase(factory.getDB()).getLockAddress()));
            return _amount;
        } else {
            return 0;
        }
    }
    function getUnlockedTokens() external view returns(uint){
        if(isFinalized || isCanceled){
            return 0;
        }else{
            return IERC20Upgradeable(pancakeSwapPair).balanceOf(address(this));
        }

    }
    function getBurntTokens() external view returns(uint){
        if(isFinalized && icoInfo.data.burnRemaining){
            return tokenRemainderBeforeBurn;
        }else{
            return 0;
        }
    }

    function getTotalRaised() external view returns(uint){
        return raisedBNB;
    }


    function AIrdrop(uint startIndex, uint endIndex) external{
        require(msg.sender == icoInfo.owner);//Not Owner
        require(isFinalized);//Pressale not finalised

        startIndex--;
        endIndex--;

        for(uint i = startIndex; i <= endIndex; i++){
            if(purchase[buyerAddresses[i]] > 0){

                token.transfer(buyerAddresses[i], purchase[buyerAddresses[i]]);
                claimedAddresses.push(buyerAddresses[i]);
                delete purchase[buyerAddresses[i]];
                delete spentBNB[buyerAddresses[i]];

            }else{
                continue;
            }
        }

    }

    function massRefund(uint startIndex, uint endIndex) external{
        require(msg.sender == icoInfo.owner);//Not Owner
        require(isCanceled);//Presale Not Cancelled

        startIndex--;
        endIndex--;

        for(uint i = startIndex; i <= endIndex; i++){

            if(!claimedRefund[buyerAddresses[i]]){
                raisedBNB -= spentBNB[buyerAddresses[i]];
                claimedRefund[buyerAddresses[i]] = true;
                claimedAddresses.push(buyerAddresses[i]);

                payable(buyerAddresses[i]).transfer(spentBNB[buyerAddresses[i]]);

                delete spentBNB[buyerAddresses[i]];

            }else{

                continue;

            }

        }

    }

    function getClaimedAddresses() external view returns(address[] memory){
        return claimedAddresses;
    }



    function buyTokens() public payable{
        require(icoInfo.data.presaleStartTime <= block.timestamp);//Not Started
        require(icoInfo.data.presaleEndTime > block.timestamp);//Already Ended
        require(raisedBNB < icoInfo.data.hardCap);//Hardcap Reached
        require(msg.value + raisedBNB <= icoInfo.data.hardCap, ">HC");//Going over hard cap
        require(msg.value + raisedBNB>= icoInfo.data.minAmount,"A<M");//Minimum amount not reached
        require(msg.value + spentBNB[msg.sender] <= icoInfo.data.maxAmount,"A>M");//Maximum limit reached

        bool canBuy;

        if(isWhiteListed){
            if(whitelisted[msg.sender]){
                canBuy = true;
            }else{
                canBuy = false;
            }
        }else{
            canBuy = true;
        }

        require(canBuy);//Cannot buy


        uint256 totalReceivable = (icoInfo.data.ratePerBNB * msg.value)/1e18;


        spentBNB[msg.sender] += msg.value;
        purchase[msg.sender] += totalReceivable;


        raisedBNB +=msg.value;

        soldToken += totalReceivable;

        TotalBalance[msg.sender] += totalReceivable;

        if(!contributed[msg.sender]){
            contributed[msg.sender] = true;
            buyerAddresses.push(msg.sender);
        }

        emit Bought(msg.sender, totalReceivable, purchase[msg.sender], spentBNB[msg.sender], raisedBNB, soldToken);

    }

    function getTotalContributors() external view returns(uint){
        return buyerAddresses.length;
    }


    function emergencyWithdraw(uint256 amount_) external {
        require(icoInfo.data.presaleEndTime > block.timestamp,"PE");//Presale Ended
        require(!isCanceled,"PC");//Presale Cancelled
        require(!isFinalized,"AF");//Already FInalised
        require(spentBNB[msg.sender] >= amount_);//Insufficient Amount

        uint256 fees = amount_ * 1000 / 10000;

        uint256 receivable = amount_ - fees;


        raisedBNB -= amount_;
        purchase[msg.sender] -= ((amount_ * icoInfo.data.ratePerBNB)/ 1e18);
        soldToken -= ((amount_ * icoInfo.data.ratePerBNB)/ 1e18);
        spentBNB[msg.sender] -= amount_;

        payable(msg.sender).transfer(receivable);
        payable(icoInfo.fees.AdminWalletAddress).transfer(fees);

        //emit Withdrawn(msg.sender, amount_, purchase[msg.sender], spentBNB[msg.sender], raisedBNB, soldToken);

    }



    function cancelPresale() external{
        require(msg.sender == icoInfo.owner);//Not Owner
        require(!isFinalized);//Already FInalised
        require(!isCanceled);//Presale Cancelled

        _cancelPresale();
    }


    function _cancelPresale() internal{

        uint256 balance = token.balanceOf(address(this));

        token.transfer(icoInfo.owner, balance);

        isCanceled = true;

    }

    function adminCancelPresale() external{
        require(Idatabase(address(IFactory(factory).getDB())).getAuthorised(msg.sender));//Not Factory
        require(!isCanceled);//Presale Cancelled
        require(!isFinalized);//Already FInalised

        _cancelPresale();

        remainingTokens();

    }


    function claimRefund() external{
        require(isCanceled,"PNC");//Prsale Not cancelled
        require(spentBNB[msg.sender] > 0);//Unavailable Balance

        uint refund = spentBNB[msg.sender];

        delete purchase[msg.sender];
        delete spentBNB[msg.sender];

        claimedRefund[msg.sender] = true;

        payable(msg.sender).transfer(refund);
    }


    function endSale() external{
        require(msg.sender == icoInfo.owner);//Not Owner
        require(raisedBNB >= icoInfo.data.softCap, "SNR");
        require(!isFinalized);


        isFinalized = true;

        _distribute();

        if(!icoInfo.data.bnbFee){
            uint256 adminToken = icoInfo.data.presaleSupply * icoInfo.fees.feesTokenAdmin / 10000;

            uint256 stakeToken = icoInfo.data.presaleSupply * icoInfo.fees.feesTokenStaking / 10000;

            if(adminToken > 0){
                token.transfer(icoInfo.fees.AdminWalletAddress, adminToken);
            }
            if(stakeToken > 0){
                token.transfer(icoInfo.fees.StakingWalletAddress, stakeToken);
                motherPool(icoInfo.fees.StakingWalletAddress).receiveTokenFee(address(token), stakeToken);

            }
        }

        remainingTokens();

    }


    function _distribute() internal {

        uint feeAmount;

        if(icoInfo.data.bnbFee){
            feeAmount = icoInfo.fees.feesBNB;
        }else{
            feeAmount = Idatabase(factory.getDB()).getfeeBNBShared();
        }

        uint256 fees = feeAmount * raisedBNB / 10000;


        payable(icoInfo.fees.AdminWalletAddress).transfer(fees);

        bnbToLiquidity = icoInfo.data.liquiditySupply * raisedBNB /10000;
        bnbToLiquidity -= fees;

        uint totalTokensForLiwuidity = (bnbToLiquidity * icoInfo.data.exchangeListingRateBNB) / 1e18;

        _provideLiquidity(bnbToLiquidity, totalTokensForLiwuidity);

        if(address(this).balance > 0){

            uint256 ownerscut = address(this).balance;

            payable(icoInfo.owner).transfer(ownerscut);

        }



        uint256 tokenAmount = IERC20Upgradeable(pancakeSwapPair).balanceOf(address(this));

        _lockLPTokens(tokenAmount, icoInfo.owner,icoInfo.data.liquidityLockTime);



    }

    function remainingTokens() internal {

        uint256 bal = token.balanceOf(address(this)) - soldToken;

        tokenRemainderBeforeBurn = bal;

        if(bal > 0){
            if(icoInfo.data.burnRemaining){
                token.transfer(DEAD,bal);
            }else {
                token.transfer(icoInfo.owner,bal);
            }
        }

    }

    function _provideLiquidity(uint256 bnbAmount, uint tokenAmount) internal {

        token.approve(pancakeRouterAddress, tokenAmount);
        token.approve(pancakeSwapPair, tokenAmount);


        // add the liquidity
        pancakeSwapRouter.addLiquidityETH{value: bnbAmount}(
            icoInfo.data.tokenAddress,
            tokenAmount,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this), // Liquidity Locker or Creator Wallet
            block.timestamp + 360
        );

    }


    function _lockLPTokens(uint256 _amount,address _owner,uint256 _liquidityLockTime) internal{

        ILock locker = ILock(Idatabase(factory.getDB()).getLockAddress());

        IERC20Upgradeable(pancakeSwapPair).approve(address(locker), _amount);

        locker.launchLock(msg.sender, pancakeSwapPair, _owner , _liquidityLockTime + block.timestamp, _amount, true);

        emit LPTokensLocked(msg.sender, _owner, address(pancakeSwapPair), _amount, _liquidityLockTime);

    }

    function Claim() external{
        require(purchase[msg.sender] > 0, "0B");//Zero Balance
        require(isFinalized,"PNF");//Pressale not finalised

        if(Vesting){
            _vestingClaim();
        }else {
            _normalClaim();
        }
    }

    function _normalClaim() internal {


        uint bal = purchase[msg.sender];

        delete purchase[msg.sender];
        delete spentBNB[msg.sender];

        claimedAddresses.push(msg.sender);

        token.transfer(msg.sender, bal);

        //emit Claimed(msg.sender, bal);
    }


    //Vesting


    function updateVesting(bool newStatus, vestingStruct calldata _struct) external {
        require(msg.sender == icoInfo.owner);//Not Owner

        Vesting = newStatus;
        vesting = _struct;
        setVesting();
    }

    uint[] public time;
    uint[] public percent;

    function getVesting() external view returns(uint[] memory, uint[] memory){
        return(time, percent);
    }

    function setVestingExternal() external {
        setVesting();
    }

    function setVesting() internal {

        uint count = vesting.cycleCount;

        uint totalPrecent = ((count-1) * vesting.cyclePercent) +vesting.firstPercent;

        require(totalPrecent >= 10000);


        VestingCount++;
        maxPercent += vesting.firstPercent;

        PeriodtoPercent[VestingCount] = VestingPeriod({
            percent : vesting.firstPercent,
            startTime : vesting.firstReleaseTime,
            vestingCount : VestingCount,
            MaxClaim : maxPercent
        });

        vestingDetails.push(PeriodtoPercent[VestingCount]);

        time.push(vesting.firstReleaseTime);
        percent.push(vesting.firstPercent);

        uint lastime = vesting.firstReleaseTime;
        uint percentAmount;



        for(uint i = 2; i<= vesting.cycleCount; i++){

            lastime += vesting.cycleReleaseTime;

            require(lastime > PeriodtoPercent[VestingCount-1].startTime);

            maxPercent += vesting.cyclePercent;
            percentAmount = vesting.cyclePercent;

            if(maxPercent > 10000){

                maxPercent -= vesting.cyclePercent;
                percentAmount = 10000 - maxPercent;

                maxPercent += percentAmount;

            }

            time.push(lastime);
            percent.push(percentAmount);

            VestingCount++;

            PeriodtoPercent[VestingCount] = VestingPeriod({

                percent : percentAmount,
                startTime : lastime,
                vestingCount : VestingCount,
                MaxClaim : maxPercent
            });
            vestingDetails.push(PeriodtoPercent[VestingCount]);
        }


    }
    mapping(address => mapping(uint => bool)) public vestingToClaimed;
    VestingPeriod[] vestingDetails;

    function getVestingDetails() external view returns(VestingPeriod[] memory){
        return vestingDetails;
    }


    function _vestingClaim() public {
        require(Vesting);//Vesting Not set
        require(claimCount[msg.sender] <= VestingCount,"CC");//Claiming Complete


        for(uint i = claimCount[msg.sender]; i<= VestingCount; i++){
            if(PeriodtoPercent[i].startTime <= block.timestamp){
                claimmable[msg.sender] +=PeriodtoPercent[i].percent;
                claimCount[msg.sender] ++;
                vestingToClaimed[msg.sender][i] = true;
            }
            else
                break;
        }


        require(claimmable[msg.sender] <= 10000);


        uint _amount = claimmable[msg.sender] * TotalBalance[msg.sender] / 10000;

        purchase[msg.sender] -= _amount;
        claimedAmount[msg.sender] += claimmable[msg.sender];

        if(purchase[msg.sender]==0){
            claimedAddresses.push(msg.sender);
        }

        delete claimmable[msg.sender];
        delete spentBNB[msg.sender];

        token.transfer(msg.sender, _amount);

        //emit Claimed(msg.sender, _amount);

    }


    //Whitelist



    function retriveWhiteList()external view returns(address[] memory){
        return _whitelist;
    }

    function isUserWhitelisted(address _user) external view returns(bool){
        return whitelisted[_user];
    }


    function addToWhiteList(address[] memory users) external{
        require(msg.sender == icoInfo.owner);//Not Owner

        for(uint256 i = 0 ; i < users.length; i++){
            whitelisted[users[i]] = true;
            _whitelist.push(users[i]);
            totalWhitelisted++;
        }
    }



    function removeFromWhitelist(address[] memory users) external{
        require(msg.sender == icoInfo.owner);//Not Owner

        for(uint256 i=0 ; i<users.length;i++){
            whitelisted[users[i]] = false;
            totalWhitelisted--;
        }
    }


    function checkWhiteListStatus() external view returns(bool){
        return isWhiteListed;
    }

    function updateWhitelistStatus(bool newStatus) external {
        require(msg.sender == icoInfo.owner);//Not Owner

        isWhiteListed = newStatus;
    }

}