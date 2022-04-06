import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSupplierBatches } from './TableOfSupplierBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";

import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
import { FormAddDocument } from './FormAddDocument';


export const SupplierDomain = () => {
    const [currentBatchId, setCurrentBatchId] = useState("");
    const [classComponentName, setClassComponentName] = useState("App");
    const supplychain = useContext(SupplyChainContext);
    
    const selectBatch = (batchId: string):void => {
        setCurrentBatchId(batchId);
    }  

    const changeClassName = (classComponentName: string):void => {
      setClassComponentName(classComponentName);
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
    <div>
      <div className={classComponentName}>
        <TableOfSupplierBatches selectBatch={selectBatch} changeClassName={changeClassName}></TableOfSupplierBatches>
      </div>
      {currentBatchId && <FormAddDocument currentBatchId={currentBatchId} selectBatch={selectBatch} changeClassName={changeClassName}></FormAddDocument> }
    </div>
  );
}

//QmeM1QANpBQPhovuHDaFeDdtcjhiYmSgSsAW2hRdkfD7jc   DOCHASH





// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }