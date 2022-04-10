import * as React from 'react';
import ReactDOM from "react-dom";
import { useRef, useContext, useState, useEffect } from "react";
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { ethers } from 'ethers';
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
    changeScannerState: () => void
}

export const TableOfSignatoryBatches: React.FC<TableOfSignatoryBatchesProps> = ({batchesType, selectBatch, changeClassName, changedSignatoryBatch,
        changeFormStartStageState, changeFormAddDocumentState, changeBatchListsLength, batchList, batchToFilter, changeScannerState}) => {
    const currentRole = useContext(RoleContext);
    const supplychain = useContext(SupplyChainContext);
    const [buttonTitle, setButtonTitle] = useState("");
    const [filteredBatchList, setFilteredBatchList] = useState<Array<Batch>>([]);
    const batchIdCell = useRef("");

    useEffect(() => {
        console.log("Use effect batch id string: " + batchToFilter);
        filterRecords(batchToFilter);
    }, [batchToFilter])

    const filterRecords = (filterString: any) => {
        if (filterString === "") {
            setFilteredBatchList(batchList);
            console.log("Use effect if vetva");
        } else if(filterString != "") {
            console.log("Use effect else vetva");
            const filtered = batchList.filter(batch => batch.batchId.indexOf(filterString) >= 0);
            setFilteredBatchList(filtered);
        }
    }

    return (
        <div className='Table'>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                    <th>ID šarže
                        <Button className='iconButtons' variant="light" onClick={() =>{changeScannerState()}}><FontAwesomeIcon size="lg" icon={faFilter}/></Button>               
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
                        <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id="tooltip-top">
                            Prevziať <strong>šaržu</strong> a odovzdať ďalej.  
                            </Tooltip>
                        }>
                            <Button className='iconButtons' variant="light" onClick={() =>{
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