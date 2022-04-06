// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

pragma solidity ^0.8.0;


contract RoleManager is AccessControlEnumerable {

    bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
    bytes32 public constant SIGNATORY_ROLE = keccak256("SIGNATORY_ROLE");
    uint256 public roleId;

    event MemberAdded(address account, string name, string role);

    // mapping(address => RoleInfo) public supplierRoles;
    // mapping(address => RoleInfo) public signatoryRoles;
    mapping(address => RoleInfo) public rolesInfo;
    address[] public roles;

    struct RoleInfo {
        uint id;
        string name;
    }

    constructor(string memory name)
    {
        roleId = 1;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SIGNATORY_ROLE, msg.sender);
        _grantRole(SUPPLIER_ROLE, msg.sender);
        rolesInfo[msg.sender].name = name;
        rolesInfo[msg.sender].id = roleId;
        roles.push(msg.sender);
    }

    function setPrivillegeSupplier(address account, string memory name) public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
         roleId++;
        _grantRole(SUPPLIER_ROLE, account);
        rolesInfo[account].name = name;
        rolesInfo[account].id = roleId;
        roles.push(account);
        emit MemberAdded(account, name, "supplier");
    }

    function setPrivillegeSignatory(address account, string memory name) public
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        roleId++;
        _grantRole(SIGNATORY_ROLE, account);
        rolesInfo[account].name = name;
        rolesInfo[account].id = roleId;
        roles.push(account);
        emit MemberAdded(account, name, "signator");
    }
}