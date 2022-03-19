const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("SupplyChain", function () {
  let supplychain;
  let admin, signatory1, supplier1, signatory2, batchId, secondaryBatchId;
  const dateCreation = 1000;    
  const initialDocHash = "IPFS_HASH_1"
  
  const productName = "product_name";
  const stage1name = "Order stage";
  const stage2Name = "Stage2";
  const stage3Name = "Stage3";
  const provider = waffle.provider;

  before(async () => {
    [admin, signatory1, supplier1, signatory2] = await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplychain = await SupplyChain.deploy();
    await supplychain.deployed();
  });

  it("Deploy smart contract to blockchain", async function () {
    const contractAddress = await supplychain.address;
    expect(contractAddress).not.to.equal(ethers.constants.AddressZero);
    expect(contractAddress).not.to.equal('');
    expect(contractAddress).not.to.equal(null);
    expect(contractAddress).not.to.equal(undefined);
    expect((await supplychain.signatoryRoles(admin.address)).name).to.equal("Administrator");
    expect((await supplychain.signatoryRoles(admin.address)).id).to.equal(1);
  });

  it("Set role to addresses", async function () {
    const signatory1Name = "signatory1"
    const setSignatory1Tx = await supplychain.connect(admin).setPrivillegeSignatory(signatory1.address, signatory1Name);
    const resultSignatory1 = await setSignatory1Tx.wait();
    const signatory1AddedEvent = resultSignatory1.events[0];
    expect(signatory1AddedEvent.args[0]).to.equal(await(supplychain.SIGNATORY_ROLE()));
    expect(signatory1AddedEvent.args[1]).to.equal(signatory1.address);
    expect(signatory1AddedEvent.args[2]).to.equal(admin.address);

    const signatory2Name = "signatory2"
    const setSignatory2Tx = await supplychain.connect(admin).setPrivillegeSignatory(signatory2.address, signatory2Name);
    const resultSignatory2 = await setSignatory2Tx.wait();
    const signatory2AddedEvent = resultSignatory2.events[0];
    expect(signatory2AddedEvent.args[0]).to.equal(await(supplychain.SIGNATORY_ROLE()));
    expect(signatory2AddedEvent.args[1]).to.equal(signatory2.address);
    expect(signatory2AddedEvent.args[2]).to.equal(admin.address);

    const supplier1Name = "supplier1"
    const setSupplier1Tx = await supplychain.connect(admin).setPrivillegeSupplier(supplier1.address, supplier1Name);
    const resultSupplier1 = await setSupplier1Tx.wait();
    const supplier1AddedEvent = resultSupplier1.events[0];
    expect(supplier1AddedEvent.args[0]).to.equal(await(supplychain.SUPPLIER_ROLE()));
    expect(supplier1AddedEvent.args[1]).to.equal(supplier1.address);
    expect(supplier1AddedEvent.args[2]).to.equal(admin.address);


    expect(await supplychain.hasRole(supplychain.SIGNATORY_ROLE(), signatory1.address)).to.equal(true);
    expect((await supplychain.signatoryRoles(signatory1.address)).name).to.equal(signatory1Name);
    expect((await supplychain.signatoryRoles(signatory1.address)).id).to.equal(2);

    expect(await supplychain.hasRole(supplychain.SIGNATORY_ROLE(), signatory2.address)).to.equal(true);
    expect((await supplychain.signatoryRoles(signatory2.address)).name).to.equal(signatory2Name);
    expect((await supplychain.signatoryRoles(signatory2.address)).id).to.equal(3);

    expect(await supplychain.hasRole(supplychain.SUPPLIER_ROLE(), supplier1.address)).to.equal(true);
    expect((await supplychain.supplierRoles(supplier1.address)).name).to.equal(supplier1Name);
    expect((await supplychain.supplierRoles(supplier1.address)).id).to.equal(4);
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

  it("Start stage 2", async function () {
    const supplierFee = ethers.utils.parseEther("1");
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

  it("Get batches to receive for supplier", async function () {
    const batchToReceive = await supplychain.connect(supplier1).getSupplierView();

    expect(batchToReceive.length).to.equal(1);
    expect(batchToReceive[0].batchId).to.equal(batchId);
    expect(batchToReceive[0].productName).to.equal(productName);
    expect(batchToReceive[0].stageName).to.equal(stage2Name);
    expect(batchToReceive[0].stage).to.equal(2);
    expect(batchToReceive[0].supplierFee).to.equal(ethers.utils.parseEther("1"));
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

  it("Forbid adding other documents to stage 2", async function () {
    const stage2DocHash = "IPFS_HASH_2Revert"
    const stage2DateDone = 2200;

    await expect(supplychain.connect(supplier1).addDocumentBySupplier(batchId, stage2DocHash, stage2DateDone)).to.be.revertedWith("not valid state");
  });

  it("Forbid complete stage with not enough ethers to pay", async function () {
    const supplierFee = ethers.utils.parseEther("2");
    const stage3DateReceive = 3000;

    await expect(supplychain.connect(signatory2).startStage(batchId, supplier1.address, admin.address, 
      supplierFee, stage3Name, stage3DateReceive, {value: ethers.utils.parseEther("0")})).to.be.revertedWith("not enough ethers");
    });

  it("Forbid complete stage for not valid sinatory", async function () {
    const supplierFee = ethers.utils.parseEther("2");
    const stage3DateReceive = 3000;

    await expect(supplychain.connect(signatory1).startStage(batchId, supplier1.address, admin.address, 
      supplierFee, stage3Name, stage3DateReceive, {value: ethers.utils.parseEther("1")})).to.be.revertedWith("Not valid signatory");

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
    const finalStage = await supplychain.getBatchStageState(batchId, 3);
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
    const stageNames = await supplychain.getStages(batchId);
    expect(stageNames[0]).to.equal(stage1name);
    expect(stageNames[1]).to.equal(stage2Name);
    expect(stageNames[2]).to.equal(stage3Name);
  });

});
