import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { StageCard } from './StageCard';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";

import { Button, Stack } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';
import * as ipfs from '../functionality/Ipfs';


interface StackOfStagesProps {
    currentBatchId: string
}

interface Stage {
    stageName: string;
    stageOrder: number;
    supplierFee: string;
    dateReceive: string;
    dateDone: string;
    state: string;
    signatory: string;
    supplier: string;
    stageNotes: string;
}   

export const StackOfStages: React.FC<StackOfStagesProps> = ({currentBatchId}) => {
    // const [currentBatchId, setCurrentBatchId] = useState("");
    const supplychain = useContext(SupplyChainContext);
    const [stageList, setStageList] = useState<Array<Stage>>([]);


    
//     const selectBatch = (batchId: string):void => {
//         setCurrentBatchId(batchId);
//    }

    useEffect(() => {
    // while(!supplychain.instance){
        
    // }
     printStages();
  },[]); 

//    if(supplychain.instance){
//     supplychain.instance.on("StageCompleted", (batchId, stageName) => {
//         if(batchId == currentBatchId) {
//           setCurrentBatchId("");
//         }
//         console.log("Odchyteny event s argumentami: " + batchId, stageName);
//     });
// }    

const printStages = async() => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            const stageParsedList = [];
            const numberOfStages = ((await supplychain.instance.batches(currentBatchId)).stageCount).toNumber();
            for(let i = 1; i <= numberOfStages; i++){
                const stage = await supplychain.instance.batchStages(currentBatchId, i);
                let stageName = stage.name;
                let stageOrder = stage.id.toNumber();
                let supplierFee = stage.supplierFee.toString();
                let dateReceive = stage.dateReceive.toString();
                let dateDone = stage.dateDone.toString();
                let state = stage.state == 0? "Vybavuje sa" : stage.state == 1 ? "Vybavene, caka na prevzatie"  : "Ukoncene";
                let signatory = stage.signatory.toString();
                let supplier = stage.supplier.toString();
                let stageNotes = "";
                if(stage.state != 0) {
                    stageNotes = await ipfs.getFromIPFS(stage.docHash);
                }
                let stageItem: Stage = {stageName: stageName, stageOrder: stageOrder, supplierFee: supplierFee, dateReceive: dateReceive, dateDone: dateDone,
                                            state: state, signatory: signatory, supplier: supplier, stageNotes: stageNotes};
                
                console.log(Object.entries(stageItem).flat())        
                stageParsedList.push(stageItem)
            }
            setStageList(stageParsedList);
        } catch {
            console.log("Nastala neocakavana chyba");
        }
    }
}

  return (
    <Stack gap={3}>
        {stageList.map(stage => (
        <StageCard key={stage.stageOrder} stage={stage}></StageCard>
        ))}
     </Stack>
        // <Button onClick={printStages}></Button>
  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }