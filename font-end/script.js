loanContractAbi =
[
	{
		"inputs": [],
		"name": "repayLoan",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_lender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_loanAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_interestRate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_repaymentAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_dueDate",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "borrower",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "borrowerScore",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "calculateInterest",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dueDate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "interestRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isPaid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lender",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "loanAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "repaymentAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
// Aguarde o carregamento completo da página
window.addEventListener('load', async () => {
  // Verificar se o MetaMask está instalado
  if (typeof window.ethereum !== 'undefined') {
    // Solicitar acesso à conta do usuário
    await window.ethereum.enable();
    // Criar uma instância do contrato usando o web3.js
    const web3 = new Web3(window.ethereum);
    const contractAddress = '0x594E3Dbeb77106A003145071Eeea88cD9c1197ac';
    const contract = new web3.eth.Contract(loanContractAbi, contractAddress);
    
    // Obter os dados do contrato
    const lender = await contract.methods.lender().call();
    const borrower = await contract.methods.borrower().call();
    const loanAmount = BigInt(await contract.methods.loanAmount().call());
    const interestRate = BigInt(await contract.methods.interestRate().call());
    const repaymentAmount = BigInt(await contract.methods.repaymentAmount().call());
    const dueDate = BigInt(await contract.methods.dueDate().call());
    const isPaid = await contract.methods.isPaid().call();
    borrowerScore = BigInt(await contract.methods.borrowerScore().call());
    let paidResult = '';
    if (isPaid) {
      paidResult = 'Sim';
    } else {
      paidResult = 'Não';
    }
    
    // Atualizar os detalhes do empréstimo na página
    document.getElementById('lender').textContent = lender;
    document.getElementById('borrower').textContent = borrower;
    document.getElementById('loanAmount').textContent = loanAmount.toString();
    document.getElementById('interestRate').textContent = interestRate.toString();
    document.getElementById('repaymentAmount').textContent = repaymentAmount.toString();
    document.getElementById('dueDate').textContent = new Date(Number(dueDate) * 1000).toLocaleDateString();
    document.getElementById('isPaid').textContent = paidResult;
    document.getElementById('borrowerScore').textContent = borrowerScore.toString();
    
    // Função para realizar o pagamento do empréstimo
    function repayLoan() {
      // Verificar se o MetaMask está conectado
      if (typeof window.ethereum !== 'undefined') {
        // Solicitar acesso à conta do usuário
        window.ethereum.enable().then(() => {
          // Obter a conta do usuário
          web3.eth.getAccounts().then(([account]) => {
            // Enviar transação para o contrato
            contract.methods.repayLoan().send({ from: account, value: repaymentAmount.toString() })
              .then(() => {
                // Atualizar o status do pagamento e o score do mutuário
                document.getElementById('isPaid').textContent = 'true';
                borrowerScore = borrowerScore < BigInt(1) ? BigInt(0) : borrowerScore - BigInt(1);
                document.getElementById('borrowerScore').textContent = borrowerScore.toString();
              })
              .catch((error) => {
                console.error('Failed to repay loan:', error);
              });
          });
        });
      }
    }
    
    // Ativar o botão para realizar o pagamento do empréstimo
    document.getElementById('repayButton').addEventListener('click', repayLoan);
  } else {
    console.error('MetaMask not found');
  }
});