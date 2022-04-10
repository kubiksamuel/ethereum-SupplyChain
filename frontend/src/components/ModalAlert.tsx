import React, { useState } from 'react';
import { Button, CloseButton, Modal } from 'react-bootstrap'


interface ModalAlertProps {
    modalState: boolean;
    closeModal: () => void;
}

export const ModalAlert: React.FC<ModalAlertProps> = ({modalState, closeModal}) => {
    return (
        <Modal show={modalState} onHide={() => closeModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Chyba</Modal.Title>
            </Modal.Header>
            <Modal.Body>Došlo ku chybe pri odosielaní transakcie.Skontrolujte validnosť dát a prihlásený účet v Metamask peňaženke a skúste to znovu.</Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={() => closeModal()}>
                    Okay
                </Button>
            </Modal.Footer>
        </Modal>
  );
};