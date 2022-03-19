import React, { useContext, useEffect, useState } from "react";
import { SupplyChainContext } from "./../hardhat/SymfoniContext";

interface Props {}

export const SupplyChain: React.FC<Props> = () => {
  const suppllychain = useContext(SupplyChainContext);
  const [currentAddress, setCurrentAddress] = useState("");
  const [message, setMessage] = useState("");
  // const [inputGreeting, setInputGreeting] = useState("");
  useEffect(() => {
    const doAsync = async () => {
      if (!suppllychain.instance) return;
      console.log("SupplyChain is deployed at ", suppllychain.instance.address);
      setMessage(await suppllychain.instance.DEFAULT_ADMIN_ROLE());
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
  return (
    <div>
      <p>{message}</p>
      {/* <input
        value={inputGreeting}
        onChange={(e) => setInputGreeting(e.target.value)}
      ></input>
      <button onClick={(e) => handleSetGreeting(e)}>Set greeting</button> */}
    </div>
  );
};