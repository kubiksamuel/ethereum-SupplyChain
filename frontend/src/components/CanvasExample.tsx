import React, { useContext, useEffect, useState } from 'react';

import { Button, Offcanvas } from 'react-bootstrap';


interface CanvasProps {
    stageNotes: string;
    stageName: string;
}

export const CanvasExample: React.FC<CanvasProps>= ({stageNotes, stageName}) => {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Zobraziť údaje
        </Button>
  
        <Offcanvas show={show} onHide={handleClose} placement={"top"} scroll={true} backdrop={true}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Údaje k etape: {stageName}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
              {stageNotes}
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }