import React, { createContext, useContext, useEffect, useState } from 'react';
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
import { Footer } from './components/Footer';
// import { QrcodeReader } from './components/QrcodeReader';
// import { QrReader } from 'react-qr-reader';


import * as ipfs from './functionality/Ipfs';

import { HeaderMenu } from './components/HeaderMenu';
import { TableOfSignatoryBatches } from './components/TableOfSignatoryBatches';
import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
import { AdminDomain } from './components/AdminDomain';
import Identicon from 'identicon.js';


export const RoleContext = createContext("Any role");


const App = () => {
  const signerAddress = useContext(CurrentAddressContext)[0];
  const [loading, setLoading] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [signatoryLogin, setSignatoryLogin] = useState(false);
  const [supplierLogin, setSupplierLogin] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  let supplychain = useContext(SupplyChainContext);


  const changeAccount = (account: string, loadingState: boolean) => {
    setCurrentAccount(account);
    setLoading(loadingState);
  }



  const login = async () => {
    //Ked sa budem chciet prihlasit este raz
    setAdminLogin(false);
    setSignatoryLogin(false);
    setSupplierLogin(false);
    console.log("LOGIIIN");

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let signerAddress = await signer.getAddress();
    console.log(currentAccount + "  ==  " + signerAddress);
    if(supplychain.instance) {
      let adminRole = await supplychain.instance.DEFAULT_ADMIN_ROLE();
      let signatorRole = await supplychain.instance.SIGNATORY_ROLE();
      let supplierRole = await supplychain.instance.SUPPLIER_ROLE();
      if(await supplychain.instance.hasRole(adminRole, signerAddress)){
        console.log("Account has Admin Role")
        setAdminLogin(true);
        setLoading(false);
        setCurrentRole("admin")
      } else if(await supplychain.instance.hasRole(signatorRole, signerAddress)){
        console.log("Account has Signatory Role")
        setSignatoryLogin(true);
        setLoading(false);
        setCurrentRole("signatory")
      }else if(await supplychain.instance.hasRole(supplierRole, signerAddress)){
        console.log("Account has Supplier Role")
        setSupplierLogin(true);
        setLoading(false);
        setCurrentRole("supplier")
      }
      setCurrentAccount(signerAddress);

    }


    console.log("Logged account:", signerAddress);
  }

  useEffect(() => {
    setLoading(true);
    console.log("SUPPLY INSTANCE: " + supplychain.instance);
  }, [supplychain]);

  return (

      <div className="App">
       {/* <header className="App-header">
       <h1>
         Supply Chain
       </h1> */}
       {loading && <div className='loginPage'><h2>Prihlásenie do zásobovacieho systému</h2><img src={metamaskLogin} alt="metamask_login" className='metamaskImage' id='loginImg' onClick={login}/></div>} 


       {currentAccount ? adminLogin === true ? <div><HeaderMenu changeAccount={changeAccount} currentAccount={currentAccount}></HeaderMenu><AdminDomain></AdminDomain><Footer></Footer></div>  :
                  signatoryLogin === true || supplierLogin === true  ? <RoleContext.Provider value={currentRole}> <div><HeaderMenu changeAccount={changeAccount} currentAccount={currentAccount}></HeaderMenu><SignatoryDomain></SignatoryDomain>
                                                                          <Footer></Footer></div>  </RoleContext.Provider> : 
                  // supplierLogin === true ? <div><HeaderMenu changeAccount={changeAccount} currentAccount={currentAccount}></HeaderMenu><SupplierDomain></SupplierDomain><Footer></Footer></div>  :
                  <div className="alert alert-warning" role="alert">Neexistuje žiadna rola pre adresu {currentAccount}. <br/> Zmeňte účet v Metamask peňaženke.</div>
                  : <div></div>
       }
       {/* || supplierLogin == true */}
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
       {/* </header> */}
    </div>


  );
}

export default App;





// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }