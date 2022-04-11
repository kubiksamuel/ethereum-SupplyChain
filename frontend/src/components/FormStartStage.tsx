import * as React from 'react';
import { useRef, useContext, useState } from "react";
import { Form, Button, CloseButton} from 'react-bootstrap'
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { ModalAlert } from './ModalAlert';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { ethers } from 'ethers';

interface User {
    userId: number;
    userAddress: string;
    userName: string;
    signatoryRole: boolean;
    supplierRole: boolean;
  }

interface FormStartStageProps {
    setProccessedBatch: (batchId: string) => void;
    currentBatchId: string;
    currentStageFee: string;
    changeClassName: (classComponentName: string) => void;
    selectBatch: (batchId: string, stageFee: string) => void; 
    userList: Array<User>;
    changeFormStartStageState: (showTable: boolean) => void;
}

export const FormStartStage: React.FC<FormStartStageProps> = ({setProccessedBatch, currentBatchId, currentStageFee, changeClassName, selectBatch,
     userList, changeFormStartStageState}) => {
    const supplychain = useContext(SupplyChainContext);
    const temporaryBatchId = useRef<HTMLInputElement>(null);
    const addressSupplierInput= useRef<HTMLSelectElement>(null);
    const addressSignatoryInput= useRef<HTMLSelectElement>(null);
    const stageNameInput= useRef<HTMLInputElement>(null);
    const stagePriceInput= useRef<HTMLInputElement>(null);
    const [modalState, setModalState] = useState(false);

    const closeModal = () => setModalState(false);

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
        const date = Date.now();
        if (!supplychain.instance) throw Error("Greeter instance not ready");
        if (supplychain.instance) {
            let startStageTx: ContractTransaction;
            try{
                const stagePrice: ethers.BigNumber = ethers.utils.parseEther(ethPrice);
                startStageTx = await supplychain.instance.startStage(batchId, addressSupplier, addressSignatory, stagePrice, stageName, date,
                                                                         {value: currentStageFee});
                const receipt: ContractReceipt = await startStageTx.wait();
                //@ts-ignore
                setProccessedBatch(receipt.events[0].args[0]);
                // @ts-ignore
                console.log("Batch id:" , receipt.events[0].args[0], "Nazov ukonceneho stagu: ", receipt.events[0].args[1]);
                // @ts-ignore
                console.log("Batch id:" , receipt.events[1].args[0], "Poradie stagu: ", receipt.events[1].args[1], "Nazov noveho stagu: ", receipt.events[1].args[2])
                // @ts-ignore
                console.log("Supplier address: ", receipt.events[1].args[3], "Signatory address: ", receipt.events[1].args[4], "Supplier fee: ", receipt.events[1].args[5]);

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
                                    selectBatch("", "")
                                    changeClassName("App");
                                    changeFormStartStageState(false);
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
                        <Form.Label htmlFor="signatoryAddress">Schvaľovateľ:</Form.Label>
                        <Form.Select id="signatoryAddress" ref={addressSignatoryInput} >
                        { 
                            userList.map(user => (
                                user.signatoryRole && <option key={user.userAddress} value={user.userAddress}>{user.userName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="supplierAddress">Výrobcu:</Form.Label>
                        <Form.Select id="supplierAddress" ref={addressSupplierInput} >
                        { 
                            userList.map(user => (
                                user.supplierRole && <option key={user.userAddress} value={user.userAddress}>{user.userName}</option>
                            ))}
                        </Form.Select>
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
                        <Button variant="outline-primary" type="button" onClick={(e) => createBatch(e)}>Submit</Button>
                    </div>

                </fieldset>
            </Form>
            <ModalAlert modalState={modalState} closeModal={closeModal} type={"transaction"}></ModalAlert>
        </div>
    );
}

