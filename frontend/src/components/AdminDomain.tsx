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
import * as usersGetter from '../functionality/UsersGetter';


import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
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
    const [tableBatches, setTableBatches] = useState(false);
    const [tableUsers, setTableUsers] = useState(false);
    const [batchCounter, setBatchCounter] = useState(0);
    const [userCounter, setUserCounter] = useState(0);
    const [classComponentName, setClassComponentName] = useState("App");
    const [userList, setUserList] = useState<Array<User>>([]);
    const supplychain = useContext(SupplyChainContext);


    useEffect(() => {
      usersGetter.getListsLength(supplychain).then((listsLength) => {
        if(listsLength) {
          setBatchCounter(listsLength[0]);
          setUserCounter(listsLength[1]);
        }
      });
      //  getListsLength();
    },[supplychain.instance]); 

    useEffect(() => {
      // while(!supplychain.instance){
          
      // }
      usersGetter.getUsers(supplychain).then((gotUserList) => {
        if(gotUserList) {
          setUserList(gotUserList);
        }
      });
    },[supplychain.instance, userCounter]); 
    //


//   const getUsers = async () => {
//   if (!supplychain.instance) throw Error("SupplyChain instance not ready");
//   if (supplychain.instance) {
//       try{
//           const userParsedList = [];
//           const listLengthBN =  await supplychain.instance.roleId();
//           const listLength = listLengthBN.toNumber();
//           for(let i = 1; i <= listLength; i++){
//               console.log("USERS: " + listLength);

//               let signatoryRole: boolean;
//               let supplierRole: boolean;
//               const userAddress = await supplychain.instance.roles(i-1);
//               if(await supplychain.instance.hasRole(await supplychain.instance.SIGNATORY_ROLE(), userAddress)) {
//                    signatoryRole = true;
//               } else {
//                    signatoryRole = false;
//               }
//               if(await supplychain.instance.hasRole(await supplychain.instance.SUPPLIER_ROLE(), userAddress)) {
//                    supplierRole = true;
//               } else {
//                    supplierRole = false;
//               }
//               const userInfo = await supplychain.instance.rolesInfo(userAddress);
//               const userName = userInfo.name;
//               const userId = userInfo.id;
//               console.log("UserName " + userName);
//               console.log("SignatoryRole " + signatoryRole);
//               console.log("supplierRole " + supplierRole);
//               console.log("UserAddress: " + userAddress )
//               let newUser: User = {userId: userId.toNumber(), signatoryRole: signatoryRole, supplierRole: supplierRole, userName: userName,
//                   userAddress: userAddress}
//               userParsedList.push(newUser)

//           }
//           // changeUserListState(userParsedList);
//           setUserList(userParsedList);
//       } catch {
//           console.log("Nastala neocakavana chyba");
//       }
//   }
// };



    
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

  const changeUserListState = (currentUserList: Array<User>):void => {
    setUserList(currentUserList);
  }

  const addBatchCounter = ():void => {
    setBatchCounter(batchCounter+1);
  }

  const addUserCounter = ():void => {
      setUserCounter(userCounter+1);
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

  // if(supplychain.instance){
  //   supplychain.instance.on("MemberAdded", (account, name, role) => {
  //       setUserCounter(userCounter+1);
  //       console.log("Odchyteny event MemberAdded s argumentami: " + account, name, role);
  //     }); 
  // }    

  // if(supplychain.instance){
  //   supplychain.instance.on("BatchCreated", (batchId, productName) => {
  //       setBatchCounter(batchCounter+1);
  //       console.log("Odchyteny event BatchCreated s argumentami: " + batchId, productName);
  //     }); 
  // }    

  return (
    <div>
      <div className={classComponentName}>
        <AdminInfohead changeFormCreateBatchState={changeFormCreateBatchState} changeFormPrivillegeState={changeFormPrivillegeState} changeClassName={changeClassName} 
        batchCounter={batchCounter} userCounter={userCounter} resetState={resetState}
          changeTableUsersState={changeTableUsersState} changeTableBatchesState={changeTableBatchesState} selectBatch={selectBatch}></AdminInfohead>
        {selectedBatchId ? <StackOfStages selectedBatchId={selectedBatchId}></StackOfStages> :
        tableBatches ? <TableOfBatches batchCounter={batchCounter} selectBatch={selectBatch}></TableOfBatches> :
        tableUsers ? <TableOfUsers userList={userList} changeUserListState={changeUserListState} userCounter={userCounter}></TableOfUsers> : <div></div>
        }
      </div>
      {formPrivillege && <FormPrivillege addUserCounter={addUserCounter}  changeFormPrivillegeState={changeFormPrivillegeState} changeClassName={changeClassName}></FormPrivillege>}
      {formCreateBatch && <FormCreateBatch addBatchCounter={addBatchCounter} userList={userList} changeFormCreateBatchState={changeFormCreateBatchState} changeClassName={changeClassName}></FormCreateBatch>}
    </div>
  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }