import React, { useContext, useEffect, useRef, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { FormAddDocument } from './FormAddDocument';
import {EmployerInfohead} from './EmployerInfohead'
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import * as usersGetter from '../functionality/UsersGetter';
import {RoleContext} from "../App";
import { QrcodeReader } from './QrcodeReader';

import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
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



export const SignatoryDomain = () => {
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

    const showScanner = () => {
      setQrScannerState(true);
      // setBatchToFilter("none");
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
    usersGetter.getUsers(supplychain).then((gotUserList) => {
      if(gotUserList) {
        setUserList(gotUserList);
      }
    });
    usersGetter.getBatchesItems(supplychain, currentRole).then((data) => {
      if(data) {
          setBatchList(data.batchList);
          changeBatchListsLength(data.inProccessBatchLength, data.finishedBatchLength)
      }
  });
  },[supplychain.instance]); 

//   useEffect(() => {
//     // while(!supplychain.instance){
        
//     // }
//     getUsers();
//   },[supplychain.instance]); 

//  const getUsers = async () => {
//     if (!supplychain.instance) throw Error("SupplyChain instance not ready");
//     if (supplychain.instance) {
//         try{
//             const userParsedList = [];
//             const listLengthBN =  await supplychain.instance.roleId();
//             const listLength = listLengthBN.toNumber();
//             for(let i = 1; i <= listLength; i++){
//                 console.log("USERS: " + listLength);

//                 let signatoryRole: boolean;
//                 let supplierRole: boolean;
//                 const userAddress = await supplychain.instance.roles(i-1);
//                 if(await supplychain.instance.hasRole(await supplychain.instance.SIGNATORY_ROLE(), userAddress)) {
//                     signatoryRole = true;
//                 } else {
//                     signatoryRole = false;
//                 }
//                 if(await supplychain.instance.hasRole(await supplychain.instance.SUPPLIER_ROLE(), userAddress)) {
//                     supplierRole = true;
//                 } else {
//                     supplierRole = false;
//                 }
//                 const userInfo = await supplychain.instance.rolesInfo(userAddress);
//                 const userName = userInfo.name;
//                 const userId = userInfo.id;
//                 console.log("UserName " + userName);
//                 console.log("SignatoryRole " + signatoryRole);
//                 console.log("supplierRole " + supplierRole);
//                 console.log("UserAddress: " + userAddress )
//                 let newUser: User = {userId: userId.toNumber(), signatoryRole: signatoryRole, supplierRole: supplierRole, userName: userName,
//                     userAddress: userAddress}
//                 userParsedList.push(newUser)

//             }
//             // changeUserListState(userParsedList);
//             setUserList(userParsedList);

//         } catch {
//             console.log("Nastala neocakavana chyba");
//         }
//     }
//   };

  return (
    <div>
      {qrScannerState && <QrcodeReader changeBatchToFilter={changeBatchToFilter} ></QrcodeReader>}
      <EmployerInfohead inProccessBatchCounter={inProccessBatchCounter} finishedBatchCounter={finishedBatchCounter} changeClassName={changeClassName} resetState={resetState}
           changeTableFinishedBatchesState={changeTableFinishedBatchesState} changeTableInProccessBatchesState= {changeTableInProccessBatchesState}></EmployerInfohead>     
      <div className={classComponentName}>
      {currentBatchId && !formStartStage && !formAddDocument ?<StackOfStages selectedBatchId={currentBatchId}></StackOfStages> :
        tableInProccessBatches ? <TableOfSignatoryBatches showScanner={showScanner} batchToFilter={batchToFilter} batchesType={"inProccess"} changedSignatoryBatch={changedSignatoryBatch} changeClassName={changeClassName} selectBatch={selectBatch} batchList={batchList}
          changeFormStartStageState={changeFormStartStageState} changeFormAddDocumentState={changeFormAddDocumentState} changeBatchListsLength={changeBatchListsLength}></TableOfSignatoryBatches> :
          tableFinishedBatches ? <TableOfSignatoryBatches showScanner={showScanner} batchToFilter={batchToFilter} batchesType={"finished"} changedSignatoryBatch={changedSignatoryBatch} changeClassName={changeClassName} selectBatch={selectBatch} batchList={batchList}
          changeFormStartStageState={changeFormStartStageState} changeFormAddDocumentState={changeFormAddDocumentState} changeBatchListsLength={changeBatchListsLength}></TableOfSignatoryBatches> :
          <div></div>}
      </div>
      {currentBatchId && formStartStage && <FormStartStage setProccessedBatch={setProccessedBatch} userList={userList} selectBatch={selectBatch} currentBatchId={currentBatchId}
       currentStageFee={currentStageFee} changeClassName={changeClassName}  changeFormStartStageState={changeFormStartStageState}></FormStartStage>}
      {currentBatchId && formAddDocument &&<FormAddDocument setProccessedBatch={setProccessedBatch} currentBatchId={currentBatchId} 
                                                selectBatch={selectBatch} changeClassName={changeClassName}></FormAddDocument>}
  </div>

  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }