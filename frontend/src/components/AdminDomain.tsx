import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormPrivillege } from './FormPrivillege';
import { FormCreateBatch } from './FormCreateBatch';
import { AdminInfohead } from './AdminInfohead';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import { HeaderMenu } from './HeaderMenu';

import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
import { StackOfStages } from './StackOfStages';
import { TableOfBatches } from './TableOfBatches';
import { TableOfUsers } from './TableOfUsers';


export const AdminDomain = () => {
    const [selectedBatchId, setSelectedBatchId] = useState("");
    const [formPrivillege, setFormPrivillege] = useState(false);
    const [formCreateBatch, setFormCreateBatch] = useState(false);
    const [tableBatches, setTableBatches] = useState(false);
    const [tableUsers, setTableUsers] = useState(false);
    const [batchCounter, setBatchCounter] = useState(0);
    const [userCounter, setUserCounter] = useState(0);
    const [classComponentName, setClassComponentName] = useState("App");
    const supplychain = useContext(SupplyChainContext);


    useEffect(() => {
       getListsLength();
    },[]); 

      const getListsLength = async () => {
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
            try{
                const batchLengthBN = await supplychain.instance.getListLength();
                const batchLength = batchLengthBN.toNumber();
                const userLengthBN =  await supplychain.instance.roleId();
                const userLength = userLengthBN.toNumber();
                setBatchCounter(batchLength);
                setUserCounter(userLength);
                }
          catch {
                console.log("Nastala neocakavana chyba");
            }
          }
      }

    
  const selectBatch = (batchId: string):void => {
    console.log("Batch pred: " + selectedBatchId)
    setSelectedBatchId(batchId);
    console.log("Batch po: " + selectedBatchId)
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

  const changeTableBatchesState = (showTable: boolean):void => {
    setTableBatches(showTable);
  }

  const resetState = () => {
    setFormCreateBatch(false);
    setFormPrivillege(false);
    setTableBatches(false);
    setTableBatches(false);
    setSelectedBatchId("");
  } 

  const changeClassName = (classComponentName: string):void => {
      setClassComponentName(classComponentName);
  }

  if(supplychain.instance){
    supplychain.instance.on("MemberAdded", (account, name, role) => {
        setUserCounter(userCounter+1);
        console.log("Odchyteny event MemberAdded s argumentami: " + account, name, role);
      }); 
  }    

  if(supplychain.instance){
    supplychain.instance.on("BatchCreated", (batchId, productName) => {
        setBatchCounter(batchCounter+1);
        console.log("Odchyteny event BatchCreated s argumentami: " + batchId, productName);
      }); 
  }    

  return (
    <div>
      <div className={classComponentName}>
        <AdminInfohead changeFormCreateBatchState={changeFormCreateBatchState} changeFormPrivillegeState={changeFormPrivillegeState} changeClassName={changeClassName} 
        batchCounter={batchCounter} userCounter={userCounter} resetState={resetState}
          changeTableUsersState={changeTableUsersState} changeTableBatchesState={changeTableBatchesState} selectBatch={selectBatch}></AdminInfohead>
        {selectedBatchId ? <StackOfStages selectedBatchId={selectedBatchId}></StackOfStages> :
        tableBatches ? <TableOfBatches batchCounter={batchCounter} selectBatch={selectBatch}></TableOfBatches> :
        tableUsers ? <TableOfUsers userCounter={userCounter}></TableOfUsers> : <div></div>
        }
      </div>
      {formPrivillege && <FormPrivillege changeFormPrivillegeState={changeFormPrivillegeState} changeClassName={changeClassName}></FormPrivillege>}
      {formCreateBatch && <FormCreateBatch changeFormCreateBatchState={changeFormCreateBatchState} changeClassName={changeClassName}></FormCreateBatch>}
    </div>
  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }