const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Deploy SupplyChain smart contract", function () {
  let supplychain;
  let admin;

  before(async () => {
      [admin] = await ethers.getSigners();
      const SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplychain = await SupplyChain.deploy();
      await supplychain.deployed();
    });
  

  it("Get smart contract address on blockchain", async function () {
      const contractAddress = await supplychain.address;
      expect(contractAddress).not.to.equal(ethers.constants.AddressZero);
      expect(contractAddress).not.to.equal('');
      expect(contractAddress).not.to.equal(null);
      expect(contractAddress).not.to.equal(undefined);
    });

  it("Get admin, who was set in constructor", async function () {
      let adminName = "Administrator";
      expect((await supplychain.rolesInfo(admin.address)).name).to.equal(adminName);
      expect((await supplychain.rolesInfo(admin.address)).id).to.equal(1);        
      expect(await supplychain.hasRole(supplychain.DEFAULT_ADMIN_ROLE(), admin.address)).to.equal(true);
      expect(await supplychain.hasRole(supplychain.SIGNATORY_ROLE(), admin.address)).to.equal(true);
      expect(await supplychain.hasRole(supplychain.SUPPLIER_ROLE(), admin.address)).to.equal(false);
  });
});


describe("RoleManager", function () {
  let supplychain;
  let admin;

  before(async () => {
      [admin, signatory, supplier, testUser] = await ethers.getSigners();
      const SupplyChain = await ethers.getContractFactory("SupplyChain");
      supplychain = await SupplyChain.deploy();
      await supplychain.deployed();
  });

  it("Set signatory privillege to address", async function () {
      const signatoryName = "signatory"
      const setSignatoryTx = await supplychain.connect(admin).setPrivillegeSignatory(signatory.address, signatoryName);
      const resultSignatory = await setSignatoryTx.wait();
      const signatoryAddedEvent = resultSignatory.events[0];
      expect(signatoryAddedEvent.args[0]).to.equal(await(supplychain.SIGNATORY_ROLE()));
      expect(signatoryAddedEvent.args[1]).to.equal(signatory.address);
      expect(signatoryAddedEvent.args[2]).to.equal(admin.address);

      expect(await supplychain.hasRole(supplychain.SIGNATORY_ROLE(), signatory.address)).to.equal(true);
      expect((await supplychain.rolesInfo(signatory.address)).name).to.equal(signatoryName);
      expect((await supplychain.rolesInfo(signatory.address)).id).to.equal(2);
  });

  it("Set supplier privillege to address", async function () {
      const supplierName = "supplier"
      const setSupplierTx = await supplychain.connect(admin).setPrivillegeSupplier(supplier.address, supplierName);
      const resultSupplier = await setSupplierTx.wait();
      const supplierAddedEvent = resultSupplier.events[0];
      expect(supplierAddedEvent.args[0]).to.equal(await(supplychain.SUPPLIER_ROLE()));
      expect(supplierAddedEvent.args[1]).to.equal(supplier.address);
      expect(supplierAddedEvent.args[2]).to.equal(admin.address);
      
      expect(await supplychain.hasRole(supplychain.SUPPLIER_ROLE(), supplier.address)).to.equal(true);
      expect((await supplychain.rolesInfo(supplier.address)).name).to.equal(supplierName);
      expect((await supplychain.rolesInfo(supplier.address)).id).to.equal(3);
  });

  it("Fail set privillege by different user as admin", async function () {
      await expect(supplychain.connect(supplier).setPrivillegeSupplier(testUser.address, "testUser")).to.be.reverted;
      await expect(supplychain.connect(signatory).setPrivillegeSignatory(testUser.address, "testUser")).to.be.reverted; 
  });

  it("Fail set second privillege to one user", async function () {
      await expect(supplychain.connect(admin).setPrivillegeSupplier(supplier.address, "supplierFail")).to.be.reverted;
      await expect(supplychain.connect(admin).setPrivillegeSignatory(signatory.address, "supplierFail")).to.be.reverted; 
  });
});


describe("SupplyChain", function () {
  let supplychain;
  let admin, signatory1, supplier1, signatory2, batchId, secondaryBatchId;
  const dateCreation = 1000;    
  const initialDocHash = "IPFS_HASH_1"
  
  const productName = "product_name";
  const stage1name = "Etapa objednania";
  const stage2Name = "Stage2";
  const stage3Name = "Stage3";
  const provider = waffle.provider;

  before(async () => {
    [admin, signatory1, supplier1, signatory2, supplier2] = await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplychain = await SupplyChain.deploy();
    await supplychain.deployed();

    const signatory1Name = "signatory1"
    await supplychain.connect(admin).setPrivillegeSignatory(signatory1.address, signatory1Name);
    const signatory2Name = "signatory2"
    await supplychain.connect(admin).setPrivillegeSignatory(signatory2.address, signatory2Name);
    const supplier1Name = "supplier1"
    await supplychain.connect(admin).setPrivillegeSupplier(supplier1.address, supplier1Name);
    const supplier2Name = "supplier2"
    await supplychain.connect(admin).setPrivillegeSupplier(supplier2.address, supplier2Name);
  });

  it("Create main batch", async function () {
    const createBatchTx = await supplychain.connect(admin).createBatch(productName, signatory1.address, dateCreation, initialDocHash);
    const event = await createBatchTx.wait();
    batchId = event.events[0].args[0];
    const addNewStageEvent = event.events[1];
    const addDocumentEvent = event.events[2];

    expect((await supplychain.batches(batchId)).productName).to.equal(productName);
    expect((await supplychain.batches(batchId)).batchId).not.to.equal(ethers.constants.HashZero);
    expect((await supplychain.batches(batchId)).isFinished).to.equal(false);
    expect((await supplychain.batches(batchId)).stageCount).to.equal(1);
    expect((await supplychain.listOfIds(0))).to.equal(batchId);

    expect(addNewStageEvent.args[0]).not.to.equal(ethers.constants.HashZero);
    expect(addNewStageEvent.args[1]).to.equal(1);
    expect(addNewStageEvent.args[2]).to.equal(stage1name);
    expect(addNewStageEvent.args[3]).to.equal(signatory1.address);
    expect(addNewStageEvent.args[4]).to.equal(ethers.constants.AddressZero);
    expect(addNewStageEvent.args[5]).to.equal(0);

    expect(addDocumentEvent.args[0]).not.to.equal(ethers.constants.HashZero);
    expect(addDocumentEvent.args[1]).to.equal(stage1name);
    expect(addDocumentEvent.args[2]).to.equal(initialDocHash);
  });

  it("Fail create batch by different user than admin", async function () {
    await expect(supplychain.connect(signatory1).createBatch(productName, signatory1.address, dateCreation, initialDocHash)).to.be.reverted;
  });

  it("Create secondary batch to check list of batches", async function () {
    const createBatch2Tx =  await supplychain.connect(admin).createBatch("secondary_product", signatory2.address, dateCreation, initialDocHash);
    const event = await createBatch2Tx.wait();
    secondaryBatchId = event.events[0].args[0];

    expect(secondaryBatchId).not.to.equal(ethers.constants.HashZero);
    expect(await supplychain.getListLength()).to.equal(2);
  });

  it("Check initial stage 1", async function () {
    expect((await supplychain.batchStages(batchId, 1)).id).to.equal(1);
    expect((await supplychain.batchStages(batchId, 1)).name).to.equal(stage1name);
    expect((await supplychain.batchStages(batchId, 1)).supplierFee).to.equal(0);
    expect((await supplychain.batchStages(batchId, 1)).state).to.equal(1);
    expect((await supplychain.batchStages(batchId, 1)).supplier).to.equal(ethers.constants.AddressZero);
    expect((await supplychain.batchStages(batchId, 1)).signatory).to.equal(signatory1.address);
    expect((await supplychain.batchStages(batchId, 1)).docHash).to.equal(initialDocHash);
    expect((await supplychain.batchStages(batchId, 1)).dateReceive).to.equal(dateCreation);
    expect((await supplychain.batchStages(batchId, 1)).dateDone).to.equal(dateCreation);
  });

  it("Fail start stage 2 by forbidden account", async function () {
    const supplierFee = ethers.utils.parseEther("1.0");
    const stage2dateReceive = 2000;
    await expect(supplychain.connect(supplier1).startStage(batchId, supplier1.address, signatory2.address, 
      supplierFee, stage2Name, stage2dateReceive, {value: ethers.utils.parseEther("0")})).to.be.reverted;
    await expect(supplychain.connect(signatory2).startStage(batchId, supplier1.address, signatory2.address, 
      supplierFee, stage2Name, stage2dateReceive, {value: ethers.utils.parseEther("0")})).to.be.reverted;
  });

  it("Fail start stage 2 with invalid account", async function () {
    const supplierFee = ethers.utils.parseEther("1.0");
    const stage2dateReceive = 2000;
    await expect(supplychain.connect(supplier1).startStage(batchId, signatory1.address, signatory2.address, 
      supplierFee, stage2Name, stage2dateReceive, {value: ethers.utils.parseEther("0")})).to.be.reverted;
      await expect(supplychain.connect(supplier1).startStage(batchId, supplier1.address, supplier1.address, 
        supplierFee, stage2Name, stage2dateReceive, {value: ethers.utils.parseEther("0")})).to.be.reverted;
    });

  it("Start stage 2", async function () {
    const supplierFee = ethers.utils.parseEther("1.0");
    const stage2dateReceive = 2000;
    const startStage1Tx = await supplychain.connect(signatory1).startStage(batchId, supplier1.address, signatory2.address, 
      supplierFee, stage2Name, stage2dateReceive, {value: ethers.utils.parseEther("0")});
    const event = await startStage1Tx.wait();
    const stageCompletedEvent = event.events[0];
    const addNewStageEvent = event.events[1];

    expect((await supplychain.batches(batchId)).stageCount).to.equal(2);

    expect((await supplychain.batchStages(batchId, 1)).state).to.equal(2);

    expect((await supplychain.batchStages(batchId, 2)).id).to.equal(2);
    expect((await supplychain.batchStages(batchId, 2)).name).to.equal(stage2Name);
    expect((await supplychain.batchStages(batchId, 2)).signatory).to.equal(signatory2.address);
    expect((await supplychain.batchStages(batchId, 2)).supplierFee).to.equal(supplierFee);
    expect((await supplychain.batchStages(batchId, 2)).state).to.equal(0);
    expect((await supplychain.batchStages(batchId, 2)).dateReceive).to.equal(stage2dateReceive);


    expect(stageCompletedEvent.args[0]).to.equal(batchId);
    expect(stageCompletedEvent.args[1]).to.equal(stage1name);

    expect(addNewStageEvent.args[0]).to.equal(batchId);
    expect(addNewStageEvent.args[1]).to.equal(2);
    expect(addNewStageEvent.args[2]).to.equal(stage2Name);
    expect(addNewStageEvent.args[3]).to.equal(signatory2.address);
    expect(addNewStageEvent.args[4]).to.equal(supplier1.address);
    expect(addNewStageEvent.args[5]).to.equal(supplierFee);
  });

  it("Fail start stage 2 one more time", async function () {
    const supplierFee = ethers.utils.parseEther("1.0");
    const stage2dateReceive = 2000;
    await expect(supplychain.connect(signatory1).startStage(batchId, supplier1.address, signatory2.address, 
      supplierFee, stage2Name, stage2dateReceive, {value: ethers.utils.parseEther("0")})).to.be.reverted;
  });

  it("Get batches to receive for supplier", async function () {
    const batchToReceive = await supplychain.connect(supplier1).getSupplierView();

    expect(batchToReceive.length).to.equal(1);
    expect(batchToReceive[0].batchId).to.equal(batchId);
    expect(batchToReceive[0].productName).to.equal(productName);
    expect(batchToReceive[0].stageName).to.equal(stage2Name);
    expect(batchToReceive[0].stage).to.equal(2);
    expect(batchToReceive[0].supplierFee).to.equal(ethers.utils.parseEther("1"));
  });

  it("Fail add document with forbidden account", async function () {
    const stage2DocHash = "IPFS_HASH_2"
    const stage2DateDone = 2001;
    await expect(supplychain.connect(supplier2).addDocumentBySupplier(batchId, stage2DocHash, stage2DateDone)).to.be.reverted;
    await expect(supplychain.connect(signatory1).addDocumentBySupplier(batchId, stage2DocHash, stage2DateDone)).to.be.reverted;
  });

  it("Add document to stage 2", async function () {
    const stage2DocHash = "IPFS_HASH_2"
    const stage2DateDone = 2001;

    const createBatchTx = await supplychain.connect(supplier1).addDocumentBySupplier(batchId, stage2DocHash, stage2DateDone);
    const event = await createBatchTx.wait();
    const addDocumentEvent = event.events[0];

    expect((await supplychain.batches(batchId)).isFinished).to.equal(false);

    expect((await supplychain.batchStages(batchId, 2)).docHash).to.equal(stage2DocHash);
    expect((await supplychain.batchStages(batchId, 2)).state).to.equal(1);
    expect((await supplychain.batchStages(batchId, 2)).dateDone).to.equal(stage2DateDone);

    expect(addDocumentEvent.args[0]).to.equal(batchId);
    expect(addDocumentEvent.args[1]).to.equal(stage2Name);
    expect(addDocumentEvent.args[2]).to.equal(stage2DocHash);
  });

  it("Fail add other document to stage 2", async function () {
    const stage2DocHash = "IPFS_HASH_2Revert"
    const stage2DateDone = 2200;
    await expect(supplychain.connect(supplier1).addDocumentBySupplier(batchId, stage2DocHash, stage2DateDone)).to.be.revertedWith("not valid state");
  });

  it("Fail complete stage with not enough ethers to pay", async function () {
    const supplierFee = ethers.utils.parseEther("2");
    const stage3DateReceive = 3000;
    await expect(supplychain.connect(signatory2).startStage(batchId, supplier1.address, admin.address, 
      supplierFee, stage3Name, stage3DateReceive, {value: ethers.utils.parseEther("0")})).to.be.revertedWith("not enough ethers");
    });


  it("Get batches to receive for signatory", async function () {
    const batchToReceive = await supplychain.connect(signatory2).getSignatoryView();
    expect(batchToReceive.length).to.equal(2);

    expect(batchToReceive[0].batchId).to.equal(batchId);
    expect(batchToReceive[0].productName).to.equal(productName);
    expect(batchToReceive[0].stageName).to.equal(stage2Name);
    expect(batchToReceive[0].stage).to.equal(2);
    expect(batchToReceive[0].supplierFee).to.equal(ethers.utils.parseEther("1"));

    expect(batchToReceive[1].batchId).to.equal(secondaryBatchId);
    expect(batchToReceive[1].productName).to.equal('secondary_product');
    expect(batchToReceive[1].stageName).to.equal(stage1name);
    expect(batchToReceive[1].stage).to.equal(1);
    expect(batchToReceive[1].supplierFee).to.equal(ethers.utils.parseEther("0"));
  });

  it("Complete stage 2 and start final stage 3", async function () {
    const oldBalance = await provider.getBalance(supplier1.address);
    const supplierFee = ethers.utils.parseEther("2");
    const stage3DateReceive = 3000;

    const startStage3Tx = await supplychain.connect(signatory2).startStage(batchId, supplier1.address, admin.address, 
      supplierFee, stage3Name, stage3DateReceive, {value: ethers.utils.parseEther("1")});
    const event = await startStage3Tx.wait();
    const stage2CompletedEvent = event.events[0];
    const addNewStage3Event = event.events[1];

    const newBalance = await provider.getBalance(supplier1.address);
    expect(newBalance).to.equal(oldBalance.add(ethers.utils.parseEther("1")));

    expect((await supplychain.batches(batchId)).stageCount).to.equal(3);

    expect((await supplychain.batchStages(batchId, 2)).state).to.equal(2);

    expect((await supplychain.batchStages(batchId, 3)).id).to.equal(3);
    expect((await supplychain.batchStages(batchId, 3)).name).to.equal(stage3Name);
    expect((await supplychain.batchStages(batchId, 3)).signatory).to.equal(admin.address);
    expect((await supplychain.batchStages(batchId, 3)).supplierFee).to.equal(supplierFee);
    expect((await supplychain.batchStages(batchId, 3)).state).to.equal(0);
    expect((await supplychain.batchStages(batchId, 3)).dateReceive).to.equal(stage3DateReceive);

    expect(stage2CompletedEvent.args[0]).to.equal(batchId);
    expect(stage2CompletedEvent.args[1]).to.equal(stage2Name);

    expect(addNewStage3Event.args[0]).to.equal(batchId);
    expect(addNewStage3Event.args[1]).to.equal(3);
    expect(addNewStage3Event.args[2]).to.equal(stage3Name);
    expect(addNewStage3Event.args[3]).to.equal(admin.address);
    expect(addNewStage3Event.args[4]).to.equal(supplier1.address);
    expect(addNewStage3Event.args[5]).to.equal(supplierFee);
  });

  it("Fail complete final stage 3 by admin too early", async function () {
    const oldBalance = await provider.getBalance(supplier1.address);
    await expect(supplychain.connect(admin).completeFinalStage(batchId, {value: ethers.utils.parseEther("2")})).to.be.reverted;
  });

  it("Add document to final stage 3", async function () {
    const stage3DocHash = "IPFS_HASH_3"
    const stage3DateDone = 3001;

    const createBatchTx = await supplychain.connect(supplier1).addDocumentBySupplier(batchId, stage3DocHash, stage3DateDone);
    const event = await createBatchTx.wait();
    const addDocumentEvent = event.events[0];

    expect((await supplychain.batches(batchId)).isFinished).to.equal(true);

    expect((await supplychain.batchStages(batchId, 3)).docHash).to.equal(stage3DocHash);
    expect((await supplychain.batchStages(batchId, 3)).state).to.equal(1);
    expect((await supplychain.batchStages(batchId, 3)).dateDone).to.equal(stage3DateDone);

    expect(addDocumentEvent.args[0]).to.equal(batchId);
    expect(addDocumentEvent.args[1]).to.equal(stage3Name);
    expect(addDocumentEvent.args[2]).to.equal(stage3DocHash);
  });

  it("Fail complete final stage 3 by different user than admin", async function () {
    const oldBalance = await provider.getBalance(supplier1.address);
    await expect(supplychain.connect(signatory1).completeFinalStage(batchId, {value: ethers.utils.parseEther("2")})).to.be.reverted;
    await expect(supplychain.connect(supplier1).completeFinalStage(batchId, {value: ethers.utils.parseEther("2")})).to.be.reverted;
  });

  it("Complete final stage 3 by admin", async function () {
    const oldBalance = await provider.getBalance(supplier1.address);

    const completeFinalTx = await supplychain.connect(admin).completeFinalStage(batchId, {value: ethers.utils.parseEther("2")});
    const result = await completeFinalTx.wait();
    const finalStageEvent = result.events[0];

    const newBalance = await provider.getBalance(supplier1.address);
    expect(newBalance).to.equal(oldBalance.add(ethers.utils.parseEther("2")));

    expect((await supplychain.batchStages(batchId, 3)).state).to.equal(2);
    expect(finalStageEvent.args[0]).to.equal(batchId);
  });

  it("Get correct information for stage 3 of main batch", async function () {
    const finalStage = await supplychain.getBatchStage(batchId, 3);
    expect(finalStage[0]).to.equal(3);
    expect(finalStage[1]).to.equal(stage3Name);
    expect(finalStage[2]).to.equal(ethers.utils.parseEther("2"));
    expect(finalStage[3]).to.equal(2);
    expect(finalStage[4]).to.equal(supplier1.address);
    expect(finalStage[5]).to.equal(admin.address);
    expect(finalStage[6]).to.equal("IPFS_HASH_3");
    expect(finalStage[7]).to.equal(3000);
    expect(finalStage[8]).to.equal(3001);
  });

  it("Get name of all stages for main batch", async function () {
    const stageNames = await supplychain.getStagesNames(batchId);
    expect(stageNames[0]).to.equal(stage1name);
    expect(stageNames[1]).to.equal(stage2Name);
    expect(stageNames[2]).to.equal(stage3Name);
  });

});
