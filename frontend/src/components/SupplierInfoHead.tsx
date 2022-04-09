// import React, { useContext, useEffect, useState } from 'react';
// // import { SupplyChain } from './hardhat/typechain/SupplyChain';
// // import { Greeter } from './components/Greeter';
// // import { Greeter } from './components/Greeter';
// import { TableOfSignatoryBatches } from './TableOfSignatoryBatches';
// import { FormStartStage } from './FormStartStage';
// import { SupplyChainContext } from "./../hardhat/SymfoniContext";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUsers, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'

// import { Button, ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
// import ReactDOM from "react-dom";
// import { ethers } from 'ethers';
// import { StackOfStages } from './StackOfStages';
// import { TableOfBatches } from './TableOfBatches';

// interface SupplierInfoHeadProps {
//     // changeFormCreateBatchState: (arg: boolean) => void;
//     // changeFormPrivillegeState: (arg: boolean) => void;
//     // changeTableUsersState: (arg: boolean) => void;
//     // changeTableBatchesState: (arg: boolean) => void;
//     // selectBatch: (arg: string) => void;
//     // changeClassName: (arg: string) => void;
//     // resetState: () => void;
//     // batchCounter: number;
//     // userCounter: number;
// }


// export const SupplierInfoHead: React.FC<SupplierInfoHeadProps> = ({}) => {
//     const [currentBatchId, setCurrentBatchId] = useState("");
//     const supplychain = useContext(SupplyChainContext);


//     return (

//         <div className='adminInfohead'>
//             <div className='adminInfoitem'>
//                 <div>
//                     <h3>Používatelia</h3>
//                 </div>
//                 <div className='adminInfobody'>
//                     <div>
//                         <FontAwesomeIcon icon={faUsers} size="4x" />

//                     </div>
//                     <div className='adminInfocounter'>
//                         {userCounter}
//                     </div>
//                     <div className='buttonGroup'>
//                         <ButtonGroup vertical>
//                             <Button onClick={() =>{
//                                 resetState();
//                                 changeFormPrivillegeState(true);
//                                 changeClassName("belowLayer");
//                             }} variant="outline-primary">Pridať</Button>
//                             <Button onClick={() =>{
//                                 resetState();
//                                 changeTableUsersState(true);
//                                 changeClassName("App");
//                             }} variant="outline-info">Zobraziť</Button>
//                         </ButtonGroup >
//                     </div>
//                 </div>
//             </div>
//             <div className='adminInfoitem'>
//                 <div>
//                     <h3>Šarže</h3>
//                 </div>
//                 <div className='adminInfobody'>
//                     <div>
//                         <FontAwesomeIcon icon={faBoxesStacked} size="4x" />
//                     </div>
//                     <div className='adminInfocounter'>
//                         {batchCounter}
//                     </div>
//                     <div className='buttonGroup'>
//                         <ButtonGroup vertical>
//                         <Button onClick={() =>{
//                                 resetState();
//                                 changeFormCreateBatchState(true);
//                                 changeClassName("belowLayer");
//                             }} variant="outline-primary">Pridať</Button>
//                             <Button onClick={() =>{
//                                 resetState();
//                                 changeTableBatchesState(true);
//                                 changeClassName("App");
//                             }} variant="outline-info">Zobraziť</Button>
//                         </ButtonGroup >
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




