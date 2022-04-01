import * as React from 'react';
import { Form, Button, Table } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';



interface Batch {
    batchId: string;
    productName: string;
    stageName: string;
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

interface TableOfBatchesProps {
    selectBatch: (arg: string) => void
}

export const TableOfBatches: React.FC<TableOfBatchesProps> = ({selectBatch}) => {
    const supplychain = useContext(SupplyChainContext);
    const [currentBatchId, setCurrentBatchId] = useState("");
    const [batchList, setBatchList] = useState<Array<Batch>>([]);

    if(supplychain.instance){
        supplychain.instance.on("BatchCreated", (batchId, productName) => {
            setCurrentBatchId(batchId);
            console.log("Odchyteny event s argumentami: " + batchId, productName);
        });
    }

    useEffect(() => {
        // while(!supplychain.instance){
            
        // }
         getBatchesItems();
      },[supplychain.instance, currentBatchId]); 
      //


    const getBatchesItems = async () => {
    console.log("ASYNC");
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            const batchParsedList = [];
            const listLengthBN = await supplychain.instance.getListLength();
            const listLength = listLengthBN.toNumber();
            for(let i = 0; i < listLength; i++){
                let _batchId = await supplychain.instance.listOfIds(i);
                let batch = await supplychain.instance.batches(_batchId);
                let _productName = batch.productName.toString();
                let stage = await supplychain.instance.batchStages(_batchId, batch[3].toNumber());
                let _stageName = stage.name;
                let batchItem: Batch = {batchId: _batchId, productName: _productName, stageName: _stageName.toString()}
                batchParsedList.push(batchItem)
                // console.log(stageName.name);
                console.log(batch.batchId);

                // let currentStageName = await supplychain.instance.batchStages(batchId, )
            }
            setBatchList(batchParsedList);
        } catch {
            console.log("Nastala neocakavana chyba");
        }
    }
    };



    const printStages = async(batchId: string) => {
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
            try{
                const batchParsedList = [];
                const numberOfStages = ((await supplychain.instance.batches(batchId)).stageCount).toNumber();
                for(let i = 1; i <= numberOfStages; i++){
                    const stage = await supplychain.instance.batchStages(batchId, i);
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
                    // batchParsedList.push(batchItem)
                }
                // setBatchList(batchParsedList);
            } catch {
                console.log("Nastala neocakavana chyba");
            }
        }
    }


    const printBatchId = (batchId: string) => {
        console.log("Button: " + batchId);
     }

    // const [batchList, setBatchList] = useState(0);
    // const [newBatch , setNewBatch] = useState(0);


    return (
        <div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                    <th>ID šarže</th>
                    <th>Názov produktu</th>
                    <th>Etapa</th>
                    <th>Akcie</th>
                    </tr>
                </thead>
                <tbody>
                {
                batchList.map(batch => (
                <tr key={batch.batchId}>
                    <td>{batch.batchId}</td>
                    <td>{batch.productName}</td>
                    <td>{batch.stageName}</td>
                    <td><Button onClick={() =>{
                    printBatchId(batch.batchId);
                    selectBatch(batch.batchId);
            
                } 
                    } >Prevziať</Button></td>
                </tr>
                ))}
                </tbody>
            </Table> 
        </div>
    );
}
