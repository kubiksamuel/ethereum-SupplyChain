import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { StageCard } from './StageCard';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import arrow from '../img/arrow.png';


import { Button, Stack } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import * as dateParser from '../functionality/DateParser';



interface StackOfStagesProps {
    currentBatchId: string
}

interface Stage {
    stageName: string;
    stageOrder: number;
    supplierFee: string;
    dateReceive: string;
    dateDone: string;
    state: number;
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

const parseDate = () => {

}

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
                let dateReceive = dateParser.parseDate(stage.dateReceive.toNumber());

                let dateDone =  dateParser.parseDate(stage.dateDone.toNumber());
                let state = stage.state;
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
       {/* <img src={arrow} alt="arrow"/> */}
     </Stack>
        // <Button onClick={printStages}></Button>
  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }