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
              containerStyle={{ width: "320px", height: "320px", position: "fixed", top: "30%", left: "40%",
               border: "7px solid #FFC43D", backgroundColor: "black", zIndex: 99}} constraints={{facingMode: 'user' }} scanDelay={100}/>
    </>
  );
};