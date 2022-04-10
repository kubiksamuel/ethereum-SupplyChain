import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';


interface QrcodeReaderProps {
    changeBatchToFilter: (scannedString: string) => void;
}

export const QrcodeReader: React.FC<QrcodeReaderProps> = ({changeBatchToFilter}) => {
//   const [data, setData] = useState('No result');

  return (
    <>
      <QrReader
        onResult={(result, error) => {
            if (!!result) {
                changeBatchToFilter(result.toString());
                console.log("Result: " + result.toString());
            }
            // if (!!error) {
            //     console.info("error");
            //   }
              } }
              containerStyle={{ width: "420px", height: "420px", position: "fixed", top: "30%", left: "42%", border: "7px solid #FFC43D", backgroundColor: "black"
               }} constraints={{facingMode: 'user' }}   scanDelay={1000}   />
      {/* <p>{data}</p> */}
    </>
  );

// const [data, setData] = useState('No result');

// return (
//   <>
//     <QrReader
//       onResult={(result) => {
//         if (!!result) {
//             console.log("Aha");
//         //   setData(result?.toString());
//         }

//         // if (!!error) {
//         //   console.info(error);
//         // }
//       }}
//       containerStyle={{ width: '100%' }} constraints={{facingMode: 'user' }}
//     />
//     <p>{data}</p>
//   </>
// );

};