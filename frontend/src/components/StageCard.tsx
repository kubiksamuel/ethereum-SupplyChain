import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { CanvasExample } from './CanvasExample';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "../hardhat/SymfoniContext";
import { Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import { Accordion, Button, Stack } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
import * as ipfs from '../functionality/Ipfs';



interface Stage {
    stageName: string;
    stageOrder: number;
    supplierFee: string;
    dateReceive: string;
    dateDone: string;
    state: number;
    signatoryAddress: string;
    signatoryName: string;
    supplierAddress: string;
    supplierName: string;
    stageNotes: string;
}   

interface StackOfStagesProps {
    stage: Stage
}


export const StageCard: React.FC<StackOfStagesProps> = ({stage}) => {
    return (
        <div className="stageCard">
            <h1>#{stage.stageOrder} {stage.stageName}</h1>
            <div><b>Stav:</b> {stage.state == 0 ? <Badge pill bg="warning" text="dark"> Vybavuje sa...</Badge> :
                stage.state == 1 ? <Badge pill bg="info">Pripravené na prevzatie</Badge> :
                <Badge pill bg="success">Ukončené</Badge>

            }</div>
            <hr/>         
            <div><b>Datum prijatia:</b> {stage.dateReceive}</div>
            <hr/>
            <div><b>Príjmateľ/Schvaľovateľ:</b> {stage.signatoryName} ({stage.signatoryAddress})</div>
            <hr/>
            {stage.stageOrder > 1 && <div><b>Výrobca:</b> {stage.supplierName} ({stage.supplierAddress})</div>}
            {stage.stageOrder > 1 && <hr/>}
            {stage.state > 0 && <div><b>Datum vybavenia:</b> {stage.dateDone}</div>}
            {stage.state > 0 && <hr/>}
            <div><b>Výrobná cena:</b> {ethers.utils.formatEther(stage.supplierFee)} Ether</div>
            {stage.state > 0 && <div style={{textAlign: "center"}}><CanvasExample stageNotes={stage.stageNotes} stageName={stage.stageName}></CanvasExample></div>}
        </div>
    );
}


//                let state = stage.state == 0? "Vybavuje sa" : stage.state == 1 ? "Vybavene, caka na prevzatie"  : "Ukoncene";




// interface Stage {
//     stageName: string;
//     stageOrder: number;
//     supplierFee: string;
//     dateReceive: string;
//     dateDone: string;
//     state: number;
//     signatoryAddress: string;
//     signatoryName: string;
//     supplierAddress: string;
//     supplierName: string;
//     stageNotes: string;
// }  




// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }