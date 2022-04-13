import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import metamaskLogin from './img/loginMetamask.png';
import { SupplyChainContext } from "./hardhat/SymfoniContext";
import { AdminDomain } from './components/AdminDomain';
import { EmployerDomain } from './components/EmployerDomain';
import { Footer } from './components/Footer';
import { HeaderMenu } from './components/HeaderMenu';
import { ethers } from 'ethers';
import './App.css';
import { ModalAlert } from './components/ModalAlert'


export const RoleContext = createContext("Any role");

const App = () => {
  const [loading, setLoading] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [signatoryLogin, setSignatoryLogin] = useState(false);
  const [supplierLogin, setSupplierLogin] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  let supplychain = useContext(SupplyChainContext);

  const resetAccount = () => {
    setCurrentAccount("");
  }

  const changeAccount = (account: string, loadingState: boolean) => {
    setCurrentAccount(account);
    setLoading(loadingState);
  }

  const login = async () => {
    setAdminLogin(false);
    setSignatoryLogin(false);
    setSupplierLogin(false);
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let signerAddress = await signer.getAddress();
    if(supplychain.instance) {
      let adminRole = await supplychain.instance.DEFAULT_ADMIN_ROLE();
      let signatorRole = await supplychain.instance.SIGNATORY_ROLE();
      let supplierRole = await supplychain.instance.SUPPLIER_ROLE();
      if(await supplychain.instance.hasRole(adminRole, signerAddress)){
        setAdminLogin(true);
        setLoading(false);
        setCurrentRole("admin")
      } else if(await supplychain.instance.hasRole(signatorRole, signerAddress)){
        setSignatoryLogin(true);
        setLoading(false);
        setCurrentRole("signatory")
      }else if(await supplychain.instance.hasRole(supplierRole, signerAddress)){
        setSupplierLogin(true);
        setLoading(false);
        setCurrentRole("supplier")
      }
      setCurrentAccount(signerAddress);
    }
  }

  useEffect(() => {
    setLoading(true);
  }, [supplychain]);

  return (
      <div className="App">
        {loading &&
        <div>
        <header className="App-header">
        <h1 className="appTitle">
          Prihlásenie do zásobovacieho systému
        </h1>
        </header>
        <div className='loginPage'><img src={metamaskLogin} alt="metamask_login" className='metamaskImage' id='loginImg' onClick={login}/></div></div>} 
       {currentAccount ? adminLogin === true ? <div><HeaderMenu changeAccount={changeAccount} currentAccount={currentAccount}></HeaderMenu><AdminDomain></AdminDomain><Footer></Footer></div>  :
                  signatoryLogin === true || supplierLogin === true  ? <RoleContext.Provider value={currentRole}> <div><HeaderMenu changeAccount={changeAccount} currentAccount={currentAccount}></HeaderMenu><EmployerDomain></EmployerDomain>
                                                                          <Footer></Footer></div>  </RoleContext.Provider> : 
                    <ModalAlert modalState={true} closeModal={resetAccount} type={"login"}></ModalAlert>
                  : <div></div>
       }
    </div>
  );
}

export default App;