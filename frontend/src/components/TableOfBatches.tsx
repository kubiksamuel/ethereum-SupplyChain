import * as React from 'react';
import { Form, Button, Table, OverlayTrigger, Tooltip, Overlay } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxOpen, faFilter, faClipboardList } from '@fortawesome/free-solid-svg-icons'


import { useRef, useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";





interface Batch {
    batchId: string;
    productName: string;
    stageName: string;
    isFinished: boolean;
    stageCount: number;
    stageState: number;
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
    finishBatch: () => void;
    batchesType: string;
    selectBatch: (arg: string) => void;
    batchCounter: number;
    batchToFilter: string;
    showScanner: () => void
}

export const TableOfBatches: React.FC<TableOfBatchesProps> = ({finishBatch, batchesType, selectBatch, batchCounter, batchToFilter, showScanner}) => {
    const supplychain = useContext(SupplyChainContext);
    // const [currentBatchId, setCurrentBatchId] = useState("");
    const [batchList, setBatchList] = useState<Array<Batch>>([]);
    const [filteredBatchList, setFilteredBatchList] = useState<Array<Batch>>([]);
    // const [filterState, setFilterState] = useState(false);


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
      },[supplychain.instance, batchCounter]); 
      //

    useEffect(() => {
        console.log("Use effect batch id string: " + batchToFilter);
        filterRecords(batchToFilter);
    }, [batchToFilter])

    
    const filterRecords = (filterString: any) => {
        if (filterString === "") {
            // console.log(filterState)
            // setFilterState(false);
            setFilteredBatchList(batchList);
            console.log("Use effect if vetva");
        } else if(filterString != "") {
            console.log("Use effect else vetva");
            // setFilterState(true);
            const filtered = batchList.filter(batch => batch.batchId.indexOf(filterString) >= 0);
            setFilteredBatchList(filtered);  //This will trigger a re-render    
        }
    }


    const getBatchesItems = async () => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            const batchParsedList = [];
            const listLengthBN = await supplychain.instance.getListLength();
            const listLength = listLengthBN.toNumber();
            for(let i = 0; i < listLength; i++){
                let batchId = await supplychain.instance.listOfIds(i);
                let batch = await supplychain.instance.batches(batchId);
                let isFinished = batch.isFinished;
                let stageCount = batch.stageCount.toNumber()
                const stageState = (await supplychain.instance.batchStages(batchId, stageCount)).state;

                if((batchesType == "finished" && isFinished && stageState == 2) || (batchesType == "inProccess" && (!isFinished || stageState != 2))) {
                    let _productName = batch.productName.toString();
                    let stage = await supplychain.instance.batchStages(batchId, batch[3].toNumber());
                    let _stageName = stage.name;
                    let batchItem: Batch = {batchId: batchId, productName: _productName, stageName: _stageName.toString(), isFinished: isFinished,
                                            stageCount: stageCount, stageState: stageState}
                    batchParsedList.push(batchItem)
                    // console.log(stageName.name);
                    console.log(batch.batchId);
                } 


                // let currentStageName = await supplychain.instance.batchStages(batchId, )
            }
            setBatchList(batchParsedList);
            setFilteredBatchList(batchParsedList);
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
                finishBatch();
                // @ts-ignore
                console.log("Prevzaty balik s batch id:" , receipt.events[0].args[0]);
        } catch {
            console.log("Nastala neocakavana chyba");
        }
    }
};

    // const generateQrCanvas = () => {
    //     var el: HTMLElement = document.getElementById("qrCodeEl")!;
    //     let qrImage
    //     html2canvas(el).then(canvas => {
    //         qrImage = canvas; 
    //     });
    //     return qrImage
    // }


    return (
        <div className='Table'>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                    <th>ID šarže
                        <Button className='iconButtons' variant="light" onClick={() =>{showScanner()}}><FontAwesomeIcon size="lg" icon={faFilter}/></Button>               
                    </th>
                    <th>Názov produktu</th>
                    <th>Etapa</th>
                    <th>Akcie</th>
                    </tr>
                </thead>
                <tbody>
                {
                filteredBatchList.map(batch => (
                <tr key={batch.batchId}>
                    <td>{batch.batchId}</td>
                    <td>{batch.productName}</td>
                    <td>{batch.stageName}</td>
                    <td>
                    <div className='actions'>
                    <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip-top">
                        Prezrieť  <strong>etapy</strong>
                        </Tooltip>
                    }>
                        <Button className='iconButtons' variant="light" onClick={() =>{selectBatch(batch.batchId);}}><FontAwesomeIcon size="lg" icon={faClipboardList}/></Button>
                    </OverlayTrigger>

                   
                    {   
                        batch.isFinished && batch.stageState == 1 && 

                <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip-top">
                        Prevziať <strong>šaržu</strong>
                        </Tooltip>
                    }>
                        <Button className='iconButtons' variant="light" onClick={() =>{receiveFinishedBatch(batch.batchId, batch.stageCount);}}><FontAwesomeIcon size="lg" icon={faBoxOpen}/></Button>
                    </OverlayTrigger>  
                    }
                    </div>

                    </td>
                </tr>
                ))}
                </tbody>
            </Table> 
        </div>
    );
}

