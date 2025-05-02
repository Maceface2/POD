import { ethers } from 'ethers';

// BSC Testnet configuration
const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const BSC_TESTNET_CHAIN_ID = 97;

// Contract ABI
const contractABI = [
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_seller",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "amount",
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
      "name": "buyer",
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
      "name": "getContractBalance",
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
      "name": "isDelivered",
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
      "name": "markAsDelivered",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "seller",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

// Contract bytecode
const contractBytecode = "0x608060405260405161077138038061077183398181016040528101906100259190610184565b5f3411610067576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161005e90610209565b60405180910390fd5b335f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550346002819055505f60035f6101000a81548160ff0219169083151502179055505f600360016101000a81548160ff02191690831515021790555050610227565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6101538261012a565b9050919050565b61016381610149565b811461016d575f80fd5b50565b5f8151905061017e8161015a565b92915050565b5f6020828403121561019957610198610126565b5b5f6101a684828501610170565b91505092915050565b5f82825260208201905092915050565b7f4d757374206465706f7369742066756e64732077697468206f726465720000005f82015250565b5f6101f3601d836101af565b91506101fe826101bf565b602082019050919050565b5f6020820190508181035f830152610220816101e7565b9050919050565b61053d806102345f395ff3fe608060405234801561000f575f80fd5b506004361061007b575f3560e01c80637150d8ae116100595780637150d8ae146100d9578063765f744c146100f7578063aa8c217c14610115578063ac3265b8146101335761007b565b806308551a531461007f578063209ebc081461009d5780636f9fb98a146100bb575b5f80fd5b61008761013d565b6040516100949190610371565b60405180910390f35b6100a5610162565b6040516100b291906103a4565b60405180910390f35b6100c3610175565b6040516100d091906103d5565b60405180910390f35b6100e161017c565b6040516100ee919061040e565b60405180910390f35b6100ff61019f565b60405161010c91906103a4565b60405180910390f35b61011d6101b1565b60405161012a91906103d5565b60405180910390f35b61013b6101b7565b005b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360019054906101000a900460ff1681565b5f47905090565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60035f9054906101000a900460ff1681565b60025481565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610244576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161023b90610481565b60405180910390fd5b600360019054906101000a900460ff1615610294576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161028b906104e9565b60405180910390fd5b600160035f6101000a81548160ff0219169083151502179055506001600360016101000a81548160ff02191690831515021790555060015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc60025490811502906040515f60405180830381858888f1935050505015801561032f573d5f803e3d5ffd5b50565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61035b82610332565b9050919050565b61036b81610351565b82525050565b5f6020820190506103845f830184610362565b92915050565b5f8115159050919050565b61039e8161038a565b82525050565b5f6020820190506103b75f830184610395565b92915050565b5f819050919050565b6103cf816103bd565b82525050565b5f6020820190506103e85f8301846103c6565b92915050565b5f6103f882610332565b9050919050565b610408816103ee565b82525050565b5f6020820190506104215f8301846103ff565b92915050565b5f82825260208201905092915050565b7f4f6e6c792062757965722063616e2063616c6c207468697300000000000000005f82015250565b5f61046b601883610427565b915061047682610437565b602082019050919050565b5f6020820190508181035f8301526104988161045f565b9050919050565b7f416c7265616479207061696400000000000000000000000000000000000000005f82015250565b5f6104d3600c83610427565b91506104de8261049f565b602082019050919050565b5f6020820190508181035f830152610500816104c7565b905091905056fea264697066735822122037214b0ed68bd352c8434d72896f3b997949d8f500a19155e77e6e835b074f1764736f6c634300081a0033";

export class ContractHandler {
  constructor(contractAddress, signer = null) {
    if (!contractAddress) {
      throw new Error("Contract address is required");
    }
    
    this.contractAddress = contractAddress;
    this.signer = signer;
    
    // If signer is provided, use it to create the contract instance
    if (signer) {
      this.contract = new ethers.Contract(contractAddress, contractABI, signer);
    } else {
      // Create a read-only contract instance
      this.contract = new ethers.Contract(contractAddress, contractABI);
    }
  }

  // Set or update the signer
  setSigner(signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(this.contractAddress, contractABI, signer);
    return this;
  }

  // Create a new contract instance
  static async deployContract(signer, sellerAddress, amount) {
    try {
      // Verify the signer can send transactions
      if (!signer.provider) {
        throw new Error("Signer does not have a provider attached");
      }
      
      // Check if we're on BSC testnet
      const network = await signer.provider.getNetwork();
      if (network.chainId !== BigInt(BSC_TESTNET_CHAIN_ID)) {
        // Request to switch to BSC testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}` }],
        });
      }
      
      // Create the contract factory with the signer
      const ContractFactory = new ethers.ContractFactory(contractABI, contractBytecode, signer);
      
      // Deploy the contract with explicit transaction parameters
      const contract = await ContractFactory.deploy(sellerAddress, { 
        value: amount,
        gasLimit: 3000000 // Explicitly set gas limit
      });
      
      // Wait for the transaction to be mined
      await contract.deploymentTransaction().wait();
      
      // Get the contract address (different in ethers.js v6)
      const contractAddress = await contract.getAddress();
      
      const handler = new ContractHandler(contractAddress, signer);
      return handler;
    } catch (error) {
      console.error("Error deploying contract:", error);
      throw error;
    }
  }
  
  // Create a smart contract from services.js
  static async createSmartContract(signer, orderData) {
    try {
      // Parse the BNB amount from the order (keeping EthAmount name as requested)
      const bnbAmount = ethers.parseEther(orderData.EthAmount);
      
      // Deploy the contract with the seller's address and BNB amount
      const contractInstance = await ContractHandler.deployContract(
        signer, 
        orderData.sellerAddress, 
        bnbAmount
      );
      
      if (!contractInstance || !contractInstance.contractAddress) {
        throw new Error("Contract deployment failed - no address returned");
      }
      
      return contractInstance;
    } catch (error) {
      console.error("Error creating smart contract:", error);
      throw error;
    }
  }

  // Mark order as delivered
  async markAsDelivered() {
    try {
      if (!this.signer) {
        throw new Error("Signer is required to perform this action");
      }
      
      const tx = await this.contract.markAsDelivered({
        gasLimit: 200000 // Explicitly set gas limit
      });
      await tx.wait();
      return true;
    } catch (error) {
      console.error("Error marking as delivered:", error);
      throw error;
    }
  }

  // Get contract balance
  async getContractBalance() {
    try {
      return await this.contract.getContractBalance();
    } catch (error) {
      console.error("Error getting contract balance:", error);
      throw error;
    }
  }

  // Get contract details
  async getContractDetails() {
    try {
      const [buyer, seller, amount, isDelivered, isPaid] = await Promise.all([
        this.contract.buyer(),
        this.contract.seller(),
        this.contract.amount(),
        this.contract.isDelivered(),
        this.contract.isPaid()
      ]);

      return {
        buyer,
        seller,
        amount: amount.toString(),
        isDelivered,
        isPaid
      };
    } catch (error) {
      console.error("Error getting contract details:", error);
      throw error;
    }
  }
} 