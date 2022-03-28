// const ipfsAPI = require('ipfs-http-client');
// const { globSource } = ipfsAPI;
// const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })
import { create} from 'ipfs-http-client'
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// connect to the default API address http://localhost:5001


//run your own ipfs daemon: https://docs.ipfs.io/how-to/command-line-quick-start/#install-ipfs
//const ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http' })


// const getFromIPFS = async (hashToGet: string) => {
//     const file = await ipfs.get(hashToGet);
//     console.log(file);
// //   for await (const file of ipfs.get(hashToGet)) {
// //     console.log(file.path)
// //     if (!file.content) continue;
// //     for await (const chunk of file.content) {
// //       const content = chunk;
// //       console.log(content)
// //       return content
// //     }
// //   }
// }



export const addToIPFS = async (noteToUpload: string) => {
    // console.log("ADD TO IPFS FILE: ", fileToUpload.webkitRelativePath);
    // console.log(noteToUpload);
    const uploadedNotes = await ipfs.add(noteToUpload);
    return uploadedNotes.path;
    // console.log(file);
    //   for await (const result of  ipfs.add(fileToUpload)) {
//     console.log("Hash suboru: ", result);
//     return result
//   }
}
