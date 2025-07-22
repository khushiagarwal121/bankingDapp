import { useState } from "react";
import { createContext } from "react";
export const BankingContext = createContext();
export function BankingContextProvider({ children }) {
  // Ensure transactions is initialized as an empty array
  const [transactions, setTransactions] = useState([]);
 const [wallet, setWallet] = useState(null);
const [balance, setBalance] = useState("0");
  // You can add more state here (balance, account, etc.)
  const value = {
   wallet, setWallet,
  balance, setBalance,
  transactions, setTransactions,
    // add other state here if needed
  };

  return (
   <BankingContext.Provider value={value}>
  {children}
</BankingContext.Provider>

  );
}
