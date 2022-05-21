import { Connection } from "@solana/web3.js";
import { Algodv2 } from "algosdk";
import { ethers } from "ethers";
import { ALGORAND_HOST, SOLANA_HOST } from "./consts";
import { mnemonicToSecretKey } from "algosdk";
import { Signer, WormholeChain } from "./wormhole";
import { Algorand, AlgorandSigner } from "./chains/algorand";
import { Ethereum, EthereumSigner } from "./chains/ethereum";
import { Solana, SolanaSigner } from "./chains/solana";

type GetSignerFn = (client?: any) => Signer;
type GetClientFn = () => any;
type GetChainFn = (client: any) => WormholeChain;

type ChainConfig = {
  chain: GetChainFn;
  getSigner: GetSignerFn;
  getClient: GetClientFn;
};

export const ChainConfigs: { [key: string]: ChainConfig } = {
  algorand: {
    chain: (client: any) => new Algorand(client),
    getSigner: getAlgoSigner,
    getClient: getAlgoConnection,
  },
  solana: {
    chain: (client: any) => new Solana(client),
    getSigner: getSolSigner,
    getClient: getSolConnection,
  },
  ethereum: {
    chain: (client: any) => new Ethereum(client),
    getSigner: getEthSigner,
    getClient: getEthConnection,
  },
};

export function initChain(cc: ChainConfig): [WormholeChain, Signer] {
  const conn = cc.getClient();
  const chain = cc.chain(conn);
  const signer = cc.getSigner(conn);
  return [chain, signer];
}

export function getSolConnection(): Connection {
  return new Connection(SOLANA_HOST, "confirmed");
}

export function getAlgoConnection(): Algodv2 {
  const { algodToken, algodServer, algodPort } = ALGORAND_HOST;
  return new Algodv2(algodToken, algodServer, algodPort);
}

export function getEthConnection(network?: string): ethers.providers.Provider {
  const apiKey = "7TAE9N2T58GN4JTZS4HKN5GU7B1J9KSCWN";
  return new ethers.providers.EtherscanProvider(
    (network ||= "ropsten"),
    apiKey
  );
}

export function getAlgoSigner(): AlgorandSigner {
  const mn =
    "pizza hurry night ladder heart live whip property own slogan grape inner maze exact receive inquiry deliver baby push reform renew mouse second above task";
  return new AlgorandSigner(mnemonicToSecretKey(mn));
}

export function getSolSigner(): SolanaSigner {
  const pk =
    "4gi9Mj93gANr1W1fwqDMmPMG6j8bRxp6R8ERKDji66yw2vzckLQuym6qWcrrEj4EFP8hPCCtJ54vtbbYRjpXHF3b";
  return new SolanaSigner(pk);
}

export function getEthSigner(provider: any): EthereumSigner {
  const ETH_PRIVATE_KEY =
    "af7dae6096a3ce4b31f6ee0c31f58f0d46e706e88eaf29723fab9203413ca351";
  return new ethers.Wallet(ETH_PRIVATE_KEY, provider);
}
