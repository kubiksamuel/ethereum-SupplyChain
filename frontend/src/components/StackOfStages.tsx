import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { StageCard } from './StageCard';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import QRCode from "react-qr-code";
import * as htmlToImage from 'html-to-image';
import { Spinner, Stack } from 'react-bootstrap';
import * as ipfs from '../functionality/Ipfs';
import * as dateParser from '../functionality/DateParser';

interface StackOfStagesProps {
    selectedBatchId: string
}

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

export const StackOfStages: React.FC<StackOfStagesProps> = ({selectedBatchId}) => {
    const supplychain = useContext(SupplyChainContext);
    const [stageList, setStageList] = useState<Array<Stage>>([]);
    const [loading, setLoading] = useState(true);


    const loadPage = () => {
        setLoading(false)
        htmlToImage.toPng(document.getElementById('qrCodeEl')!)
        .then(function (dataUrl) {
            document.getElementById('qr')!.setAttribute("src", dataUrl);
            document.getElementById('qrCodeEl')!.style.display = "none";
        });
    }


    useEffect(() => {
        printStages();
        setTimeout(() => loadPage(), 2000)
    },[]); 

    const printStages = async() => {
        if (!supplychain.instance) throw Error("SupplyChain instance not ready");
        if (supplychain.instance) {
                const stageParsedList = [];
                const numberOfStages = ((await supplychain.instance.batches(selectedBatchId)).stageCount).toNumber();
                for(let i = 1; i <= numberOfStages; i++) {
                    const stage = await supplychain.instance.batchStages(selectedBatchId, i);
                    let stageName = stage.name;
                    let stageOrder = stage.id.toNumber();
                    let supplierFee = stage.supplierFee.toString();
                    let dateReceive = dateParser.parseDate(stage.dateReceive.toNumber());

                    let dateDone =  dateParser.parseDate(stage.dateDone.toNumber());

                    let state = stage.state;
                    let signatoryAddress = stage.signatory.toString();
                    let signatory = await supplychain.instance.rolesInfo(signatoryAddress);
                    let signatoryName = signatory.name.toString();
                    let supplierAddress = stage.supplier.toString();
                    let supplier = await supplychain.instance.rolesInfo(supplierAddress);
                    let supplierName = supplier.name.toString();
                    let stageNotes = "";
                    if(stage.state !== 0) {
                        stageNotes = await ipfs.getFromIPFS(stage.docHash);
                    }
                    let stageItem: Stage = {stageName: stageName, stageOrder: stageOrder, supplierFee: supplierFee, dateReceive: dateReceive, dateDone: dateDone,
                        state: state, signatoryAddress: signatoryAddress, signatoryName: signatoryName,
                        supplierAddress: supplierAddress, supplierName: supplierName, stageNotes: stageNotes};
                    
                    stageParsedList.push(stageItem)
                }
                setStageList(stageParsedList);
            }
        }   


    return (
        <>
        {!loading? (<div className="StagesWrapper" id = "stage">
            <div className="stagesHeader">
                <div>
                    <h2 id='batchIdStages'>ID šarže: {selectedBatchId}</h2>
                </div>
                <div className="qrDivImg">
                    <img src="" alt="qrCode" className='qrCodeImg' id='qr'/>
                </div>
            </div>
            <Stack gap={3}>
                {stageList.map(stage => (
                <div key={stage.stageOrder}>
                {stage.stageOrder>1 && <FontAwesomeIcon icon={faAnglesDown} size="4x"/>}
                <StageCard stage={stage}></StageCard>
                </div>
                ))}
            </Stack>
            <div id="qrCodeEl" ><QRCode  value={selectedBatchId}/></div>
        </div>) : ( <div className='stagesLoader'>  
                        <Spinner animation="grow" variant="danger" />
                        <Spinner animation="grow" variant="warning" />
                        <Spinner animation="grow" variant="success" />
                    </div>)}
        </>
    );
}