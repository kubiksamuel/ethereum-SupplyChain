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

interface TableOfSignatoryBatchesProps {
    selectBatch: (currentBatchId: string, stageFee: string ) => void;
    changeClassName: (classComponentName: string) => void;
}


export const TableOfSignatoryBatches: React.FC<TableOfSignatoryBatchesProps> = ({selectBatch, changeClassName}) => {
    const supplychain = useContext(SupplyChainContext);
    // const [currentBatchId, setCurrentBatchId] = useState("");
    const [batchList, setBatchList] = useState<Array<Batch>>([]);
    const [buttonTitle, setButtonTitle] = useState("");
    const batchIdCell = useRef("");

    // if(supplychain.instance){
    //     supplychain.instance.on("BatchCreated", (batchId, productName) => {
    //         setCurrentBatchId(batchId);
    //         console.log("Odchyteny event s argumentami: " + batchId, productName);
    //     });
    // }

    useEffect(() => {
        // while(!supplychain.instance){
            
        // }
         getBatchesItems();
      },[supplychain.instance]); 



       const getBatchesItems = async () => {
        console.log("ASYNC");
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
            try{
                const batchParsedList = [];
                const listOfWaitingBatches = await supplychain.instance.getSignatoryView();
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


    return (
        <div>
            {/* <Button onClick={getBatchesItems}>Submit console</Button> */}
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
                <td>{batch.batchId.slice(0,14)}...</td>
                <td>{batch.productName}</td>
                <td>{batch.stageName}</td>
                <td>{batch.stageOrder}</td>
                <td key={batch.productName} ><div className={"pinkClass"}>{ethers.utils.formatEther(batch.supplierFee)}</div></td>
                <td><Button onClick={() =>{
                    printBatchId(batch.batchId);
                    selectBatch(batch.batchId, batch.supplierFee);    
                    changeClassName("belowLayer");
                    }}>Prevziať</Button></td>
            </tr>
            ))}
            </tbody>
            </Table>
        </div>
    );
}

// <td key="Questions" styles={{ background: value > 0.25 ? 'green' : 'red' }}>
// <td key="Questions" className={value > 0.25 ? 'greenclass' : 'redclass' }>


