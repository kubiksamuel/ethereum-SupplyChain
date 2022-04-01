import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { SupplyChainContext } from "../hardhat/SymfoniContext";

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
            <h1>{stage.stageName}</h1>
            <div>Datum prijatia: {stage.dateReceive}</div>

        </div>
    );
}








// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }