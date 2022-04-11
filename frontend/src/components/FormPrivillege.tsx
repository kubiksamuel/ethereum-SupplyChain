import * as React from 'react';
import { useRef, useContext, useState } from "react";
import { Form, Button, CloseButton } from 'react-bootstrap'
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { ModalAlert } from './ModalAlert';
import { ContractReceipt, ContractTransaction } from 'ethers';

interface FormPrivillegeProps {
    addUserCounter: () => void;
    changeFormPrivillegeState: (arg: boolean) => void;
    changeClassName: (arg: string) => void;
}

export const FormPrivillege: React.FC<FormPrivillegeProps> = ({addUserCounter, changeFormPrivillegeState, changeClassName}) => {
    const supplychain = useContext(SupplyChainContext);
    const addressInput= useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const roleInput = useRef<HTMLSelectElement>(null);
    const [modalState, setModalState] = useState(false);

    const closeModal = () => setModalState(false);

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
                    addUserCounter();
                    // @ts-ignore
                    console.log("Adresa:" , receipt.events[0].args[0], "Meno clen: ", receipt.events[0].args[1], "Rola: " , receipt.events[0].args[2]);
                } else if (role === "Supplier") {
                    setPrivillegeTx = await supplychain.instance.setPrivillegeSupplier(address, name);
                    const receipt: ContractReceipt = await setPrivillegeTx.wait();
                    addUserCounter();
                    // @ts-ignore
                    console.log("Adresa:" , receipt.events[0].args[0], "Meno clen: ", receipt.events[0].args[1], "Rola: " , receipt.events[0].args[2]);
                } else {
                    console.log("Nezadali ste ziadnu rolu");
                    return;
                }
            } catch {
                setModalState(true);
                console.log("Transakcia bola vratena");
            }
        }
     };

    return (
        <div>
            <Form>
                <div className="bg-dark p-1 closeButton">
                    <CloseButton onClick={() =>{
                                    changeFormPrivillegeState(false);
                                    changeClassName("App");
                                }}  variant="white" />
                </div>
                <div className='formHeader'>
                    <h3>Pridať používateľa</h3>
                </div>
                <hr/>
                <fieldset >
                    <div className='formInputs'>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="memberAddress">Adresa používateľa:</Form.Label>
                            <Form.Control id="memberAddress" placeholder="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" ref={addressInput}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="memberName">Meno používateľa:</Form.Label>
                        <Form.Control id="memberName" placeholder="Meno" ref={nameInput} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="memberRole">Rola používateľa:</Form.Label>
                        <Form.Select id="memberRole" ref={roleInput} >
                            <option value={"Signatory"}>Schvaľovateľ</option>
                            <option value={"Supplier"}>Výrobca</option>
                        </Form.Select>
                    </Form.Group>
                    </div>
                    <hr/>
                    <div className='submitButton'>
                        <Button variant="outline-primary" type="button" onClick={(e) => setPrivillege(e)}>Submit</Button>
                    </div>
                </fieldset>
            </Form>
            <ModalAlert modalState={modalState} closeModal={closeModal} type={"transaction"}></ModalAlert>
        </div>
    );
}

