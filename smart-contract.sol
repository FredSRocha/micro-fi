// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract LoanContract {
    address public lender;
    address public borrower;
    uint public loanAmount;
    uint public interestRate;
    uint public repaymentAmount;
    uint public dueDate;
    bool public isPaid;
    uint public borrowerScore;

    constructor(
        address _lender,
        address _borrower,
        uint _loanAmount,
        uint _interestRate,
        uint _repaymentAmount,
        uint _dueDate
    ) {
        lender = _lender;
        borrower = _borrower;
        loanAmount = _loanAmount;
        interestRate = _interestRate;
        repaymentAmount = _repaymentAmount;
        dueDate = _dueDate;
        isPaid = false;
        borrowerScore = 0;
    }

    function repayLoan() external payable {
        require(msg.sender == borrower, "Only the borrower can repay the loan");
        require(msg.value == repaymentAmount, "Incorrect repayment amount");
        require(!isPaid, "Loan has already been repaid");

        isPaid = true;
        (bool success, ) = lender.call{value: msg.value}("");
        require(success, "Failed to send repayment amount to the lender");

        if (block.timestamp <= dueDate) {
            borrowerScore += 1; // Adiciona 1 ponto ao score se o pagamento for feito antes do vencimento
        } else {
            uint daysLate = (block.timestamp - dueDate) / (60 * 60 * 24); // Calcula os dias de atraso
            uint penalty = daysLate / 30; // Calcula a penalidade com base em cada 30 dias de atraso
            borrowerScore = (borrowerScore > penalty) ? borrowerScore - penalty : 0; // Remove pontos do score com base na penalidade
        }
    }

    function calculateInterest() public view returns (uint) {
        uint interest = (loanAmount * interestRate) / 100;
        return loanAmount + interest;
    }
}
