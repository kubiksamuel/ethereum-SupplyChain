const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  let supplychain
  let admin, signatory1, supplier1, signatory2, batchId
  const dateCreation = 1000;    
  const initialDocHash = "IPFS_HASH_1"

  const stage2Name = "Stage2";


  before(async () => {
    [admin, signatory1, supplier1, signatory2] = await ethers.getSigners();
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplychain = await SupplyChain.deploy();
    await supplychain.deployed();
  });

  it("Deploys successfully", async function () {
    const contractAddress = await supplychain.address;
    expect(contractAddress).not.to.equal(ethers.constants.AddressZero);
    expect(contractAddress).not.to.equal('');
    expect(contractAddress).not.to.equal(null);
    expect(contractAddress).not.to.equal(undefined);
    expect((await supplychain.signatoryRoles(admin.address)).name).to.equal("Administrator");
    expect((await supplychain.signatoryRoles(admin.address)).id).to.equal(1);
  });

  it("Should set role to addresses", async function () {
    const signatory1Name = "signatory1"
    const setSignatory1Tx = await supplychain.connect(admin).setPrivillegeSignatory(signatory1.address, signatory1Name);
    const resultSignatory1 = await setSignatory1Tx.wait();
    const signatory1AddedEvent = resultSignatory1.events[0];
    expect(signatory1AddedEvent.args[0]).to.equal(await(supplychain.SIGNATORY_ROLE()), "Priradena zla rola");
    expect(signatory1AddedEvent.args[1]).to.equal(signatory1.address, "Adresa signatora nie je korekt");
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

  it("Should create batch", async function () {
    const productName = "product_name";

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
    expect(addNewStageEvent.args[2]).to.equal("Order stage");
    expect(addNewStageEvent.args[3]).to.equal(signatory1.address);
    expect(addNewStageEvent.args[4]).to.equal(ethers.constants.AddressZero);
    expect(addNewStageEvent.args[5]).to.equal(0);

    expect(addDocumentEvent.args[0]).not.to.equal(ethers.constants.HashZero);
    expect(addDocumentEvent.args[1]).to.equal("Order stage");
    expect(addDocumentEvent.args[2]).to.equal(initialDocHash);
  });

  it("Check initial stage 1", async function () {
    expect((await supplychain.batchStages(batchId, 1)).id).to.equal(1);
    expect((await supplychain.batchStages(batchId, 1)).name).to.equal("Order stage");
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
    expect(stageCompletedEvent.args[1]).to.equal("Order stage");

    expect(addNewStageEvent.args[0]).to.equal(batchId);
    expect(addNewStageEvent.args[1]).to.equal(2);
    expect(addNewStageEvent.args[2]).to.equal(stage2Name);
    expect(addNewStageEvent.args[3]).to.equal(signatory2.address);
    expect(addNewStageEvent.args[4]).to.equal(supplier1.address);
    expect(addNewStageEvent.args[5]).to.equal(supplierFee);
  });

  it("Add document to stage 2", async function () {
    const stage2DocHash = "IPFS_HASH_1"
    const stage2DateDone = 2000;

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
});
