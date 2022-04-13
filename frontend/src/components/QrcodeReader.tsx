import React from 'react';
import { QrReader } from 'react-qr-reader';


interface QrcodeReaderProps {
    changeBatchToFilter: (scannedString: string) => void;
}

export const QrcodeReader: React.FC<QrcodeReaderProps> = ({changeBatchToFilter}) => {
  return (
    <>
      <QrReader
        onResult={(result, error) => {
            if (!!result) {
                changeBatchToFilter(result.toString());
              }   
            }}
              containerStyle={{ width: "420px", height: "420px", position: "fixed", top: "30%", left: "42%",
               border: "7px solid #FFC43D", backgroundColor: "black"}} constraints={{facingMode: 'user' }} scanDelay={500}/>
    </>
  );
};