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


export const TableOfBatches = () => {
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




    // const [batchList, setBatchList] = useState(0);
    // const [newBatch , setNewBatch] = useState(0);


    return (
        <div>
            <Button type="button" onClick={getBatchesItems}>Submit</Button>

            <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                <th>ID šarže</th>
                <th>Názov produktu</th>
                <th>Etapa</th>
                {/* <th>Akcie</th> */}
                </tr>
            </thead>
            <tbody>
            {
            batchList.map(batch => (
            <tr key={batch.batchId}>
                <td>{batch.batchId}</td>
                <td>{batch.productName}</td>
                <td>{batch.stageName}</td>
            </tr>
            ))}
            </tbody>
            </Table>
        </div>
    );
}


