import * as React from 'react';
import { Form, Button, Table } from 'react-bootstrap'
import { SupplyChainContext, Symfoni } from "./../hardhat/SymfoniContext";

import { useRef, useContext, useState } from "react";
import ReactDOM from "react-dom";
import { ContractReceipt, ContractTransaction } from 'ethers';
import { Buffer } from 'buffer';
import { ethers } from 'ethers';
import { TableOfBatches } from './TableOfBatches';



export const TableRaw = () => {
    return(
        <TableOfBatches></TableOfBatches>
    );
}

