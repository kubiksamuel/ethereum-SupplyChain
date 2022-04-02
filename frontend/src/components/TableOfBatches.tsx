import * as React from 'react';
import { Form, Button, Table } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons'


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
    isFinished: boolean;
    stageCount: number;
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
                let isFinished = batch.isFinished;
                let stageCount = batch.stageCount.toNumber()
                let batchItem: Batch = {batchId: _batchId, productName: _productName, stageName: _stageName.toString(), isFinished: isFinished,
                                        stageCount: stageCount}
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

const receiveFinishedBatch = async (batchId: string, stageCount: number) => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            let supplierFee = (await supplychain.instance.batchStages(batchId, stageCount)).supplierFee;
            let completeFinalStageTx: ContractTransaction;
                completeFinalStageTx = await supplychain.instance.completeFinalStage(batchId, {value: supplierFee});
                const receipt: ContractReceipt = await completeFinalStageTx.wait();
                // @ts-ignore
                console.log("Prevzaty balik s batch id:" , receipt.events[0].args[0]);
        } catch {
            console.log("Nastala neocakavana chyba");
        }
    }
};


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
                    <td><FontAwesomeIcon onClick={() =>{
                            selectBatch(batch.batchId);
                        } 
                            } icon={faClipboardList} />
                    {
                        batch.isFinished && <FontAwesomeIcon onClick={() =>{
                            receiveFinishedBatch(batch.batchId, batch.stageCount);
                        } 
                            } icon={faBoxOpen} />
                    }
                    </td>
                </tr>
                ))}
                </tbody>
            </Table> 
        </div>
    );
}
