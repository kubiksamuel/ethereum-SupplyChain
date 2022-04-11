import { create} from 'ipfs-http-client'
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// connect to the default API address http://localhost:5001


export const getFromIPFS = async (hashToGet: string) => {
    const stream = ipfs.cat(hashToGet)
    let stageNotes = '';
    for await (const chunk of stream) {
        for(let i = 0; i < chunk.length; i++) {
            stageNotes += String.fromCharCode(chunk[i]);
        }   
    }
    console.log("IPFS getter return :" + stageNotes);
    return stageNotes;
}

export const addToIPFS = async (noteToUpload: string) => {
    const uploadedNotes = await ipfs.add(noteToUpload);
    return uploadedNotes.path;
}
