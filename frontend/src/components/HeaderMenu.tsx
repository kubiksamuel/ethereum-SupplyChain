import React, { Component } from 'react';
import Identicon from 'identicon.js'
import { Navbar, Container } from 'react-bootstrap';
import  logoSupply from '../img/logoSupply.png'



interface HeaderMenuProps {
    currentAccount: string;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({currentAccount}) => {

    return (    
        <Navbar bg="dark" variant="dark">
        <Container>
        <Navbar.Brand href="#home">
                <img
                alt=""
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
                alt=""
                src={`data:image/png;base64,${new Identicon(currentAccount, 420).toString()}`}
                width="30"
                height="30"
                className="d-inline-block align-top"
                />
            </Navbar.Text>
        </Navbar.Collapse>
        </Container>
        </Navbar>
    );
  
}

