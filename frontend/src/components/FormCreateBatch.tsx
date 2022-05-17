import * as React from 'react';
import { useRef, useContext, useState } from "react";
import { Form, Button, CloseButton } from 'react-bootstrap'
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { ModalAlert } from './ModalAlert';
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';

interface User {
    userId: number;
    userAddress: string;
    userName: string;
    signatoryRole: boolean;
    supplierRole: boolean;
  }

interface FormCreateBatchProps {
    addInProccessBatchCounter: () => void;
    changeFormCreateBatchState: (arg: boolean) => void;
    changeClassName: (arg: string) => void;
    userList: Array<User>;
}

export const FormCreateBatch: React.FC<FormCreateBatchProps> = ({addInProccessBatchCounter, changeFormCreateBatchState, changeClassName, userList}) => {
    const supplychain = useContext(SupplyChainContext);
    const addressInput= useRef<HTMLSelectElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const textInput = useRef<HTMLTextAreaElement>(null);
    const [modalState, setModalState] = useState(false);

    const closeModal = () => setModalState(false);

    const createBatch = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();    
        const address: string = addressInput.current!.value;
        const name: string = nameInput.current!.value;
        const date = Date.now();
        const ipfsHash =  await ipfs.addToIPFS(textInput.current!.value);
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
            let createBatchTx: ContractTransaction;
            try{
                createBatchTx = await supplychain.instance.createBatch(name, address, date, ipfsHash);
                const receipt: ContractReceipt = await createBatchTx.wait();
                addInProccessBatchCounter();
            } catch {
                setModalState(true);
            }
        }
     };

    return (
    <div>
        <Form>
            <div className="bg-dark p-1 closeButton">
                <CloseButton onClick={() =>{
                                changeFormCreateBatchState(false);
                                changeClassName("App");
                            }}  variant="white" />
            </div>
            <div className='formHeader'>
                <h3>Pridať šaržu</h3>
            </div>
            <hr/>
            <fieldset >
                <div className='formInputs'>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="productName">Názov produktu:</Form.Label>
                        <Form.Control id="productName" placeholder="Produkt A" ref={nameInput}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="memberRole">Signatár:</Form.Label>
                     <Form.Select id="memberRole" ref={addressInput} >
                     { 
                        userList.map(user => (
                            user.signatoryRole && user.userId !== 1 && <option key={user.userAddress} value={user.userAddress}>{user.userName}</option>
                        ))}
                     </Form.Select>
                 </Form.Group>
                 <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Poznámky k produktu:</Form.Label>
                    <Form.Control as="textarea" placeholder='Poznámky k produktu...' rows={10} cols={40} ref={textInput}/>
                </Form.Group>
                </div>
                <hr/>
                <div className='submitButton'>
                    <Button variant="outline-primary" type="button" onClick={(e) => createBatch(e)}>Potvrdiť</Button>
                </div>
            </fieldset>
      </Form>
      <ModalAlert modalState={modalState} closeModal={closeModal} type={"transaction"}></ModalAlert>
    </div>
    );
}

