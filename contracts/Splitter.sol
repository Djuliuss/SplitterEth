pragma solidity 0.4.24;

 import "./Pausable.sol";
 contract Splitter is Pausable {

    mapping (address => uint) public balances;
   
    event LogSplit (
        address indexed from,
        address indexed receiver1,
        uint    amount1,
        address indexed receiver2,
        uint    amount2
    );
    
    event LogWithdraw (
        address indexed receiver,
        uint amount
    );
    
    function split (address receiver1, address receiver2) ifRunning payable public {
	    
	    uint half = msg.value / 2;
        uint remainder = msg.value - half;
        balances[receiver1] += half;
        balances[receiver2] += remainder;
        emit LogSplit(msg.sender,receiver1,half,receiver2,remainder);
    }
  
    function withdraw () ifRunning public  {
        uint balance = balances[msg.sender]; 
        require (balance > 0,"account has a zero balance");
        balances[msg.sender] = 0;
	    emit LogWithdraw(msg.sender,balance);
	    msg.sender.transfer(balance);
	}
   
    function () public payable {
        revert();
    }

}

