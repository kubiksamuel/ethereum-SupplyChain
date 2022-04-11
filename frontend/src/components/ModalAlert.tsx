import React from 'react';
import { Button, Modal } from 'react-bootstrap'


interface ModalAlertProps {
    modalState: boolean;
    closeModal: () => void;
    type: string;
}

export const ModalAlert: React.FC<ModalAlertProps> = ({modalState, closeModal, type}) => {
    return (
        <Modal show={modalState} onHide={() => closeModal()}>
            <Modal.Header closeButton>
                <Modal.Title>Chyba</Modal.Title>
            </Modal.Header>
            {type === "login" &&  <Modal.Body>Pre zvolený účet neexistuje žiadna rola. Zvoľte iný účet v Metamask peňaženke a skúste to znova.</Modal.Body>}
            {type === "transaction" &&  <Modal.Body>Nastala chyba pri odosielaní transakcie.Skontrolujte validnosť dát a prihlásený účet v Metamask peňaženke a skúste to znovu.</Modal.Body>}
            <Modal.Footer>
                <Button variant="outline-primary" onClick={() => closeModal()}>
                    Okay
                </Button>
            </Modal.Footer>
        </Modal>
  );
};