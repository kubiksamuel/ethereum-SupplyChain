import * as React from 'react';
import { Form, Button, CloseButton } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";
import { ModalAlert } from './ModalAlert';


import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { Buffer } from 'buffer';

interface FormAddDocumentProps {
    setProccessedBatch: (batchId: string) => void;
    currentBatchId: string;
    changeClassName: (classComponentName: string) => void;
    selectBatch: (batchId: string, stageFee: string) => void; 
}

export const FormAddDocument: React.FC<FormAddDocumentProps> = ({setProccessedBatch, currentBatchId, changeClassName, selectBatch}) => {
    const supplychain = useContext(SupplyChainContext);
    const temporaryBatchId = useRef<HTMLInputElement>(null);
    const textInput = useRef<HTMLTextAreaElement>(null);
    const [modalState, setModalState] = useState(false);

    const closeModal = () => setModalState(false);


    const addDocument = async (
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
                setProccessedBatch(receipt.events[0].args[0]);
                // @ts-ignore
                console.log("Batch id:" , receipt.events[0].args[0], "Nazov stagu: ", receipt.events[0].args[1], "Ipfs hash: " , receipt.events[0].args[2]);
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
                                    selectBatch("", "");
                                    changeClassName("App");
                                }}  variant="white" />
                </div>
                <div className='formHeader'>
                    <h3>Pridať údaje k etape:</h3>
                </div>
                <hr/>
                <fieldset >
                    <div className='formInputs'>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="disabledTextInput">Docasne batchId:</Form.Label>
                            <Form.Control id="disabledTextInput" value={currentBatchId} readOnly ref={temporaryBatchId}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Poznamky k produktu</Form.Label>
                        <Form.Control as="textarea" rows={10} cols={40} ref={textInput}/>
                    </Form.Group>
                    </div>
                    <hr/>
                    <div className='submitButton'>
                        <Button variant="outline-primary" type="button" onClick={(e) => addDocument(e)}>Potvrdiť</Button>
                    </div>
                </fieldset>
            </Form>
            <ModalAlert modalState={modalState} closeModal={closeModal}></ModalAlert>
        </div>
    );
}

