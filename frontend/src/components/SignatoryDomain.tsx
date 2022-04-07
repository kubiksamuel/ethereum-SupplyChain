import React, { useContext, useEffect, useState } from 'react';
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

interface User {
  userId: number;
  userAddress: string;
  userName: string;
  signatoryRole: boolean;
  supplierRole: boolean;
}

export const SignatoryDomain = () => {
    const [currentBatchId, setCurrentBatchId] = useState("");
    const [changedBatch, setChangedBatch] = useState("");
    const [currentStageFee, setCurrentStageFee] = useState("");
    const [classComponentName, setClassComponentName] = useState("App");
    const [userList, setUserList] = useState<Array<User>>([]);
    // const [formStartStage, setFormStartStage] = useState(false);
    const supplychain = useContext(SupplyChainContext);

    
    const selectBatch = (batchId: string, stageFee: string):void => {
        setCurrentBatchId(batchId);
        setCurrentStageFee(stageFee)
    }

    const changeClassName = (classComponentName: string):void => {
      setClassComponentName(classComponentName);
    } 

   if(supplychain.instance){
    supplychain.instance.on("StageCompleted", (batchId, stageName) => {
      setChangedBatch(batchId);
          // setCurrentBatchId("");
        console.log("Odchyteny event s argumentami: " + batchId, stageName);
    });
}    

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
        <TableOfSignatoryBatches changedBatch={changedBatch} changeClassName={changeClassName} selectBatch={selectBatch}></TableOfSignatoryBatches>
      </div>
      {currentBatchId && <FormStartStage userList={userList} selectBatch={selectBatch} currentBatchId={currentBatchId} currentStageFee={currentStageFee} changeClassName={changeClassName}></FormStartStage>}
  </div>

  );
}






// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }