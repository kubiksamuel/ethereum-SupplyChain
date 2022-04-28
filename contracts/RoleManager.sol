// SPDX-License-Identifier: GPL-3.0

// Smart contract for setting privillege (Admin privillege is set at the beginning in constructor,
//and function for setting supplier and signatory privillege).
// Import AccessControlEnumerable contract from openzeppeling that provides 
//functionality to help handling this role system.  
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

pragma solidity ^0.8.0;

contract RoleManager is AccessControlEnumerable {

    bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
    bytes32 public constant SIGNATORY_ROLE = keccak256("SIGNATORY_ROLE");
    uint256 public roleId;

    event MemberAdded(address account, string name, string role);

    mapping(address => RoleInfo) public rolesInfo;
    // list of all addresses that has some role 
    address[] public roles;

    struct RoleInfo {
        uint id;
        string name;
    }

    constructor(string memory name) 
    {
        roleId = 1;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(SIGNATORY_ROLE, msg.sender);
        // _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // _grantRole(SIGNATORY_ROLE, msg.sender);
        rolesInfo[msg.sender].name = name;
        rolesInfo[msg.sender].id = roleId;
        roles.push(msg.sender);
    }

    function setPrivillegeSupplier(address account, string memory name) public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(rolesInfo[account].id == 0, "Account already have some privillege");
        grantRole(SUPPLIER_ROLE, account);
        roleId++;
        rolesInfo[account].id = roleId;
        rolesInfo[account].name = name;
        roles.push(account);
        emit MemberAdded(account, name, "supplier");
    }

    function setPrivillegeSignatory(address account, string memory name) public
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(rolesInfo[account].id == 0, "Account already have some privillege");
        grantRole(SIGNATORY_ROLE, account);
        roleId++;
        rolesInfo[account].id = roleId;
        rolesInfo[account].name = name;
        roles.push(account);
        emit MemberAdded(account, name, "signator");
    }
}