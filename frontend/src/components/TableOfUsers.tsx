import * as React from 'react';
import { Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons';

interface User {
    userId: number;
    userAddress: string;
    userName: string;
    signatoryRole: boolean;
    supplierRole: boolean;
  }

interface TableOfUsersProps {
    userCounter: number;
    userList: Array<User>;
    changeUserListState: (userList: Array<User>) => void;
}

export const TableOfUsers: React.FC<TableOfUsersProps> = ({userList}) => {

    return (
    <div>
        <div className='Table'>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>ID používateľa</th>
                        <th>Meno používateľa</th>
                        <th>Adresa používateľa</th>
                        <th>Výrobca</th>
                        <th>Schvaľovateľ</th>
                        <th>Admin</th>
                    </tr>
                </thead>
                <tbody>
                {
                userList.map(user => (
                <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.userName}</td>
                    <td>{user.userAddress}</td>
                    <td>{user.supplierRole ?<FontAwesomeIcon className='success' icon={faCircleCheck}/> :
                         <FontAwesomeIcon icon={faBan}/>}</td>
                    <td>{user.signatoryRole  ?<FontAwesomeIcon className='success' icon={faCircleCheck}/> :
                         <FontAwesomeIcon icon={faBan}/>}</td>
                    <td>{user.userId === 1 ?<FontAwesomeIcon className='success' icon={faCircleCheck}/> :
                         <FontAwesomeIcon icon={faBan}/>}</td>
                </tr>
                ))}
                </tbody>
            </Table> 
        </div>
    </div>
    );
}
