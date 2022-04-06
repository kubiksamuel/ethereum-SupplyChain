import * as React from 'react';
import { Form, Button, FormControl, InputGroup, CloseButton} from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { start } from 'repl';
import { ethers } from 'ethers';


interface FormStartStageProps {
    currentBatchId: string;
    currentStageFee: string;
    changeClassName: (classComponentName: string) => void;
    selectBatch: (batchId: string, stageFee: string) => void; 
}

export const FormStartStage: React.FC<FormStartStageProps> = ({currentBatchId, currentStageFee, changeClassName, selectBatch}) => {
    const supplychain = useContext(SupplyChainContext);
    const temporaryBatchId = useRef<HTMLInputElement>(null);
    const addressSupplierInput= useRef<HTMLInputElement>(null);
    const addressSignatoryInput= useRef<HTMLInputElement>(null);
    const stageNameInput= useRef<HTMLInputElement>(null);
    const stagePriceInput= useRef<HTMLInputElement>(null);


    const createBatch = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();    
        const batchId: string = temporaryBatchId.current!.value;
        const addressSupplier: string = addressSupplierInput.current!.value;
        const addressSignatory: string = addressSignatoryInput.current!.value;
        const stageName: string = stageNameInput.current!.value;
        let ethPrice = stagePriceInput.current!.value;
        ethPrice = ethPrice.replace(',', '.');
        const stagePrice: ethers.BigNumber = ethers.utils.parseEther(ethPrice);

        const date = Date.now();
        if (!supplychain.instance) throw Error("Greeter instance not ready");
        if (supplychain.instance) {
            let startStageTx: ContractTransaction;
            try{
                startStageTx = await supplychain.instance.startStage(batchId, addressSupplier, addressSignatory, stagePrice, stageName, date,
                                                                         {value: currentStageFee});
                const receipt: ContractReceipt = await startStageTx.wait();

                // @ts-ignore
                console.log("Batch id:" , receipt.events[0].args[0], "Nazov ukonceneho stagu: ", receipt.events[0].args[1]);
                // @ts-ignore
                console.log("Batch id:" , receipt.events[1].args[0], "Poradie stagu: ", receipt.events[1].args[1], "Nazov noveho stagu: ", receipt.events[1].args[2])
                // @ts-ignore
                console.log("Supplier address: ", receipt.events[1].args[3], "Signatory address: ", receipt.events[1].args[4], "Supplier fee: ", receipt.events[1].args[5]);

            } catch {
                console.log("Transakcia bola vratena");
            }
        }
     };

    return (
        <Form>
            <div className="bg-dark p-1 closeButton">
                <CloseButton onClick={() =>{
                                selectBatch("", "")
                                changeClassName("App");
                            }}  variant="white" />
            </div>
            <div className='formHeader'>
                <h3>Objednavka produktu</h3>
            </div>
            <hr/>
            <fieldset >
                <div className='formInputs'>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="disabledTextInput">Id šarže:</Form.Label>
                        <Form.Control id="disabledTextInput" readOnly value={currentBatchId} ref={temporaryBatchId}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="supplierAddress">Adresa výrobcu:</Form.Label>
                        <Form.Control id="supplierAddress" placeholder="" ref={addressSupplierInput}/>
                </Form.Group>
                <Form.Group className="mb-3">
                     <Form.Label htmlFor="signatoryAddress">Adresa schvaľovateľa:</Form.Label>
                     <Form.Control id="signatoryAddress" placeholder="" ref={addressSignatoryInput} />
                 </Form.Group>
                 <Form.Group className="mb-3">
                     <Form.Label htmlFor="stageName">Názov novej etapy: </Form.Label>
                     <Form.Control id="stageName" placeholder="" ref={stageNameInput} />
                 </Form.Group>
                 <Form.Group className="mb-3">
                     <Form.Label htmlFor="supplierFee">Cena etapy v Ether: </Form.Label>
                     <Form.Control id="supplierFee" placeholder="1.2345" ref={stagePriceInput} />
                 </Form.Group>
                 </div>
                <hr/>
                <div className='submitButton'>
                    <Button type="button" onClick={(e) => createBatch(e)}>Submit</Button>
                </div>

            </fieldset>
        </Form>

    );
}

