import React from 'react';
import ReactDOM from "react-dom";
import { useContext, useEffect, useState } from 'react';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'react-bootstrap';


interface EmployerInfohead {
    changeTableInProccessBatchesState: (arg: boolean) => void;
    changeTableFinishedBatchesState: (arg: boolean) => void;
    changeClassName: (arg: string) => void;
    resetState: () => void;
    inProccessBatchCounter: number;
    finishedBatchCounter: number;
}

export const EmployerInfohead: React.FC<EmployerInfohead> = ({changeTableInProccessBatchesState, changeTableFinishedBatchesState, changeClassName,
    resetState, inProccessBatchCounter, finishedBatchCounter}) => {
    const [currentBatchId, setCurrentBatchId] = useState("");
    const supplychain = useContext(SupplyChainContext);

    return (
        <div className='adminInfohead'>
            <div className='adminInfoitem'>
                <div>
                    <h3>Šarže v procese</h3>
                </div>
                <div className='adminInfobody'>
                    <div>
                        <FontAwesomeIcon className='inProccess' icon={faBoxesStacked} size="4x" />
                    </div>
                    <div className='adminInfocounter'>
                        {inProccessBatchCounter}
                    </div>
                    <div>
                    <Button onClick={() =>{
                                resetState();
                                changeTableInProccessBatchesState(true);
                                changeClassName("App");
                            }} variant="outline-info">Zobraziť</Button>
                    </div>
                </div>
            </div>

            <div className='adminInfoitem'>
                <div>
                    <h3>Vybavené šarže</h3>
                </div>
                <div className='adminInfobody'>
                    <div>
                        <FontAwesomeIcon className='success' icon={faBoxesStacked} size="4x" />
                    </div>
                    <div className='adminInfocounter'>
                        {finishedBatchCounter}
                    </div>
                    <div>
                        <Button onClick={() =>{
                                resetState();
                                changeTableFinishedBatchesState(true);
                                changeClassName("App");
                            }} variant="outline-info">Zobraziť</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}




