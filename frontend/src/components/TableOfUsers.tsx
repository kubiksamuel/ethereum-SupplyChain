import * as React from 'react';
import { Form, Button, Table } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons'


import { useRef, useContext, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { ethers } from 'ethers';
import { sign } from 'crypto';


interface User {
    userId: number;
    userAddress: string;
    userName: string;
    signatoryRole: boolean;
    supplierRole: boolean;
  }

interface TableOfUsersProps {
    userCounter: number;
    userList: Array<User>;
    changeUserListState: (userList: Array<User>) => void;
}

export const TableOfUsers: React.FC<TableOfUsersProps> = ({userList}) => {
    const supplychain = useContext(SupplyChainContext);
    // const [userList, setUserList] = useState<Array<User>>([]);

    // const [currentBatchId, setCurrentBatchId] = useState("");

    // if(supplychain.instance){
    //     supplychain.instance.on("BatchCreated", (batchId, productName) => {
    //         setCurrentBatchId(batchId);
    //         console.log("Odchyteny event s argumentami: " + batchId, productName);
    //     });
    // }



    return (
        <div className='Table'>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                    <th>ID používateľa</th>
                    <th>Meno používateľa</th>
                    <th>Adresa používateľa</th>
                    <th>Výrobca</th>
                    <th>Schvaľovateľ</th>
                    <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                {
                userList.map(user => (
                <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.userName}</td>
                    <td>{user.userAddress}</td>
                    <td>{user.supplierRole ?<FontAwesomeIcon icon={faCircleCheck}/> :
                         <FontAwesomeIcon icon={faBan}/>}</td>
                    <td>{user.signatoryRole  ?<FontAwesomeIcon icon={faCircleCheck}/> :
                         <FontAwesomeIcon icon={faBan}/>}</td>
                    <td>{user.userId == 1 ?<FontAwesomeIcon icon={faCircleCheck}/> :
                         <FontAwesomeIcon icon={faBan}/>}</td>
                </tr>
                ))}
                </tbody>
            </Table> 
        </div>
    );
}
