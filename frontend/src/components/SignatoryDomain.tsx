import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";

import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';



export const SignatoryDomain = () => {
    const [currentBatchId, setCurrentBatchId] = useState("");
    const [currentStageFee, setCurrentStageFee] = useState("");
    const [classComponentName, setClassComponentName] = useState("App");
    // const [formStartStage, setFormStartStage] = useState(false);
    const supplychain = useContext(SupplyChainContext);

    
    const selectBatch = (batchId: string, stageFee: string):void => {
        setCurrentBatchId(batchId);
        setCurrentStageFee(stageFee)
    }

    const changeClassName = (classComponentName: string):void => {
      setClassComponentName(classComponentName);
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
    <div>     
      <div className={classComponentName}>
        <TableOfSignatoryBatches changeClassName={changeClassName} selectBatch={selectBatch}></TableOfSignatoryBatches>
      </div>
      {currentBatchId && <FormStartStage selectBatch={selectBatch} currentBatchId={currentBatchId} currentStageFee={currentStageFee} changeClassName={changeClassName}></FormStartStage>}
  </div>

  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }