import * as React from 'react';
import { Form, Button, Table } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import * as usersGetter from '../functionality/UsersGetter';



interface Batch {
    batchId: string;
    productName: string;
    stageName: string;
    stageOrder: number;
    supplierFee: string;
    toProccess: boolean;
  }

interface TableOfSupplierBatchesProps {
    selectBatch: (arg: string) => void;
    changeClassName: (classComponentName: string) => void;
    changedSupplierBatch: string;
}


export const TableOfSupplierBatches: React.FC<TableOfSupplierBatchesProps> = ({selectBatch, changeClassName, changedSupplierBatch}) => {
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
        usersGetter.getBatchesItems(supplychain, "supplier").then((batchParsedList) => {
            if(batchParsedList) {
                setBatchList(batchParsedList);

            }
        });
        //  getBatchesItems();
      },[changedSupplierBatch]); 



    //    const getBatchesItems = async () => {
    //     console.log("ASYNC");
    //     if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    //     if (supplychain.instance) {
    //         try{
    //             const batchParsedList = [];
    //             const listOfWaitingBatches = await supplychain.instance.getSupplierView();
    //             for(let i = 0; i < listOfWaitingBatches.length; i++){
    //                 let batch = listOfWaitingBatches[i];
    //                 console.log("Batch" + i + ":" + listOfWaitingBatches[i]);
    //                 let batchId = batch.batchId;
    //                 let productName = batch.productName;
    //                 let stageName = batch.stageName;
    //                 let stageOrder = batch.stage.toNumber();
    //                 let supplierFee = batch.supplierFee.toString();
    //                 let toProccess = batch.toProccess;
    //                 let batchItem: Batch = {batchId: batchId, productName: productName, stageOrder: stageOrder, stageName: stageName, supplierFee: supplierFee,
    //                     toProccess: toProccess};
    //                 console.log("Batch: " + batchItem);
    //                 batchParsedList.push(batchItem)
    //             }
    //             setBatchList(batchParsedList);
    //         } catch {
    //             console.log("Nastala neocakavana chyba");
    //         }
    //     }
    //  };

     const printBatchId = (batchId: string) => {
        console.log("Button: " + batchId);
     }


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
                <th>Odmena za etapu</th>
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
                <td key={batch.productName} ><div className={"pinkClass"}>{ethers.utils.formatEther(batch.supplierFee)}</div></td>
                <td>{batch.toProccess && <Button onClick={() =>{
                    printBatchId(batch.batchId);
                    selectBatch(batch.batchId);
                    changeClassName("belowLayer");
                } 
                    } >Vybaviť</Button>}
                    </td>
            </tr>
            ))}
            </tbody>
            </Table>
        </div>
    );
}

// <td key="Questions" styles={{ background: value > 0.25 ? 'green' : 'red' }}>
// <td key="Questions" className={value > 0.25 ? 'greenclass' : 'redclass' }>


