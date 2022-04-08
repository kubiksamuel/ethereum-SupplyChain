import { Children } from 'react';
import { SymfoniSupplyChain } from "./../hardhat/SymfoniContext";



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


export const getUsers = async (supplychain: SymfoniSupplyChain) => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            const userParsedList = [];
            const listLengthBN =  await supplychain.instance.roleId();
            const listLength = listLengthBN.toNumber();
            for(let i = 1; i <= listLength; i++){
                console.log("USERS: " + listLength);
  
                let signatoryRole: boolean;
                let supplierRole: boolean;
                const userAddress = await supplychain.instance.roles(i-1);
                if(await supplychain.instance.hasRole(await supplychain.instance.SIGNATORY_ROLE(), userAddress)) {
                     signatoryRole = true;
                } else {
                     signatoryRole = false;
                }
                if(await supplychain.instance.hasRole(await supplychain.instance.SUPPLIER_ROLE(), userAddress)) {
                     supplierRole = true;
                } else {
                     supplierRole = false;
                }
                const userInfo = await supplychain.instance.rolesInfo(userAddress);
                const userName = userInfo.name;
                const userId = userInfo.id;
                console.log("UserName " + userName);
                console.log("SignatoryRole " + signatoryRole);
                console.log("supplierRole " + supplierRole);
                console.log("UserAddress: " + userAddress )
                let newUser: User = {userId: userId.toNumber(), signatoryRole: signatoryRole, supplierRole: supplierRole, userName: userName,
                    userAddress: userAddress}
                userParsedList.push(newUser)
  
            }
            // changeUserListState(userParsedList);
            return userParsedList;
        } catch {
            console.log("Nastala neocakavana chyba");
        }
    }
  };

  export const getListsLength = async (supplychain: SymfoniSupplyChain) => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            const batchLengthBN = await supplychain.instance.getListLength();
            const batchLength = batchLengthBN.toNumber();
            const userLengthBN =  await supplychain.instance.roleId();
            const userLength = userLengthBN.toNumber();
            return [batchLength, userLength];
            }
      catch {
            console.log("Nastala neocakavana chyba");
        }
      }
  };

  export const getBatchesItems = async (supplychain: SymfoniSupplyChain, typeOfView: string) => {
    console.log("ASYNC");
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            const batchParsedList = [];
            let listOfWaitingBatches;
            if(typeOfView == "signatory") {
                listOfWaitingBatches = await supplychain.instance.getSignatoryView();
            } else {
                 listOfWaitingBatches = await supplychain.instance.getSupplierView();
            }
            for(let i = 0; i < listOfWaitingBatches.length; i++){
                let batch = listOfWaitingBatches[i];
                console.log("Batch" + i + ":" + listOfWaitingBatches[i]);
                let batchId = batch.batchId;
                let productName = batch.productName;
                let stageName = batch.stageName;
                let stageOrder = batch.stage.toNumber();
                let supplierFee = batch.supplierFee.toString();
                let toProccess = batch.toProccess;
                console.log("To proceess: " + batch.toProccess);
                let batchItem: Batch = {batchId: batchId, productName: productName, stageOrder: stageOrder, stageName: stageName, supplierFee: supplierFee,
                    toProccess: toProccess};
                console.log("Batch: " + batchItem);
                batchParsedList.push(batchItem)
            }
            return batchParsedList;
        } catch {
            console.log("Nastala neocakavana chyba");
        }
    }
 };