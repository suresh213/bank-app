import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import {
  accounts,
  initailNewAccountData,
  initialAccountDatas,
} from "./constants";
import "./App.css";

function App() {
  const [accountData, setAccountData] = useState(initialAccountDatas);
  const [newAccountData, setNewAccountData] = useState(initailNewAccountData);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setTotalAmount(calculateTotalAmount());
  }, [accountData]);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 2000);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (newAccountData.accountId == "-1") {
      showError("Please select an account");
      return;
    }

    setAccountData([
      ...accountData,
      {
        ...newAccountData,
        transactionId: v4(),
      },
    ]);

    setNewAccountData(initailNewAccountData);
  };

  const handleDelete = (transactionId) => {
    const alteredAccountData = accountData.filter(
      (account) => account.transactionId != transactionId
    );

    setAccountData(alteredAccountData);
  };

  const displayInIndianRupeeFormat = (amount) => {
    return amount.toLocaleString("en-IN");
  };

  const calculateTotalAmount = () => {
    const totalAmount = accountData.reduce((result, data) => {
      result += Number(data.creditAmount);
      result -= Number(data.debitAmount);
      return result;
    }, 0);

    return totalAmount;
  };

  return (
    <div className="App">
      <div className="form-outer-div">
        <form onSubmit={handleSubmit}>
          <select
            value={newAccountData.accountId}
            onChange={(e) =>
              setNewAccountData({
                ...newAccountData,
                accountId: e.target.value,
              })
            }
          >
            <option value={"-1"}>Select account</option>
            {accounts.map((account, index) => (
              <option value={account.id} key={index}>
                {account.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Credit amount"
            value={newAccountData.creditAmount}
            onChange={(e) =>
              setNewAccountData({
                ...newAccountData,
                creditAmount: e.target.value,
              })
            }
          />
          <input
            placeholder="Debit amount"
            value={newAccountData.debitAmount}
            onChange={(e) =>
              setNewAccountData({
                ...newAccountData,
                debitAmount: e.target.value,
              })
            }
          />
          <button type="submit">Add</button>
        </form>
      </div>
      {error?.length > 0 && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Credit amount</th>
            <th>Debit amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accountData.map((account, index) => (
            <tr key={index}>
              <td>
                {accounts.find((a) => a.id == account.accountId)?.name || ""}
              </td>
              <td>{displayInIndianRupeeFormat(account.creditAmount)}</td>
              <td>{displayInIndianRupeeFormat(account.debitAmount)}</td>
              <td>
                <button onClick={() => handleDelete(account.transactionId)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total amount : {displayInIndianRupeeFormat(totalAmount)}</p>
    </div>
  );
}

export default App;
