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
    stageOrder: number;
    supplierFee: string;
  }


export const TableOfSupplierBatches = () => {
    const supplychain = useContext(SupplyChainContext);
    const [currentBatchId, setCurrentBatchId] = useState("");
    const [batchList, setBatchList] = useState<Array<Batch>>([]);
    const [buttonTitle, setButtonTitle] = useState("");

    // if(supplychain.instance){
    //     supplychain.instance.on("BatchCreated", (batchId, productName) => {
    //         setCurrentBatchId(batchId);
    //         console.log("Odchyteny event s argumentami: " + batchId, productName);
    //     });
    // }

    // useEffect(() => {
    //     // while(!supplychain.instance){
            
    //     // }
    //      getBatchesItems();
    //   },[supplychain.instance, currentBatchId]); 
      //


       const getBatchesItems = async () => {
        console.log("ASYNC");
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
            try{
                const batchParsedList = [];
                const listOfWaitingBatches = await supplychain.instance.getSupplierView();
                for(let i = 0; i < listOfWaitingBatches.length; i++){
                    let batch = listOfWaitingBatches[i];
                    console.log("Batch" + i + ":" + listOfWaitingBatches[i]);
                    let batchId = batch.batchId;
                    let productName = batch.productName;
                    let stageName = batch.stageName;
                    let stageOrder = batch.stage.toNumber();
                    let supplierFee = batch.supplierFee.toString();
                    let batchItem: Batch = {batchId: batchId, productName: productName, stageOrder: stageOrder, stageName: stageName, supplierFee: supplierFee};
                    console.log("Batch: " + batchItem);
                    batchParsedList.push(batchItem)

                    // let batch = await supplychain.instance.batches(_batchId);
                    // let _productName = batch.productName.toString();
                    // let stage = await supplychain.instance.batchStages(_batchId, batch[3].toNumber());
                    // let _stageName = stage.name;
                    // let batchItem: Batch = {batchId: _batchId, productName: _productName, stageName: _stageName.toString()}
                    // console.log(stageName.name);

                    // const batchToReceive = await supplychain.connect(signatory2).getSignatoryView();
                    // expect(batchToReceive.length).to.equal(2);
                
                    // expect(batchToReceive[0].batchId).to.equal(batchId);
                    // expect(batchToReceive[0].productName).to.equal(productName);
                    // expect(batchToReceive[0].stageName).to.equal(stage2Name);
                    // expect(batchToReceive[0].stage).to.equal(2);
                    // expect(batchToReceive[0].supplierFee).to.equal(ethers.utils.parseEther("1"));

                    // let currentStageName = await supplychain.instance.batchStages(batchId, )
                }
                setBatchList(batchParsedList);
            } catch {
                console.log("Nastala neocakavana chyba");
            }
        }
     };

     const printBatchId = (batchId: string) => {
        console.log("Button: " + batchId);
     }

//0x3a29d55240ac7bee227031e99145c06379bc38eccc9fd284e379afdd74ba3e62
//0xdc0139ade58967564f05e409f527e73079686e7b21fade2366fbc1f526a6b16d

    // const [batchList, setBatchList] = useState(0);
    // const [newBatch , setNewBatch] = useState(0);


    return (
        <div>
            <Button onClick={getBatchesItems}>Submit console</Button>
            <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                <th>ID šarže</th>
                <th>Názov produktu</th>
                <th>Názov etapy</th>
                <th>Poradie etapy</th>
                <th>Platba za etapu</th>
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
                <td>{batch.stageOrder}</td>
                <td>{batch.supplierFee}</td>
                <td><Button onClick={() => printBatchId(batch.batchId)} >Vybaviť</Button></td>
            </tr>
            ))}
            </tbody>
            </Table>
        </div>
    );
}


