// SPDX-License-Identifier: GPL-3.0

// Smart contract that handle whole proccess of supply chain.
// Inherit from RoleManager to better verify addresses that call different functions -
// sending transactions or getting data from blockchain.
pragma solidity ^0.8.0;

import "./RoleManager.sol";

contract SupplyChain is RoleManager("Administrator") {
    event BatchCreated(bytes32 batchId, string productName);
    event StageCompleted(bytes32 batchId, string stageName);
    event StageAdded(bytes32 batchId, uint stageCount, string stageName, address signatory, address supplier, uint supplierFee);
    event BatchStageDocumentAdded(bytes32 batchId, string stageName, string docHash);
    event FinalStageCompleted(bytes32 batchId);

    enum State {
        STARTED,
        PREPARED,
        COMPLETED
    }

    struct Batch {
        bytes32 batchId;
        string productName;
        bool isFinished;
        uint stageCount;
    }

    //list of all ids related to batches
    bytes32[] public listOfIds;

    mapping(bytes32 => Batch) public batches;
    mapping(bytes32 => mapping(uint256 => BatchStage)) public batchStages;

    struct BatchStage {
        uint256 id;
        string name;
        uint256 supplierFee;
        State state;
        address supplier;
        address signatory;
        string docHash;
        uint256 dateReceive;
        uint256 dateDone;
    }

    struct AddressStageView {
        bytes32 batchId;
        string productName;
        string stageName;
        uint256 stage;
        uint256 supplierFee;
        bool toProccess;
    }

    //Check if sender send enough ethers to change state of batch
    modifier enoughEthers(bytes32 batchId) {
        require(batchStages[batchId][batches[batchId].stageCount].supplierFee <= msg.value, "not enough ethers");
        _;
     } 

    // Check if batch is in state that provides functionality that is called
    modifier correctState(bytes32 batchId, State state){
        require(batchStages[batchId][batches[batchId].stageCount].state == state, "not valid state");
        _;
    }
    
    // Check if account has signatory role
    modifier validSignator(bytes32 batchId){
        require(batchStages[batchId][batches[batchId].stageCount].signatory == msg.sender, "Not valid signatory");
        _;
    }

    function getListLength() public view returns (uint256) {
        return listOfIds.length;
    }

    function getStagesNames(bytes32 batchId) public view returns (string[] memory stages) {
        string[] memory loadedStages = new string[](batches[batchId].stageCount);

        for (uint256 i = 1; i <= batches[batchId].stageCount; i++) {
            loadedStages[i-1] = batchStages[batchId][i].name;
        }
        stages = loadedStages;
    }

    // Return all stages related to signatory that call this function and info about them
    function getSignatoryView() public view
        returns (AddressStageView[] memory states)
    {
        uint256 resultCount = 0;
        
        for (uint256 i = 0; i < getListLength(); i++) {
            for (uint256 stage = 1; stage <= batches[listOfIds[i]].stageCount; stage++) {
                if (
                    batchStages[listOfIds[i]][stage].signatory == msg.sender 
                ) {
                    resultCount++;
                    break;
                }
            }
        }

        AddressStageView[] memory results = new AddressStageView[](resultCount);

        if (resultCount == 0) {
            return results;
        }

        uint256 index = 0;
        bool isIncluded;

        for (uint256 i = 0; i < getListLength(); i++) {
            AddressStageView memory stageView;  
            isIncluded = false;
            for (uint256 stage = 1; stage <= batches[listOfIds[i]].stageCount; stage++) {
                if (
                    batchStages[listOfIds[i]][stage].signatory == msg.sender 
                ) {
                    if (batchStages[listOfIds[i]][stage].state == State.PREPARED) {
                        stageView.toProccess = true;    
                    }
                    isIncluded = true;
                    stageView.batchId = listOfIds[i];
                    stageView.productName= batches[listOfIds[i]].productName;
                    stageView.stage = stage;
                    stageView.stageName = batchStages[listOfIds[i]][batches[listOfIds[i]].stageCount].name;
                    stageView.supplierFee = batchStages[listOfIds[i]][batches[listOfIds[i]].stageCount].supplierFee;
                }
            }
            if(isIncluded) {
                results[index] = stageView;
                index++;
            }
        }
        states = results;
    }

    // Return all stages related to supplier that call this function and info about them
    function getSupplierView() public view
        returns (AddressStageView[] memory states)
    {
        uint256 resultCount = 0;
        
        for (uint256 i = 0; i < getListLength(); i++) {
            for (uint256 stage = 1; stage <= batches[listOfIds[i]].stageCount; stage++) {
                if (
                    batchStages[listOfIds[i]][stage].supplier == msg.sender 
                ) {
                    resultCount++;
                    break;
                }
            }
        }


        AddressStageView[] memory results = new AddressStageView[](resultCount);

        if (resultCount == 0) {
            return results;
        }

        uint256 index = 0;
        bool isIncluded;

        for (uint256 i = 0; i < getListLength(); i++) {
            AddressStageView memory stageView;  
            isIncluded = false;
            for (uint256 stage = 1; stage <= batches[listOfIds[i]].stageCount; stage++) {
                if (
                    batchStages[listOfIds[i]][stage].supplier == msg.sender 
                ) {
                    if (batchStages[listOfIds[i]][stage].state == State.STARTED) {
                        stageView.toProccess = true;    
                    }
                    isIncluded = true;
                    stageView.batchId = listOfIds[i];
                    stageView.productName= batches[listOfIds[i]].productName;
                    stageView.stage = stage;
                    stageView.stageName = batchStages[listOfIds[i]][batches[listOfIds[i]].stageCount].name;
                    stageView.supplierFee = batchStages[listOfIds[i]][batches[listOfIds[i]].stageCount].supplierFee;
                }
            }
            if(isIncluded) {
                results[index] = stageView;
                index++;
            }
        }
        states = results;
    }

    // Return info about stage of batch according to order of stage -> stageCount and batch -> batchId
    function getBatchStage(bytes32 batchId, uint256 stageCount) public view
        returns (BatchStage memory stage)
    {
        stage = batchStages[batchId][stageCount];
    }

    // Batch is received by signatory, current stage is finished and new stage is set
    function startStage(bytes32 batchId, address supplier, address signatory, uint256 supplierFee, string memory name, uint256 dateReceive) public payable
        correctState(batchId, State.PREPARED)
        validSignator(batchId)
        enoughEthers(batchId)
     {
        require(!batches[batchId].isFinished , "Batch was already finished");
        require(hasRole(SIGNATORY_ROLE, signatory) , "Member doesnt have signatory privillege");
        require(hasRole(SUPPLIER_ROLE, supplier) , "Member doesnt have supplier rivillege");

        completeStage(batchId, batches[batchId].stageCount);
        emit StageCompleted(batchId, batchStages[batchId][batches[batchId].stageCount].name);

        addNewStage(batchId, name, signatory, supplier, supplierFee, dateReceive);
    }

    // Finish last stage of batch, so whole proccess of batch is at the end and
    // no more transactions related to this batch can be sent
    function completeFinalStage(bytes32 batchId) public payable
        onlyRole(DEFAULT_ADMIN_ROLE)
        validSignator(batchId)
        enoughEthers(batchId)
        correctState(batchId, State.PREPARED)
    {
        require(batches[batchId].isFinished , "Batch wasn't finished yet");
        completeStage(batchId, batches[batchId].stageCount);
        emit FinalStageCompleted(batchId);
    }

    // Finish current stage of batch
    function completeStage(bytes32 batchId, uint256 stage) private {
        batchStages[batchId][stage].state = State.COMPLETED;

        if (batchStages[batchId][stage].supplierFee > 0) {
                uint256 overpaidAmount = 0;
                if(batchStages[batchId][batches[batchId].stageCount].supplierFee <= msg.value) {
                    overpaidAmount = msg.value - batchStages[batchId][batches[batchId].stageCount].supplierFee;
                    payable(msg.sender).transfer(overpaidAmount);
                }
                payable(batchStages[batchId][stage].supplier).transfer(msg.value-overpaidAmount);
        }
    }

    // Admin can create batch that means that define info about product and
    // generate id of batch through keccak256 hash function according to admin address and current time 
    function createBatch(string memory productName, address signatory, uint256 dateCreation, string memory docHash) public 
        onlyRole(DEFAULT_ADMIN_ROLE)
     {
        require(hasRole(SIGNATORY_ROLE, signatory) , "Member doesnt have signatory privillege");
        bytes32 batchId;
        batchId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        listOfIds.push(batchId);
        batches[batchId].batchId = batchId;
        batches[batchId].productName = productName;
        emit BatchCreated(batchId, productName);

        addNewStage(batchId, "Etapa objednania", signatory, address(0), 0, dateCreation);
        addBatchStageDocument(batchId, docHash, dateCreation);
    }

    // Add new stage that batch has to follow and info about this stage
    function addNewStage(bytes32 batchId, string memory name, address signatory, address supplier, uint supplierFee, uint256 dateReceive) private
     {
        batches[batchId].stageCount++;
        batchStages[batchId][batches[batchId].stageCount].id = batches[batchId].stageCount;
        batchStages[batchId][batches[batchId].stageCount].name = name;
        batchStages[batchId][batches[batchId].stageCount].supplier = supplier;
        batchStages[batchId][batches[batchId].stageCount].signatory = signatory;
        batchStages[batchId][batches[batchId].stageCount].supplierFee = supplierFee;
        batchStages[batchId][batches[batchId].stageCount].state = State.STARTED;
        batchStages[batchId][batches[batchId].stageCount].dateReceive = dateReceive;
        emit StageAdded(batchId, batches[batchId].stageCount, name, signatory, supplier, supplierFee);
    }

    // When suppplier write info about manufacture, data are saved in IPFS and
    // hash of ipfs location is saved in blockchain  
    function addDocumentBySupplier(bytes32 batchId, string memory docHash, uint256 dateDone) public {
        require(batchStages[batchId][batches[batchId].stageCount].supplier == msg.sender, "not valid supplier");
        addBatchStageDocument(batchId, docHash, dateDone);
        if(hasRole(DEFAULT_ADMIN_ROLE, batchStages[batchId][batches[batchId].stageCount].signatory)){
            batches[batchId].isFinished = true;
        }
    }

    // Hash of ipfs location is saved and state will change.
    function addBatchStageDocument(bytes32 batchId, string memory docHash, uint256 dateDone) private 
        correctState(batchId, State.STARTED)
    {
        require(keccak256(abi.encodePacked(batchStages[batchId][batches[batchId].stageCount].docHash)) == keccak256(abi.encodePacked("")), "document already exists");
        batchStages[batchId][batches[batchId].stageCount].docHash = docHash;
        batchStages[batchId][batches[batchId].stageCount].state = State.PREPARED;
        batchStages[batchId][batches[batchId].stageCount].dateDone = dateDone;
        emit BatchStageDocumentAdded(batchId, batchStages[batchId][batches[batchId].stageCount].name, docHash);
    }
}