import React, { useContext, useEffect, useState } from 'react';
import logo from './logo.svg';
import metamaskLogin from './img/loginMetamask.png';
import './App.css';
import { Symfoni, SupplyChainContext, CurrentAddressContext, ProviderContext } from "./hardhat/SymfoniContext";
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { FormCreateBatch } from './components/FormCreateBatch';
import { FormPrivillege } from './components/FormPrivillege';
import { FormStartStage } from './components/FormStartStage';
import { FormAddDocument } from './components/FormAddDocument';
import { TableOfBatches } from './components/TableOfBatches';
import { SignatoryDomain } from './components/SignatoryDomain';
import { SupplierDomain } from './components/SupplierDomain';
import * as ipfs from './functionality/Ipfs';


import { TableOfSignatoryBatches } from './components/TableOfSignatoryBatches';
import { SupplyChain } from './components/SupplyChain';
import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';
import { AdminDomain } from './components/AdminDomain';


const App = () => {
  let [loading, setLoading] = useState(false);
  let [adminLogin, setAdminLogin] = useState(false);
  let [signatoryLogin, setSignatoryLogin] = useState(false);
  let [supplierLogin, setSupplierLogin] = useState(false);
  let supplychain = useContext(SupplyChainContext);
  let currentAccount = useContext(CurrentAddressContext);



  const login = async () => {
    //Ked sa budem chciet prihlasit este raz
    setAdminLogin(false);
    setSignatoryLogin(false);
    setSupplierLogin(false);
    const ipfsString =  await ipfs.getFromIPFS("QmeM1QANpBQPhovuHDaFeDdtcjhiYmSgSsAW2hRdkfD7jc");



    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let signerAddress = await signer.getAddress();
    if(supplychain.instance) {
      let adminRole = await supplychain.instance.DEFAULT_ADMIN_ROLE();
      let signatorRole = await supplychain.instance.SIGNATORY_ROLE();
      let supplierRole = await supplychain.instance.SUPPLIER_ROLE();
      if(await supplychain.instance.hasRole(adminRole, signerAddress)){
        console.log("Account has Admin Role")
        setAdminLogin(true);
      } else if(await supplychain.instance.hasRole(signatorRole, signerAddress)){
        console.log("Account has Signatory Role")
        setSignatoryLogin(true);
      }else if(await supplychain.instance.hasRole(supplierRole, signerAddress)){
        console.log("Account has Supplier Role")
        setSupplierLogin(true);
      }
    }
    
    console.log("Logged account:", signerAddress);


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
       <img src={metamaskLogin} alt="metamask_login" className='metamaskImage' onClick={login}/>

       {loading ? adminLogin === true ? <AdminDomain></AdminDomain> :
                  signatoryLogin === true ? <SignatoryDomain></SignatoryDomain> : 
                  supplierLogin === true ? <SupplierDomain></SupplierDomain> :
                  <div>Neexistuje rola pre dany ucet</div>
       : <div>Loading...</div>
       }
       {/* <Symfoni autoInit={true}>
        </Symfoni> */}
      {/* <TableOfBatches></TableOfBatches> */}
       {/* autoInit={true}  */}
       {/* <Symfoni autoInit={true}> */}
       {/* <SignatoryDomain></SignatoryDomain> */}
         {/* <SupplyChain></SupplyChain> */}
       {/* <Button onClick={renderGen}></Button> */}
          {/* <TableOfSignatoryBatches></TableOfSignatoryBatches> */}
           {/* <FormStartStage></FormStartStage> */}
         {/* <FormCreateBatch></FormCreateBatch> */}
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