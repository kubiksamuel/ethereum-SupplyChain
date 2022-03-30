import React, { useContext, useEffect, useState } from "react";
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { ethers } from "ethers";
import { Button } from "react-bootstrap";

// interface Props {
//   "name": string;
// }

// {name}:Props

export const SupplyChain = () => {
  const suppllychain = useContext(SupplyChainContext);
  const [currentAddress, setCurrentAddress] = useState("");
  const [message, setMessage] = useState("");
  // const [inputGreeting, setInputGreeting] = useState("");
  useEffect(() => {
    const doAsync =  async () => {
      if (!suppllychain.instance) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
      console.log("SupplyChain is deployed at ", suppllychain.instance.address);
      
      // console.log("Supply chain admin is: ",  suppllychain.instance.signatoryRoles("0"));
      setMessage(await signer.getAddress());
    };
    doAsync();
  }, [suppllychain]);

  // const handleSetGreeting = async (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  // ) => {
  //   e.preventDefault();
  //   if (!greeter.instance) throw Error("Greeter instance not ready");
  //   if (greeter.instance) {
  //     const tx = await greeter.instance.setGreeting(inputGreeting);
  //     console.log("setGreeting tx", tx);
  //     await tx.wait();
  //     const _message = await greeter.instance.greet();
  //     console.log("New greeting mined, result: ", _message);
  //     setMessage(_message);
  //     setInputGreeting("");
  //   }
  // };
  const Login = () => {
    const doAsync =  async () => {
      if (!suppllychain.instance) return;
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());
      console.log("SupplyChain is deployed at ", suppllychain.instance.address);
      
      // console.log("Supply chain admin is: ",  suppllychain.instance.signatoryRoles("0"));
      setMessage(await signer.getAddress());
    };
    doAsync();
  }



  return (
    <div>
      <p>{message}</p>
      <Button onClick={Login}>Prihlas sa</Button>
      {/* <input
        value={inputGreeting}
        onChange={(e) => setInputGreeting(e.target.value)}
      ></input>
      <button onClick={(e) => handleSetGreeting(e)}>Set greeting</button> */}
    </div>
  );
};