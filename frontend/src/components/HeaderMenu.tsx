import React from 'react';
import Identicon from 'identicon.js'
import { Navbar, Container, Button } from 'react-bootstrap';
import  logoSupply from '../img/logoSupply.png'

interface HeaderMenuProps {
    changeAccount: (cuurentAccount: string, loadingState: boolean) => void;
    currentAccount: string;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({changeAccount, currentAccount}) => {
    return (    
        <Navbar bg="dark" variant="dark">
        <Container>
        <Navbar.Brand>
                <img
                alt="logoSupply"
                src={logoSupply}
                width="30"
                height="30"
                className="d-inline-block align-top"
                />
            Zásobovací systém
            </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
            Prihlásený ako:{currentAccount} 
                <img
                alt="identicon"
                src={`data:image/png;base64,${new Identicon(currentAccount, 420).toString()}`}
                width="30"
                height="30"
                className="d-inline-block align-top identicon"
                />
            </Navbar.Text>
            <Button className='logoutButton' onClick={() => {
                changeAccount("", true);
            }
            } variant="outline-danger">Prepnúť účet</Button>
        </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

