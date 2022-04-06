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
}

export const TableOfUsers: React.FC<TableOfUsersProps> = ({userCounter}) => {
    const supplychain = useContext(SupplyChainContext);
    const [userList, setUserList] = useState<Array<User>>([]);

    // const [currentBatchId, setCurrentBatchId] = useState("");

    // if(supplychain.instance){
    //     supplychain.instance.on("BatchCreated", (batchId, productName) => {
    //         setCurrentBatchId(batchId);
    //         console.log("Odchyteny event s argumentami: " + batchId, productName);
    //     });
    // }

    useEffect(() => {
        // while(!supplychain.instance){
            
        // }
         getUsers();
      },[supplychain.instance, userCounter]); 
      //


    const getUsers = async () => {
    if (!supplychain.instance) throw Error("SupplyChain instance not ready");
    if (supplychain.instance) {
        try{
            const userParsedList = [];
            const listLengthBN =  await supplychain.instance.roleId();
            const listLength = listLengthBN.toNumber();
            for(let i = 1; i <= listLength; i++){
                console.log("USERS: " + listLength);

                let signatoryRole: boolean;
                let supplierRole: boolean;
                const userAddress = await supplychain.instance.roles(i-1);
                if(await supplychain.instance.hasRole(await supplychain.instance.SIGNATORY_ROLE(), userAddress)) {
                     signatoryRole = true;
                } else {
                     signatoryRole = false;
                }
                if(await supplychain.instance.hasRole(await supplychain.instance.SUPPLIER_ROLE(), userAddress)) {
                     supplierRole = true;
                } else {
                     supplierRole = false;
                }
                const userInfo = await supplychain.instance.rolesInfo(userAddress);
                const userName = userInfo.name;
                const userId = userInfo.id;
                console.log("UserName " + userName);
                console.log("SignatoryRole " + signatoryRole);
                console.log("supplierRole " + supplierRole);
                console.log("UserAddress: " + userAddress )
                let newUser: User = {userId: userId.toNumber(), signatoryRole: signatoryRole, supplierRole: supplierRole, userName: userName,
                    userAddress: userAddress}
                userParsedList.push(newUser)

            }
            setUserList(userParsedList);
        } catch {
            console.log("Nastala neocakavana chyba");
        }
    }
};

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
