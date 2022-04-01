// const ipfsAPI = require('ipfs-http-client');
// const { globSource } = ipfsAPI;
// const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
import { create} from 'ipfs-http-client'
import { Children } from 'react';
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// connect to the default API address http://localhost:5001


//run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
//const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http' })


export const getFromIPFS = async (hashToGet: string) => {
    const stream = ipfs.cat(hashToGet)
    let data;
    let stageNotes = '';
    let counter = 0;
    for await (const chunk of stream) {
        for(let i = 0; i < chunk.length; i++) {
            stageNotes += String.fromCharCode(chunk[i]);
        }   
    }
    let index = 0;
    console.log("IPFS getter return :" + stageNotes);
    return stageNotes;
}



export const addToIPFS = async (noteToUpload: string) => {
    const uploadedNotes = await ipfs.add(noteToUpload);
    return uploadedNotes.path;
}
