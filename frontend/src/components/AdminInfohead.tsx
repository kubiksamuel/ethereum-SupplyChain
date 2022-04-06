import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'

import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
import { StackOfStages } from './StackOfStages';
import { TableOfBatches } from './TableOfBatches';


interface AdminInfoheadProps {
    changeFormCreateBatchState: (arg: boolean) => void;
    changeFormPrivillegeState: (arg: boolean) => void;
    changeTableUsersState: (arg: boolean) => void;
    changeTableBatchesState: (arg: boolean) => void;
    selectBatch: (arg: string) => void;
    changeClassName: (arg: string) => void;
    batchCounter: number;
    userCounter: number;
}

export const AdminInfohead: React.FC<AdminInfoheadProps> = ({changeFormCreateBatchState, changeFormPrivillegeState, changeTableUsersState,
    changeTableBatchesState, selectBatch, changeClassName, batchCounter, userCounter}) => {
    const [currentBatchId, setCurrentBatchId] = useState("");
    const supplychain = useContext(SupplyChainContext);


    // const selectBatch = (batchId: string): void => {
    //     console.log("Function");

    //     setCurrentBatchId(batchId);
    // }

    return (

        <div className='adminInfohead'>
            <div className='adminInfoitem'>
                <div>
                    <h3>Používatelia</h3>
                </div>
                <div className='adminInfobody'>
                    <div>
                        <FontAwesomeIcon icon={faUsers} size="4x" />

                    </div>
                    <div className='adminInfocounter'>
                        {userCounter}
                    </div>
                    <div className='buttonGroup'>
                        <ButtonGroup vertical>
                            <Button onClick={() =>{
                                selectBatch("");
                                changeFormPrivillegeState(true);
                                changeClassName("belowLayer");
                            }} variant="outline-primary">Pridať</Button>
                            <Button onClick={() =>{
                                selectBatch("");
                                changeTableUsersState(true);
                                changeTableBatchesState(false);
                                changeClassName("App");
                            }} variant="outline-info">Zobraziť</Button>
                        </ButtonGroup >
                    </div>
                </div>
            </div>
            <div className='adminInfoitem'>
                <div>
                    <h3>Šarže</h3>
                </div>
                <div className='adminInfobody'>
                    <div>
                        <FontAwesomeIcon icon={faBoxesStacked} size="4x" />
                    </div>
                    <div className='adminInfocounter'>
                        {batchCounter}
                    </div>
                    <div className='buttonGroup'>
                        <ButtonGroup vertical>
                        <Button onClick={() =>{
                                selectBatch("");
                                changeFormCreateBatchState(true);
                                changeClassName("belowLayer");
                            }} variant="outline-primary">Pridať</Button>
                            <Button onClick={() =>{
                                selectBatch("");
                                changeTableBatchesState(true);
                                changeTableUsersState(false);
                                changeClassName("App");
                            }} variant="outline-info">Zobraziť</Button>
                        </ButtonGroup >
                    </div>
                </div>
            </div>
        </div>
    );
}




