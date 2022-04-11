import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { TableOfEmployerBatches } from './TableOfEmployerBatches';
import { FormStartStage } from './FormStartStage';
import { FormAddDocument } from './FormAddDocument';
import {EmployerInfohead} from './EmployerInfohead'
import { SupplyChainContext } from "../hardhat/SymfoniContext";
import * as getter from '../functionality/Getter';
import {RoleContext} from "../App";
import { QrcodeReader } from './QrcodeReader';
import { StackOfStages } from './StackOfStages';

interface User {
  userId: number;
  userAddress: string;
  userName: string;
  signatoryRole: boolean;
  supplierRole: boolean;
}

interface Batch {
  batchId: string;
  productName: string;
  stageName: string;
  stageOrder: number;
  supplierFee: string;
  toProccess: boolean;
}

export const EmployerDomain = () => {
    const currentRole = useContext(RoleContext);
    const [currentBatchId, setCurrentBatchId] = useState("");
    const [changedSignatoryBatch, setSignatoryChangedBatch] = useState("");
    const [currentStageFee, setCurrentStageFee] = useState("");
    const [batchToFilter, setBatchToFilter] = useState("");
    const [classComponentName, setClassComponentName] = useState("App");
    const [userList, setUserList] = useState<Array<User>>([]);
    const [formStartStage, setFormStartStage] = useState(false);
    const [formAddDocument, setFormAddDocument] = useState(false);
    const [inProccessBatchCounter, setInProccessBatchCounter] = useState(0);
    const [finishedBatchCounter, setFinishedBatchCounter] = useState(0);
    const supplychain = useContext(SupplyChainContext);
    const [tableInProccessBatches, setTableInProccessBatches] = useState(false);
    const [tableFinishedBatches, setTableFinishedBatches] = useState(false);
    const [qrScannerState, setQrScannerState] = useState(false);
    const [batchList, setBatchList] = useState<Array<Batch>>([]);


    const changeTableInProccessBatchesState = (showTable: boolean):void => {
      setTableInProccessBatches(showTable);
    }

    const changeTableFinishedBatchesState = (showTable: boolean):void => {
      setTableFinishedBatches(showTable);
    }

    const selectBatch = (batchId: string, stageFee: string):void => {
        setCurrentBatchId(batchId);
        setCurrentStageFee(stageFee)
    }

    const changeClassName = (classComponentName: string):void => {
      setClassComponentName(classComponentName);
    } 

    const changeBatchToFilter = (scannedBatch: string):void => {
      console.log("Prijaty result: " + scannedBatch);
      setBatchToFilter(scannedBatch);
      setQrScannerState(false);
    }

    const changeScannerState = () => {
      if(qrScannerState) {
        setQrScannerState(false);
      } else {
        setQrScannerState(true);
      }   
    }
  

    const setProccessedBatch = (batchId: string):void => {
      for(let i = 0 ; i < inProccessBatchCounter+finishedBatchCounter; i++){
        if(batchList[i].batchId === batchId){
          batchList[i].toProccess = false;
        }
      }
      setSignatoryChangedBatch(batchId);
      setInProccessBatchCounter(inProccessBatchCounter-1);
      setFinishedBatchCounter(finishedBatchCounter+1);
    }

    const changeFormStartStageState = (showForm: boolean):void => {
      setFormStartStage(showForm);
    } 

    const changeFormAddDocumentState = (showForm: boolean):void => {
      setFormAddDocument(showForm);
    } 

    const changeBatchListsLength = (inProccessBatchLength: number, finishedBatchLength: number):void => {
      setInProccessBatchCounter(inProccessBatchLength);
      setFinishedBatchCounter(finishedBatchLength);
    } 

  const resetState = () => {
      setQrScannerState(false);
      setFormAddDocument(false);
      setFormStartStage(false);
      changeTableFinishedBatchesState(false);
      setTableInProccessBatches(false);
      setBatchToFilter("");
      setCurrentBatchId("");
    } 

  useEffect(() => {        
    getter.getUsers(supplychain).then((gotUserList) => {
      if(gotUserList) {
        setUserList(gotUserList);
      }
    });
    getter.getEmployerBatchesItems(supplychain, currentRole).then((data) => {
      if(data) {
          setBatchList(data.batchList);
          changeBatchListsLength(data.inProccessBatchLength, data.finishedBatchLength)
      } 
    }); 
  },[]); 

  return (
    <div>
      {qrScannerState && <QrcodeReader changeBatchToFilter={changeBatchToFilter} ></QrcodeReader>}
      <EmployerInfohead inProccessBatchCounter={inProccessBatchCounter} finishedBatchCounter={finishedBatchCounter} changeClassName={changeClassName} resetState={resetState}
           changeTableFinishedBatchesState={changeTableFinishedBatchesState} changeTableInProccessBatchesState= {changeTableInProccessBatchesState}></EmployerInfohead>     
      <div className={classComponentName}>
      {currentBatchId && !formStartStage && !formAddDocument ?<StackOfStages selectedBatchId={currentBatchId}></StackOfStages> :
        tableInProccessBatches ? <TableOfEmployerBatches
       changeScannerState={changeScannerState} batchToFilter={batchToFilter} batchesType={"inProccess"} changedSignatoryBatch={changedSignatoryBatch} changeClassName={changeClassName} selectBatch={selectBatch} batchList={batchList}
          changeFormStartStageState={changeFormStartStageState} changeFormAddDocumentState={changeFormAddDocumentState} changeBatchListsLength={changeBatchListsLength}></TableOfEmployerBatches
        > :
          tableFinishedBatches ? <TableOfEmployerBatches
         changeScannerState={changeScannerState} batchToFilter={batchToFilter} batchesType={"finished"} changedSignatoryBatch={changedSignatoryBatch} changeClassName={changeClassName} selectBatch={selectBatch} batchList={batchList}
          changeFormStartStageState={changeFormStartStageState} changeFormAddDocumentState={changeFormAddDocumentState} changeBatchListsLength={changeBatchListsLength}></TableOfEmployerBatches
        > :
          <div></div>}
      </div>
      {currentBatchId && formStartStage && <FormStartStage setProccessedBatch={setProccessedBatch} userList={userList} selectBatch={selectBatch} currentBatchId={currentBatchId}
       currentStageFee={currentStageFee} changeClassName={changeClassName}  changeFormStartStageState={changeFormStartStageState}></FormStartStage>}
      {currentBatchId && formAddDocument &&<FormAddDocument setProccessedBatch={setProccessedBatch} currentBatchId={currentBatchId} 
                                                selectBatch={selectBatch} changeClassName={changeClassName}></FormAddDocument>}
  </div>

  );
}