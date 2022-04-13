import * as React from 'react';
import { useContext, useState, useEffect } from "react";
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { SupplyChainContext } from "../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faFilter, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { ModalAlert } from './ModalAlert';
import { ContractReceipt, ContractTransaction } from 'ethers';

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
    batchList : Array<Batch>;
    finishBatch: () => void;
    batchesType: string;
    selectBatch: (arg: string) => void;
    batchToFilter: string;
    changeScannerState: () => void
}

export const TableOfBatches: React.FC<TableOfBatchesProps> = ({ batchList, finishBatch, batchesType, selectBatch, batchToFilter, changeScannerState}) => {
    const supplychain = useContext(SupplyChainContext);
    const [filteredBatchList, setFilteredBatchList] = useState<Array<Batch>>([]);
    const [modalState, setModalState] = useState(false);

    const closeModal = () => setModalState(false);

    useEffect(() => {
         setFilteredBatchList(batchList);
      },[batchList]); 

    useEffect(() => {
        filterRecords(batchToFilter);
    }, [batchToFilter])

    const filterRecords = (filterString: any) => {
        if (filterString === "") {
            setFilteredBatchList(batchList);
        } else if(filterString !== "") {
            const filtered = batchList.filter(batch => batch.batchId.indexOf(filterString) >= 0);
            setFilteredBatchList(filtered);
        }
    }

    const receiveFinishedBatch = async (batchId: string, stageCount: number) => {
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
            try{
                let supplierFee = (await supplychain.instance.batchStages(batchId, stageCount)).supplierFee;
                let completeFinalStageTx: ContractTransaction;
                    completeFinalStageTx = await supplychain.instance.completeFinalStage(batchId, {value: supplierFee});
                    const receipt: ContractReceipt = await completeFinalStageTx.wait();
                    finishBatch();
            } catch {
                setModalState(true);
            }
        }
    };

    return (
        <div>
            <div className='Table'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th>ID šarže
                            <Button className='iconButtons' variant="light" onClick={() =>{changeScannerState()}}><FontAwesomeIcon size="lg" icon={faFilter}/></Button>               
                        </th>
                        <th>Názov produktu</th>
                        <th>Etapa</th>
                        <th>Akcie</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                    filteredBatchList.map(batch => (
                    ((batchesType === "finished" && batch.isFinished && batch.stageState === 2) || (batchesType === "inProccess" && (!batch.isFinished || batch.stageState !== 2))) && 
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
                            batch.isFinished && batch.stageState === 1 && 

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
            <ModalAlert modalState={modalState} closeModal={closeModal} type={"transaction"}></ModalAlert>
        </div>
    );
}

