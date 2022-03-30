import React, { useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Symfoni, SupplyChainContext, CurrentAddressContext } from "./hardhat/SymfoniContext";
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { FormCreateBatch } from './components/FormCreateBatch';
import { FormPrivillege } from './components/FormPrivillege';
import { FormStartStage } from './components/FormStartStage';
import { FormAddDocument } from './components/FormAddDocument';
import { TableOfBatches } from './components/TableOfBatches';
import { SupplyChain } from './components/SupplyChain';
import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';


const App = () => {
  let [loading, setLoading] = useState(false);
  let supplychain = useContext(SupplyChainContext);
  let currentAccount = useContext(CurrentAddressContext);


  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Logged account:", await signer.getAddress());

  }

  useEffect(() => {
    setLoading(true);
    console.log("SUPPLY INSTANCE: " + supplychain.instance);
  }, [supplychain]);


  return (

      <div className="App">
       <header className="App-header">
       <h1>
         Supply Chain
       </h1>
       <Button onClick={login}>Login</Button>
       {loading ? <TableOfBatches></TableOfBatches>
       : <div>Loading...</div>
       }
       {/* <Symfoni autoInit={true}>
        </Symfoni> */}
      {/* <TableOfBatches></TableOfBatches> */}
       {/* autoInit={true}  */}
       {/* <Symfoni autoInit={true}> */}
         {/* <SupplyChain></SupplyChain> */}
       {/* <Button onClick={renderGen}></Button> */}

           {/* <FormStartStage></FormStartStage> */}
         <FormCreateBatch></FormCreateBatch>
         {/* <FormAddDocument></FormAddDocument> */}
         {/* <FormPrivillege></FormPrivillege> */}
           {/* <SupplyChain></SupplyChain> */}
         {/* </Symfoni> */}
       </header>
    </div>


  );
}

export default App;





// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }