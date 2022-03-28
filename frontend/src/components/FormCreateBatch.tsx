import * as React from 'react';
import { Form, Button } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';


export const FormCreateBatch = () => {
    const supplychain = useContext(SupplyChainContext);
    const addressInput= useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const textInput = useRef<HTMLTextAreaElement>(null);

    //0x489744f8f0b5c95e1643c6a7e907a904ce2ee749ab7ca33c5d9c3d6e837f2b12
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
            <h2>Objednavka produktu</h2>
            <fieldset >
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
                <Button type="button" onClick={(e) => createBatch(e)}>Submit</Button>
            </fieldset>
        </Form>

    );
}

