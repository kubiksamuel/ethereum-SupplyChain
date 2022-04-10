import React from 'react';
import ReactDOM from "react-dom";
import { StageNotes } from './StageNotes';
import { Badge } from 'react-bootstrap'
import { ethers } from 'ethers';

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
            <div><b>Stav:</b> {stage.state == 0 ? <Badge className="badge" pill bg="warning" text="dark"> Vybavuje sa...</Badge> :
                stage.state == 1 ? <Badge className="badge" pill bg="info">Pripravené na prevzatie</Badge> :
                <Badge className="badge" pill bg="success">Ukončené</Badge>
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
            {stage.state > 0 && <div style={{textAlign: "center"}}><StageNotes stageNotes={stage.stageNotes} stageName={stage.stageName}></StageNotes></div>}
        </div>
    );
}