import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Symfoni } from "./hardhat/SymfoniContext";
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { FormCreateBatch } from './components/FormCreateBatch';
import { FormPrivillege } from './components/FormPrivillege';
import { FormStartStage } from './components/FormStartStage';
import { SupplyChain } from './components/SupplyChain';
import { FormAddDocument } from './components/FormAddDocument';
import { Button } from 'react-bootstrap';


function App() {

  return (
    <div className="App">
      <header className="App-header">
      <h1>
        Pridaj clena
      </h1>
        <Symfoni autoInit={true} >
          {/* <FormStartStage></FormStartStage> */}
        {/* <FormCreateBatch></FormCreateBatch> */}
        <FormAddDocument></FormAddDocument>
        {/* <FormPrivillege></FormPrivillege> */}
          <SupplyChain></SupplyChain>
        </Symfoni>
      </header>
    </div>
  );
}

export default App;