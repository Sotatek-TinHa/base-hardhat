// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

error NotAnNftOwner();

/**
 * @title ERC721 Staking Smart Contract
 *
 * @author andreitoma8
 */
contract ERC721Staking is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /**
     * @dev The ERC20 Reward Token that will be distributed to stakers.
     */
    IERC20 public immutable erc20Token;

    /**
     * @dev The ERC721 Collection that will be staked.
     */
    IERC721 public immutable nftCollection;

    /**
     * @dev Mapping of Token Id to staker address.
     */
    mapping(uint256 => address) public stakerAddress;

    event Deposited(address indexed depositor, uint256 amount);
    event Withdrawal(address indexed user, uint256 amount);

    /**
     * @notice Constructor function that initializes the ERC20 and ERC721 interfaces.
     * @param _nftCollection - The address of the ERC721 Collection.
     * @param _erc20Token - The address of the ERC20 Token.
     */
    constructor(IERC721 _nftCollection, IERC20 _erc20Token) {
        nftCollection = _nftCollection;
        erc20Token = _erc20Token;
    }

    /**
     * @notice Function used to deposit ERC721 Tokens.
     * @param _tokenIds - The array of Token Ids to deposit.
     * @dev Each Token Id must be approved for transfer by the user before calling this function.
     */
    function deposit(uint256[] calldata _tokenIds) external whenNotPaused {
        for (uint256 i; i < _tokenIds.length; ++i) {
            if (nftCollection.ownerOf(_tokenIds[i]) != msg.sender) {
                revert NotAnNftOwner();
            }

            nftCollection.transferFrom(msg.sender, address(this), _tokenIds[i]);

            stakerAddress[_tokenIds[i]] = msg.sender;
        }
        emit Deposited(msg.sender, _tokenIds.length);
    }

    /**
     * @notice Function used to withdraw ERC721 Tokens.
     * @param _tokenIds - The array of Token Ids to withdraw.
     */
    function withdraw(uint256[] calldata _tokenIds) external nonReentrant {
        for (uint256 i; i < _tokenIds.length; ++i) {
            if (stakerAddress[_tokenIds[i]] != msg.sender) {
                revert NotAnNftOwner();
            }

            nftCollection.transferFrom(address(this), msg.sender, _tokenIds[i]);

            delete stakerAddress[_tokenIds[i]];
        }
        emit Withdrawal(msg.sender, _tokenIds.length);
    }

    /**
     * @dev Pause.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Resume.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}