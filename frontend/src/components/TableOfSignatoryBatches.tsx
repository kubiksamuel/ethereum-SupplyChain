import * as React from 'react';
import { Form, Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import * as usersGetter from '../functionality/UsersGetter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faPeopleCarryBox, faPenToSquare, faFilter } from '@fortawesome/free-solid-svg-icons';
import {RoleContext} from "../App";

interface Batch {
    batchId: string;
    productName: string;
    stageName: string;
    stageOrder: number;
    supplierFee: string;
    toProccess: boolean;
  }

interface TableOfSignatoryBatchesProps {
    batchesType: string;
    selectBatch: (currentBatchId: string, stageFee: string ) => void;
    changeClassName: (classComponentName: string) => void;
    changedSignatoryBatch: string;
    changeFormStartStageState: (showTable: boolean) => void;
    changeFormAddDocumentState: (showTable: boolean) => void;
    changeBatchListsLength: (inProccessBatchLength: number, finishedBatchLength: number) => void;
    batchList: Array<Batch>;
    batchToFilter: string;
    showScanner: () => void
}


export const TableOfSignatoryBatches: React.FC<TableOfSignatoryBatchesProps> = ({batchesType, selectBatch, changeClassName, changedSignatoryBatch,
     changeFormStartStageState, changeFormAddDocumentState, changeBatchListsLength, batchList, batchToFilter, showScanner}) => {
    const currentRole = useContext(RoleContext);
    const supplychain = useContext(SupplyChainContext);
    // const [currentBatchId, setCurrentBatchId] = useState("");
    // const [batchList, setBatchList] = useState<Array<Batch>>([]);
    const [buttonTitle, setButtonTitle] = useState("");
    const [filteredBatchList, setFilteredBatchList] = useState<Array<Batch>>([]);
    const batchIdCell = useRef("");

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


    // useEffect(() => {
    //     console.log("USEEFFECT V SIGNATORY");
    //     // while(!supplychain.instance){
    //     usersGetter.getBatchesItems(supplychain, currentRole).then((data) => {
    //         if(data) {
    //             setBatchList(data.batchList);
    //             changeBatchListsLength(data.inProccessBatchLength, data.finishedBatchLength)
    //         }
    //     });
    //     //  getBatchesItems();
    //   },[changedSignatoryBatch]); 



    //    const getBatchesItems = async () => {
    //     console.log("ASYNC");
    //     if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    //     if (supplychain.instance) {
    //         try{
    //             const batchParsedList = [];
    //             const listOfWaitingBatches = await supplychain.instance.getSignatoryView();
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
        <div className='Table'>
            {/* <Button onClick={getBatchesItems}>Submit console</Button> */}
            <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                <th>ID šarže
                    <Button className='iconButtons' variant="light" onClick={() =>{showScanner()}}><FontAwesomeIcon size="lg" icon={faFilter}/></Button>               
                </th>
                <th>Názov produktu</th>
                <th>Názov etapy</th>
                <th>Poradie etapy</th>
                <th>{currentRole == "signatory" ? "Poplatok za etapu" : "Odmena za etapu" }</th>
                <th>Akcie</th>
                </tr>
            </thead>
            <tbody>
            {
            filteredBatchList.map(batch => (
            ((batchesType == "finished" && batch.toProccess == false) || (batchesType=="inProccess" && batch.toProccess)) && 
            <tr key={batch.batchId}>
                <td>{batch.batchId}</td>
                <td>{batch.productName}</td>
                <td>{batch.stageName}</td>
                <td>{batch.stageOrder}</td>
                <td key={batch.productName} ><div>{ethers.utils.formatEther(batch.supplierFee)}</div></td>
                <td><div className='actions'>
                    <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip-top">
                        Prezrieť  <strong>etapy</strong>
                        </Tooltip>
                    }>
                        <Button className='iconButtons' variant="light" onClick={() =>{selectBatch(batch.batchId, batch.supplierFee);}}><FontAwesomeIcon size="lg" icon={faClipboardList}/></Button>
                    </OverlayTrigger>

                    
                    {batch.toProccess && currentRole == "signatory" ?
                //  <Button onClick={() =>{
                //     printBatchId(batch.batchId);
                //     selectBatch(batch.batchId, batch.supplierFee);    
                //     changeClassName("belowLayer");
                //     }}>Prevziať</Button>
                    
                    <OverlayTrigger
                    placement="top"
                    overlay={
                        <Tooltip id="tooltip-top">
                        Prevziať <strong>šaržu</strong> a odovzdať ďalej.  
                        </Tooltip>
                    }>
                        <Button className='iconButtons' variant="light" onClick={() =>{
                            printBatchId(batch.batchId);
                            selectBatch(batch.batchId, batch.supplierFee);    
                            changeClassName("belowLayer");
                            changeFormStartStageState(true);
                    }}><FontAwesomeIcon size="lg" icon={faPeopleCarryBox}/></Button>
                    </OverlayTrigger> : 
                                        batch.toProccess &&
                                        <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip id="tooltip-top">
                                            Pridať <strong>údaje o výrobe</strong> v danej etape.  
                                            </Tooltip>
                                        }>
                                            <Button className='iconButtons' variant="light" onClick={() =>{
                                                printBatchId(batch.batchId);
                                                selectBatch(batch.batchId, batch.supplierFee);    
                                                changeClassName("belowLayer");
                                                changeFormAddDocumentState(true);
                                        }}><FontAwesomeIcon size="lg" icon={faPenToSquare}/></Button>
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

// <td key="Questions" styles={{ background: value > 0.25 ? 'green' : 'red' }}>
// <td key="Questions" className={value > 0.25 ? 'greenclass' : 'redclass' }>


