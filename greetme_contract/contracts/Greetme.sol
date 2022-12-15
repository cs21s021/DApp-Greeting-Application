// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greetme {
    uint256 totalGreetings;
    uint256 private seed;

    event NewGreet(address indexed from, uint256 timestamp, string message);

    /*
     * Customize the structure to greet
     * Contains greeter's address, message and timestamp
    */
    struct Greet {
        address greeter;
        string message;
        uint256 timestamp;
    }

    Greet[] greetings;

    /*
     * Address to uint mapping that stores 
     * last time user address greeted me
     */
    mapping(address => uint256) public lastGreetedAt;

    constructor() payable {
        console.log("We have been constructed!");
        /*
         * Set the initial seed
         */
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function greet(string memory _message) public {
        /*
         * User must wait atleast 1 minute before greeting again
         */
        require(lastGreetedAt[msg.sender] + 60 seconds < block.timestamp, 
            "Must wait 60 seconds before greeting again.");


        /*
         * Update the current timestamp we have for the user
         */
        lastGreetedAt[msg.sender] = block.timestamp;

        totalGreetings += 1;
        console.log("%s has greeted!", msg.sender);

        greetings.push(Greet(msg.sender, _message, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a greeting
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than they contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewGreet(msg.sender, block.timestamp, _message);
    }

    function getAllGreetings() public view returns (Greet[] memory) {
        return greetings;
    }

    function getTotalGreetings() public view returns (uint256) {
        return totalGreetings;
    }
}