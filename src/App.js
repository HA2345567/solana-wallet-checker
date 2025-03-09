import { useState, useMemo } from "react";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { useWallet, ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const SOLANA_NETWORK = "devnet"; // Change to 'mainnet-beta' for real transactions

function Airdrop() {
  const wallet = useWallet();
  const [airdropStatus, setAirdropStatus] = useState("");

  const requestAirdrop = async () => {
    if (!wallet.publicKey) {
      setAirdropStatus("Please connect your wallet first.");
      return;
    }

    try {
      setAirdropStatus("Requesting airdrop...");
      const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));
      const txSignature = await connection.requestAirdrop(
        wallet.publicKey,
        0.1 * LAMPORTS_PER_SOL // Airdropping 1 SOL
      );
      await connection.confirmTransaction(txSignature);
      setAirdropStatus("Airdrop successful! Check your wallet.");
    } catch (error) {
      setAirdropStatus("Airdrop failed. Try again later.");
      console.error("Airdrop error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Solana Airdrop</h2>
      <WalletMultiButton />
      <button onClick={requestAirdrop} style={{ marginTop: "10px", padding: "10px", cursor: "pointer" }}>
        Request 1 SOL Airdrop
      </button>
      <p>{airdropStatus}</p>
    </div>
  );
}

function App() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={clusterApiUrl(SOLANA_NETWORK)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Airdrop />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
