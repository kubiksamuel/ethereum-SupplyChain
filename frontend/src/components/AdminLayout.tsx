import * as React from 'react';
import { Form, Button, Table } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import * as ipfs from '../functionality/Ipfs';
import { Buffer } from 'buffer';


export const TableOfBatches = () => {
    const [batchList, setBatchList] = useState(0);
    const [newBatch , setNewBatch] = useState(0);

    function handleChange(newValue: React.SetStateAction<number>) {
        setNewBatch(newValue);
      }


    return (
        <Table striped bordered hover variant="dark">
        <thead>
            <tr>
            <th>ID šarže</th>
            <th>Názov produktu</th>
            <th>Etapa</th>
            <th>Akcie</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
        </Table>
    );
}

