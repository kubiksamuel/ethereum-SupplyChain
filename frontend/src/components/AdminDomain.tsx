import React from 'react';
import ReactDOM from "react-dom";
import { useContext, useEffect, useState } from 'react';
import { FormPrivillege } from './FormPrivillege';
import { FormCreateBatch } from './FormCreateBatch';
import { AdminInfohead } from './AdminInfohead';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import * as getter from '../functionality/Getter';
import { QrcodeReader } from './QrcodeReader';
import { StackOfStages } from './StackOfStages';
import { TableOfBatches } from './TableOfBatches';
import { TableOfUsers } from './TableOfUsers';

interface User {
  userId: number;
  userAddress: string;
  userName: string;
  signatoryRole: boolean;
  supplierRole: boolean;
}

export const AdminDomain = () => {
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [formPrivillege, setFormPrivillege] = useState(false);
    const [formCreateBatch, setFormCreateBatch] = useState(false);
    const [tableFinishedBatches, setTableFinishedBatches] = useState(false);
    const [tableInProccessBatches, setTableInProccessBatches] = useState(false);
    const [tableUsers, setTableUsers] = useState(false);
    const [qrScannerState, setQrScannerState] = useState(false);
    const [inProccessBatchCounter, setInProccessBatchCounter] = useState(0);
    const [finishedBatchCounter, setFinishedBatchCounter] = useState(0);
    const [userCounter, setUserCounter] = useState(0);
    const [classComponentName, setClassComponentName] = useState("App");
    const [batchToFilter, setBatchToFilter] = useState("");
    const [userList, setUserList] = useState<Array<User>>([]);
    const supplychain = useContext(SupplyChainContext);


    useEffect(() => {
      getter.getListsLength(supplychain).then((listsLength) => {
        if(listsLength) {
          setInProccessBatchCounter(listsLength[0]);
          setFinishedBatchCounter(listsLength[1])
          setUserCounter(listsLength[2]);
        }
      });
    },[]); 

    useEffect(() => {
      getter.getUsers(supplychain).then((gotUserList) => {
        if(gotUserList) {
          setUserList(gotUserList);
        }
      });
    },[userCounter]); 

  const selectBatch = (batchId: string):void => {
    setSelectedBatchId(batchId);
  }

  const changeFormCreateBatchState = (showForm: boolean):void => {
    setFormCreateBatch(showForm);
  } 

  const changeFormPrivillegeState = (showForm: boolean):void => {
    setFormPrivillege(showForm);
  }

  const changeTableUsersState = (showTable: boolean):void => {
    setTableUsers(showTable);
  } 

  const changeTableFinishedBatchesState = (showTable: boolean):void => {
    setTableFinishedBatches(showTable);
  }

  const changeTableInProccessBatchesState = (showTable: boolean):void => {
    setTableInProccessBatches(showTable);
  }

  const changeUserListState = (currentUserList: Array<User>):void => {
    setUserList(currentUserList);
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

  const addInProccessBatchCounter = ():void => {
    setInProccessBatchCounter(inProccessBatchCounter+1);
  }

  const addUserCounter = ():void => {
      setUserCounter(userCounter+1);
  }

  const finishBatch = (): void => {
    setFinishedBatchCounter(finishedBatchCounter+1);
    setInProccessBatchCounter(inProccessBatchCounter-1);
  }

  const resetState = () => {
    setQrScannerState(false);
    setBatchToFilter("");
    setFormCreateBatch(false);
    setFormPrivillege(false);
    changeTableFinishedBatchesState(false);
    setTableInProccessBatches(false);
    setSelectedBatchId("");
  } 

  const changeClassName = (classComponentName: string):void => {
      setClassComponentName(classComponentName);
  }

  return (
    <div>
      <div className={classComponentName}>
        {qrScannerState && <div className="qrReader"><QrcodeReader changeBatchToFilter={changeBatchToFilter} ></QrcodeReader></div>}
        <AdminInfohead changeFormCreateBatchState={changeFormCreateBatchState} changeFormPrivillegeState={changeFormPrivillegeState} changeClassName={changeClassName} 
        inProccessBatchCounter={inProccessBatchCounter} changeTableInProccessBatchesState={changeTableInProccessBatchesState} finishedBatchCounter={finishedBatchCounter} userCounter={userCounter} resetState={resetState}
          changeTableUsersState={changeTableUsersState} changeTableFinishedBatchesState={changeTableFinishedBatchesState} selectBatch={selectBatch}></AdminInfohead>
        {selectedBatchId ? <StackOfStages selectedBatchId={selectedBatchId}></StackOfStages> :
        tableInProccessBatches ? <div><TableOfBatches changeScannerState={changeScannerState} batchToFilter={batchToFilter} finishBatch={finishBatch} batchesType={"inProccess"}  batchCounter={inProccessBatchCounter} selectBatch={selectBatch}></TableOfBatches></div> :
        tableFinishedBatches ? <div><TableOfBatches changeScannerState={changeScannerState} batchToFilter={batchToFilter} finishBatch={finishBatch} batchesType={"finished"} batchCounter={finishedBatchCounter} selectBatch={selectBatch}></TableOfBatches></div> :
        tableUsers ? <TableOfUsers userList={userList} changeUserListState={changeUserListState} userCounter={userCounter}></TableOfUsers> : <div></div>
        }
      </div>
      {formPrivillege && <FormPrivillege addUserCounter={addUserCounter}  changeFormPrivillegeState={changeFormPrivillegeState} changeClassName={changeClassName}></FormPrivillege>}
      {formCreateBatch && <FormCreateBatch addInProccessBatchCounter={addInProccessBatchCounter} userList={userList} changeFormCreateBatchState={changeFormCreateBatchState} changeClassName={changeClassName}></FormCreateBatch>}
    </div>
  );
}