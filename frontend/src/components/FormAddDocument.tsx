import * as React from 'react';
import { Form, Button } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { Buffer } from 'buffer';

interface FormAddDocumentProps {
    currentBatchId: string
}

export const FormAddDocument: React.FC<FormAddDocumentProps> = ({currentBatchId}) => {
    const supplychain = useContext(SupplyChainContext);
    const temporaryBatchId = useRef<HTMLInputElement>(null);
    const textInput = useRef<HTMLTextAreaElement>(null);


    const createBatch = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();    
        const date = Date.now();
        const batchId: string = temporaryBatchId.current!.value;
        const ipfsHash =  await ipfs.addToIPFS(textInput.current!.value);

        if (!supplychain.instance) throw Error("Greeter instance not ready");
        if (supplychain.instance) {
            let addDocumentTx: ContractTransaction;
            try{
                addDocumentTx = await supplychain.instance.addDocumentBySupplier(batchId, ipfsHash, date);
                const receipt: ContractReceipt = await addDocumentTx.wait();
                // @ts-ignore
                console.log("Batch id:" , receipt.events[0].args[0], "Nazov stagu: ", receipt.events[0].args[1], "Ipfs hash: " , receipt.events[0].args[2]);
            } catch {
                console.log("Transakcia bola vratena");
            }
        }
     };

    return (
        <Form>
            <h2>Stage ukonceny</h2>
            <fieldset >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="disabledTextInput">Docasne batchId:</Form.Label>
                        <Form.Control id="disabledTextInput" value={currentBatchId} readOnly ref={temporaryBatchId}/>
                </Form.Group>
                 <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Poznamky k produktu</Form.Label>
                    <Form.Control as="textarea" rows={10} cols={40} ref={textInput}/>
                </Form.Group>
                <Button type="button" onClick={(e) => createBatch(e)}>Submit</Button>
            </fieldset>
        </Form>

    );
}

