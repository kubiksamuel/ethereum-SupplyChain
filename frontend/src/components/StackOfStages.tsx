import React, { useContext, useEffect, useState } from 'react';
// import { SupplyChain } from './hardhat/typechain/SupplyChain';
// import { Greeter } from './components/Greeter';
// import { Greeter } from './components/Greeter';
import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
import { FormStartStage } from './FormStartStage';
import { StageCard } from './StageCard';
import { SupplyChainContext } from "./../hardhat/SymfoniContext";
import arrow from '../img/arrow.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesDown } from '@fortawesome/free-solid-svg-icons';
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import * as htmlToImage from 'html-to-image';
import { toPng } from 'html-to-image';




import { Button, Stack } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { ethers } from 'ethers';
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
    // const [currentBatchId, setCurrentBatchId] = useState("");
    const supplychain = useContext(SupplyChainContext);
    const [stageList, setStageList] = useState<Array<Stage>>([]);


    
//     const selectBatch = (batchId: string):void => {
//         setCurrentBatchId(batchId);
//    }

    useEffect(() => {
    // while(!supplychain.instance){
        
    // }
     printStages();
  },[]); 

//    if(supplychain.instance){
//     supplychain.instance.on("StageCompleted", (batchId, stageName) => {
//         if(batchId == currentBatchId) {
//           setCurrentBatchId("");
//         }
//         console.log("Odchyteny event s argumentami: " + batchId, stageName);
//     });
// }    


const printStages = async() => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            console.log("Selected Batch: " + selectedBatchId);
            const stageParsedList = [];
            const numberOfStages = ((await supplychain.instance.batches(selectedBatchId)).stageCount).toNumber();
            for(let i = 1; i <= numberOfStages; i++){
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
                if(stage.state != 0) {
                    stageNotes = await ipfs.getFromIPFS(stage.docHash);
                }
                console.log("Stage: " + state);

                let stageItem: Stage = {stageName: stageName, stageOrder: stageOrder, supplierFee: supplierFee, dateReceive: dateReceive, dateDone: dateDone,
                    state: state, signatoryAddress: signatoryAddress, signatoryName: signatoryName,
                     supplierAddress: supplierAddress, supplierName: supplierName, stageNotes: stageNotes};
                
                console.log(Object.entries(stageItem).flat())        
                stageParsedList.push(stageItem)
            }
            setStageList(stageParsedList);
        } catch {
            console.log("Nastala neocakavana chybaaaa");
        }
    }
}
    // const generateQrCanvas = () => {
    //     console.log("CC");
    //     var el: HTMLElement = document.getElementById("qrCodeEl")!;
    //     let qrImage: HTMLElement = new HTMLDivElement();
    //     html2canvas(el).then(canvas => {
    //         qrImage = canvas; 
    //     });
    //     document.getElementById("qr")!.appendChild(qrImage);
    //     console.log("canvas: " + qrImage)
    //     document.getElementById("qr")!.appendChild(qrImage).innerHTML = "CAAAu";
    // }

    // const getPDF = () => {
        // console.log("CC");
        // var el: HTMLElement = document.getElementById("qrCodeEl")!;
        // let qrImage: HTMLElement = new HTMLDivElement();
        // html2canvas(el).then(canvas => {
        // var img =canvas.toDataURL("image/png");
        // var doc = new jsPDF('l', 'cm'); 
        // doc.text("Hello world!", 10, 10);
        // doc.save('reporte.pdf'); 
    // });
        // console.log("get pdf");

//         html2canvas(document.getElementById("qrCodeEl")!).then(canvas =>  {
//             console.log("canvas: " + canvas);
//         var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

//         var doc = new jsPDF('l', 'cm');
//         console.log("image: " + image);
//         doc.text(document.getElementById("qrCodeEl")!.innerHTML, 1, 1);
//         doc.save('sample-file.pdf');
//       });
//  }

    //     htmlToImage.toPng(document.getElementById('qrCodeEl')!)
    //     .then(function (dataUrl) {
    //         console.log(dataUrl, ' dataurl');
    //         // document.getElementById('qr')!.setAttribute("src", dataUrl);
    //         return dataUrl;
    //     });
    //     return "ahoj";
    // }


    useEffect(() => {
        htmlToImage.toPng(document.getElementById('qrCodeEl')!)
        .then(function (dataUrl) {
            console.log(dataUrl, ' dataurl');
            document.getElementById('qr')!.setAttribute("src", dataUrl);
            document.getElementById('qrCodeEl')!.style.display = "none";

        });
      },[]); 









  return (
      <div>
      {/* <button  id="getPDF" type="button" className="btn btn-info" onClick={() =>{getPDF()}}>
        Download PDF
    </button> */}
      <div className="StagesWrapper" id = "stage">

        <div id="qrCodeEl" ><QRCode  value={"Ahoj svjete!"}/></div>
        <img src="" alt="qr" width="400px" height="200px" className='qr' id='qr'/>

        <h2>ID šarže: {selectedBatchId}</h2>
        <Stack gap={3}>
            {stageList.map(stage => (
            <div key={stage.stageOrder}>
            {stage.stageOrder>1 && <FontAwesomeIcon icon={faAnglesDown} size="4x"/>}
            <StageCard stage={stage}></StageCard>
            </div>
            ))}
        </Stack>
     </div>
     </div>
  );
}


{/* <QRCode  value={"Ahoj svjete!"}/> */}



// {loading ? <TableOfBatches></TableOfBatches>
// : <div>pracujem</div> }