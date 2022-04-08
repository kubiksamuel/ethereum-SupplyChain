import React, { useContext, useEffect, useRef, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import * as usersGetter from '../functionality/UsersGetter';


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



export const SignatoryDomain = () => {

    const [currentBatchId, setCurrentBatchId] = useState("");
    const [changedSignatoryBatch, setSignatoryChangedBatch] = useState("");
    const [currentStageFee, setCurrentStageFee] = useState("");
    const [classComponentName, setClassComponentName] = useState("App");
    const [userList, setUserList] = useState<Array<User>>([]);
    const [formStartStage, setFormStartStage] = useState(false);
    const supplychain = useContext(SupplyChainContext);

    const [tableFinishedBatches, setTableFinishedBatches] = useState(false);
    const [tableInProccessBatches, setTableInProccessBatches] = useState(false);

    
    const selectBatch = (batchId: string, stageFee: string):void => {
        setCurrentBatchId(batchId);
        setCurrentStageFee(stageFee)
    }

    const changeClassName = (classComponentName: string):void => {
      setClassComponentName(classComponentName);
    } 

    const setProccessedBatch = (batchId: string):void => {
      setSignatoryChangedBatch(batchId);
    }

    const changeFormStartStageState = (showForm: boolean):void => {
      setFormStartStage(showForm);
    } 

//    if(supplychain.instance){
//     supplychain.instance.on("StageCompleted", (batchId, stageName) => {
//       setSignatoryChangedBatch(batchId);
//           // setCurrentBatchId("");
//       console.log("Odchyteny event StageCompleted s argumentami: " + batchId, stageName);
//     });
// }    

  useEffect(() => {
    // while(!supplychain.instance){
        
    // }
    usersGetter.getUsers(supplychain).then((gotUserList) => {
      if(gotUserList) {
        setUserList(gotUserList);
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
      <div className={classComponentName}>
      {currentBatchId && !formStartStage ?<StackOfStages selectedBatchId={currentBatchId}></StackOfStages> :
        <TableOfSignatoryBatches changedSignatoryBatch={changedSignatoryBatch} changeClassName={changeClassName} selectBatch={selectBatch}
          changeFormStartStageState={changeFormStartStageState}></TableOfSignatoryBatches>}
      </div>
      {currentBatchId && formStartStage && <FormStartStage setProccessedBatch={setProccessedBatch} userList={userList} selectBatch={selectBatch} currentBatchId={currentBatchId}
       currentStageFee={currentStageFee} changeClassName={changeClassName}  changeFormStartStageState={changeFormStartStageState}></FormStartStage>}
  </div>

  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }