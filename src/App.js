import { useEffect, useState, useMemo } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet, ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";

const SOLANA_NETWORK = process.env.REACT_APP_SOLANA_NETWORK || "devnet"; // Change to 'mainnet-beta' for production

function WalletBalance() {
  const wallet = useWallet();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (wallet.publicKey) {
          try {
            const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));
            const balance = await connection.getBalance(new PublicKey(wallet.publicKey));
            setBalance(balance / 1e9); // Convert lamports to SOL
          } catch (error) {
            console.error("Error fetching balance:", error);
            setBalance("Error");
          }
        }
      } catch (error) {
        console.error("Error in fetchBalance:", error);
      }
    };
    fetchBalance();
  }, [wallet.publicKey]);

  return (
    <div>
      {wallet.publicKey ? (
        <p>Balance: {balance !== null ? `${balance} SOL` : "Fetching..."}</p>
      ) : (
        <p>Connect your wallet to see balance</p>
      )}
    </div>
  );
}

function App() {
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={clusterApiUrl(SOLANA_NETWORK)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>Solana Wallet Balance Checker</h1>
            <WalletMultiButton />
            <WalletBalance />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;


