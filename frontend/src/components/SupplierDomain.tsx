import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSupplierBatches } from './TableOfSupplierBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";

import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';
import { FormAddDocument } from './FormAddDocument';


export const SupplierDomain = () => {
    const [currentBatchId, setCurrentBatchId] = useState("");
    const supplychain = useContext(SupplyChainContext);
    
    const selectBatch = (batchId: string):void => {
        setCurrentBatchId(batchId);
   }

   if(supplychain.instance){
    supplychain.instance.on("BatchStageDocumentAdded", (batchId, stageName, docHash) => {
        if(batchId == currentBatchId) {
          setCurrentBatchId("");
        }
        console.log("Odchyteny event s argumentami: " + batchId, stageName, docHash);
    });
}    

  return (
      <div className="App">
        {currentBatchId ? <FormAddDocument currentBatchId={currentBatchId}></FormAddDocument> :
        <TableOfSupplierBatches selectBatch={selectBatch}></TableOfSupplierBatches>
        }
        </div>
  );
}

//QmeM1QANpBQPhovuHDaFeDdtcjhiYmSgSsAW2hRdkfD7jc   DOCHASH





// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }