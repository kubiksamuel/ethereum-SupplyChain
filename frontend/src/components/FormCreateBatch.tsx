import * as React from 'react';
import { Form, Button, CloseButton } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { TableOfBatches } from './TableOfBatches';

interface FormCreateBatchProps {
    changeFormCreateBatchState: (arg: boolean) => void;
    changeClassName: (arg: string) => void;
}

export const FormCreateBatch: React.FC<FormCreateBatchProps> = ({changeFormCreateBatchState, changeClassName}) => {
    const supplychain = useContext(SupplyChainContext);
    const addressInput= useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const textInput = useRef<HTMLTextAreaElement>(null);

    const createBatch = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();    
        const address: string = addressInput.current!.value;
        const name: string = nameInput.current!.value;
        const date = Date.now();
        console.log(date);
        const ipfsHash =  await ipfs.addToIPFS(textInput.current!.value);
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
            let createBatchTx: ContractTransaction;
            try{
                createBatchTx = await supplychain.instance.createBatch(name, address, date, ipfsHash);
                const receipt: ContractReceipt = await createBatchTx.wait();
                // @ts-ignore
                console.log("Batch id:" , receipt.events[2].args[0], "Nazov stagu: ", receipt.events[2].args[1], "Ipfs hash: " , receipt.events[2].args[2]);
            } catch {
                console.log("Transakcia bola vratena");
            }
        }
     };

    return (
        <Form>
            <div className="bg-dark p-1 closeButton">
                <CloseButton onClick={() =>{
                                changeFormCreateBatchState(false);
                                changeClassName("App");
                            }}  variant="white" />
            </div>
            <div className='formHeader'>
                <h3>Pridanie používateľa</h3>
            </div>
            <hr/>
            <fieldset >
                <div className='formInputs'>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="productName">Nazov produktu:</Form.Label>
                        <Form.Control id="productName" placeholder="" ref={nameInput}/>
                </Form.Group>
                <Form.Group className="mb-3">
                     <Form.Label htmlFor="signatoryAddress">Adresa schvalovatela:</Form.Label>
                     <Form.Control id="signatoryAddress" placeholder="" ref={addressInput} />
                 </Form.Group>
                 <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Poznamky k produktu</Form.Label>
                    <Form.Control as="textarea" rows={10} cols={40} ref={textInput}/>
                </Form.Group>
                </div>
                <hr/>
                <div className='submitButton'>
                    <Button variant="outline-primary" type="button" onClick={(e) => createBatch(e)}>Submit</Button>
                </div>
            </fieldset>
        </Form>

    );
}

