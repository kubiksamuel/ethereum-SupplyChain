import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";

import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';


export const SignatoryDomain = () => {
    const [currentBatchId, setCurrentBatchId] = useState("");
    const supplychain = useContext(SupplyChainContext);

    
    const selectBatch = (batchId: string):void => {
        setCurrentBatchId(batchId);
   }

   if(supplychain.instance){
    supplychain.instance.on("StageCompleted", (batchId, stageName) => {
        if(batchId == currentBatchId) {
          setCurrentBatchId("");
        }
        console.log("Odchyteny event s argumentami: " + batchId, stageName);
    });
}    

  return (
      <div className="App">
        {currentBatchId ? <FormStartStage currentBatchId={currentBatchId}></FormStartStage> :
        <TableOfSignatoryBatches selectBatch={selectBatch}></TableOfSignatoryBatches>
        }
        </div>
  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }