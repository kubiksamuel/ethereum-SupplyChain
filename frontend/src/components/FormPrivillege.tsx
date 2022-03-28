import * as React from 'react';
import { Form, Button } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';

export const FormPrivillege = () => {
    const supplychain = useContext(SupplyChainContext);
    const addressInput= useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const roleInput = useRef<HTMLSelectElement>(null);

    const setPrivillege = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();    
        const address: string = addressInput.current!.value;
        const name: string = nameInput.current!.value;
        const role: string = roleInput.current!.value;
        if (!supplychain.instance) throw Error("Greeter instance not ready");
        if (supplychain.instance) {
            let setPrivillegeTx: ContractTransaction;
            try{
                if(role === "Signatory"){
                    setPrivillegeTx = await supplychain.instance.setPrivillegeSignatory(address, name);
                    const receipt: ContractReceipt = await setPrivillegeTx.wait();
                    // @ts-ignore
                    console.log("Adresa:" , receipt.events[0].args[0], "Meno clen: ", receipt.events[0].args[1], "Rola: " , receipt.events[0].args[2]);
                } else if (role === "Supplier") {
                    setPrivillegeTx = await supplychain.instance.setPrivillegeSupplier(address, name);
                    const receipt: ContractReceipt = await setPrivillegeTx.wait();
                    // @ts-ignore
                    console.log("Adresa:" , receipt.events[0].args[0], "Meno clen: ", receipt.events[0].args[1], "Rola: " , receipt.events[0].args[2]);
                } else {
                    console.log("Nezadali ste ziadnu rolu");
                    return;
                }
            } catch {
                console.log("Transakcia bola vratena");
            }
        }
     };

    return (
        <Form>
            <fieldset >
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="disabledTextInput">Adresa clena:</Form.Label>
                        <Form.Control id="disabledTextInput" placeholder="" ref={addressInput}/>
                </Form.Group>
                <Form.Group className="mb-3">
                     <Form.Label htmlFor="disabledTextInput">Nazov clena:</Form.Label>
                     <Form.Control id="disabledTextInput" placeholder="" ref={nameInput} />
                 </Form.Group>
                 <Form.Group className="mb-3">
                     <Form.Label htmlFor="disabledSelect">Vyber rolu:</Form.Label>
                     <Form.Select id="disabledSelect" ref={roleInput} >
                         <option></option>
                         <option value={"Signatory"}>Schvalovatel</option>
                         <option value={"Supplier"}>Zasobovatel</option>
                     </Form.Select>
                </Form.Group>
                <Button type="button" onClick={(e) => setPrivillege(e)}>Submit</Button>
            </fieldset>
        </Form>

    );
}

