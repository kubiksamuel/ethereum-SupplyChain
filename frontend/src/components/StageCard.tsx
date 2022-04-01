import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "../hardhat/SymfoniContext";
import { Badge } from 'react-bootstrap'


import { Accordion, Button, Stack } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from 'ethers';
import * as ipfs from '../functionality/Ipfs';


interface Stage {
    stageName: string;
    stageOrder: number;
    supplierFee: string;
    dateReceive: string;
    dateDone: string;
    state: string;
    signatory: string;
    supplier: string;
    stageNotes: string;
}   

interface StackOfStagesProps {
    stage: Stage
}


export const StageCard: React.FC<StackOfStagesProps> = ({stage}) => {
    return (
        <div className="stageCard">
            <h1>#{stage.stageOrder}{stage.stageName}</h1>
            <div>Stav: {stage.state == 0 ? <Badge pill bg="warning" text="dark"> Vybavuje sa...</Badge> :
                stage.state == 1 ? <Badge pill bg="info">Pripravené na prevzatie</Badge> :
                <Badge pill bg="success">Ukončené</Badge>

            }</div>
            <hr/>         
            <div>Datum prijatia: {stage.dateReceive}</div>
            <hr/>
            <div>Príjmateľ/Schvľovateľ: {stage.signatory}</div>
            <hr/>
            <div>Výrobca: {stage.supplier}</div>
            <hr/>
            { stage.state?
                <div>Datum vybavenia: {stage.dateDone}</div> :
                <div></div>
            }
            <div>Výrobná cena: {ethers.utils.formatEther(stage.supplierFee)} Ether</div>
        </div>
    );
}


//                let state = stage.state == 0? "Vybavuje sa" : stage.state == 1 ? "Vybavene, caka na prevzatie"  : "Ukoncene";




interface Stage {
    stageName: string;
    stageOrder: number;
    supplierFee: string;
    dateReceive: string;
    dateDone: string;
    state: string;
    signatory: string;
    supplier: string;
    stageNotes: string;
}   




// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }