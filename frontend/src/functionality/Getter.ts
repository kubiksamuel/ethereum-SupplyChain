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

interface BatchAdmin {
    batchId: string;
    productName: string;
    stageName: string;
    isFinished: boolean;
    stageCount: number;
    stageState: number;
    }   

interface AdminData {
    inProccessBatchLength: number;
    finishedBatchLength: number;
    batchParsedList: Array<BatchAdmin>;
}

interface SignatoryData{
    batchList: Array<Batch>;
    inProccessBatchLength: number;
    finishedBatchLength: number;
    }  


export const getUsers = async (supplychain: SymfoniSupplyChain) => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        const userParsedList = [];
        const listLengthBN =  await supplychain.instance.roleId();
        const listLength = listLengthBN.toNumber();
        for(let i = 1; i <= listLength; i++){  
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
            let newUser: User = {userId: userId.toNumber(), signatoryRole: signatoryRole, supplierRole: supplierRole, userName: userName,
                userAddress: userAddress}
            userParsedList.push(newUser)

        }
        return userParsedList;
    }
};

  export const getListsLength = async (supplychain: SymfoniSupplyChain) => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        let finishedBatchLength = 0 ;
        let inProccessBatchLength = 0 ;
        const listLengthBN = await supplychain.instance.getListLength();
        const listLength = listLengthBN.toNumber();
        for(let i = 0; i < listLength; i++){
            let batchId = await supplychain.instance.listOfIds(i);
            let batch = await supplychain.instance.batches(batchId);
            let isFinished = batch.isFinished;
            let stageCount = batch.stageCount.toNumber();
            const stageState = (await supplychain.instance.batchStages(batchId, stageCount)).state;
            if(isFinished && stageState === 2) {
                finishedBatchLength++;
            } else {
                inProccessBatchLength++;
            }
        }
        
        const userLengthBN =  await supplychain.instance.roleId();
        const userLength = userLengthBN.toNumber();
        return [inProccessBatchLength, finishedBatchLength, userLength];
    }
};

  export const getEmployerBatchesItems = async (supplychain: SymfoniSupplyChain, typeOfView: string) => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        let batchParsedList: Array<Batch>;
        batchParsedList = [];
        let inProccessBatchLength = 0;
        let finishedBatchLength = 0;
        let listOfWaitingBatches;
        if(typeOfView === "signatory") {
            listOfWaitingBatches = await supplychain.instance.getSignatoryView();
        } else {
                listOfWaitingBatches = await supplychain.instance.getSupplierView();
        }
        for(let i = 0; i < listOfWaitingBatches.length; i++){
            let batch = listOfWaitingBatches[i];
            let batchId = batch.batchId;
            let productName = batch.productName;
            let stageName = batch.stageName;
            let stageOrder = batch.stage.toNumber();
            let supplierFee = batch.supplierFee.toString();
            let toProccess = batch.toProccess;
            if(toProccess) {
                inProccessBatchLength++;
            } else {
                finishedBatchLength++;
            }
            let batchItem: Batch = {batchId: batchId, productName: productName, stageOrder: stageOrder, stageName: stageName, supplierFee: supplierFee,
                toProccess: toProccess};
            batchParsedList.push(batchItem)
        }
        const signatortData: SignatoryData = { batchList: batchParsedList, inProccessBatchLength: inProccessBatchLength, finishedBatchLength: finishedBatchLength};

        return signatortData;
    }
};

 export const getAllBatches = async (supplychain: SymfoniSupplyChain) => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        const batchParsedList = [];
        let finishedBatchLength = 0 ;
        let inProccessBatchLength = 0 ;
        const listLengthBN = await supplychain.instance.getListLength();
        const listLength = listLengthBN.toNumber();
        for(let i = 0; i < listLength; i++){
            let batchId = await supplychain.instance.listOfIds(i);
            let batch = await supplychain.instance.batches(batchId);
            let isFinished = batch.isFinished;
            let stageCount = batch.stageCount.toNumber()
            const stageState = (await supplychain.instance.batchStages(batchId, stageCount)).state;
            let _productName = batch.productName.toString();
            let stage = await supplychain.instance.batchStages(batchId, batch[3].toNumber());
            let _stageName = stage.name;
            let batchItem: BatchAdmin = {batchId: batchId, productName: _productName, stageName: _stageName.toString(), isFinished: isFinished,
                                    stageCount: stageCount, stageState: stageState}
            if(isFinished && stageState === 2) {
                finishedBatchLength++;
            } else {
                inProccessBatchLength++;
            }
            batchParsedList.push(batchItem)
        }
        let adminData: AdminData = {inProccessBatchLength: inProccessBatchLength, finishedBatchLength: finishedBatchLength,
                batchParsedList: batchParsedList};

        return adminData;
    }
};