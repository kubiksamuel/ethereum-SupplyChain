// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

pragma solidity ^0.8.0;


contract RoleManager is AccessControlEnumerable {

    bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
    bytes32 public constant SIGNATORY_ROLE = keccak256("SIGNATORY_ROLE");
    uint256 public roleId;

    mapping(address => RoleInfo) public supplierRoles;
    mapping(address => RoleInfo) public signatoryRoles;
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
        signatoryRoles[msg.sender].name = name;
        signatoryRoles[msg.sender].id = roleId;
        roles.push(msg.sender);
    }

    function setPrivillegeSupplier(address account, string memory name) public 
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
         roleId++;
        _grantRole(SUPPLIER_ROLE, account);
        supplierRoles[account].name = name;
        supplierRoles[account].id = roleId;
        roles.push(account);
    }

    function setPrivillegeSignatory(address account, string memory name) public
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        roleId++;
        _grantRole(SIGNATORY_ROLE, account);
        signatoryRoles[account].name = name;
        signatoryRoles[account].id = roleId;
        roles.push(account);
    }
}