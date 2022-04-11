import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import { Button, ButtonGroup } from 'react-bootstrap';

interface AdminInfoheadProps {
    changeFormCreateBatchState: (arg: boolean) => void;
    changeFormPrivillegeState: (arg: boolean) => void;
    changeTableUsersState: (arg: boolean) => void;
    changeTableInProccessBatchesState: (arg: boolean) => void;
    changeTableFinishedBatchesState: (arg: boolean) => void;
    selectBatch: (arg: string) => void;
    changeClassName: (arg: string) => void;
    resetState: () => void;
    inProccessBatchCounter: number;
    finishedBatchCounter: number;
    userCounter: number;
}

export const AdminInfohead: React.FC<AdminInfoheadProps> = ({changeFormCreateBatchState, changeFormPrivillegeState, changeTableUsersState,
        changeTableInProccessBatchesState, changeTableFinishedBatchesState, selectBatch, changeClassName, resetState, inProccessBatchCounter, finishedBatchCounter, userCounter}) => {
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
                                resetState();
                                changeTableUsersState(true);
                                changeClassName("App");
                            }} variant="outline-info">Zobraziť</Button>
                            <Button onClick={() =>{
                                changeFormPrivillegeState(true);
                                changeClassName("belowLayer");
                            }} variant="outline-primary">Pridať</Button>
                        </ButtonGroup >
                    </div>
                </div>
            </div>
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
                    <div className='buttonGroup'>
                        <ButtonGroup vertical>
                        <Button onClick={() =>{
                                resetState();
                                changeClassName("App");
                                changeTableInProccessBatchesState(true);
                            }} variant="outline-info">Zobraziť</Button>
                        <Button onClick={() =>{
                                changeFormCreateBatchState(true);
                                changeClassName("belowLayer");
                            }} variant="outline-primary">Pridať</Button>
                        </ButtonGroup >
                    </div>
                </div>
            </div>

            <div className='adminInfoitem'>
                <div>
                    <h3>Ukončené šarže</h3>
                </div>
                <div className='adminInfobody'>
                    <div>
                        <FontAwesomeIcon className='success' icon={faBoxesStacked} size="4x"/>
                    </div>
                    <div className='adminInfocounter'>
                        {finishedBatchCounter}
                    </div>
                    <div className='buttonGroup'>
                        <Button onClick={() =>{
                            resetState();
                            changeClassName("App");
                            changeTableFinishedBatchesState(true);
                        }} variant="outline-info">Zobraziť</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}




