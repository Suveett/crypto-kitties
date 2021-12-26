pragma solidity 0.5.12;
import "./IERC721.sol";
import "./utils/SafeMath.sol";
import "./IERC721Receiver.sol";
import "./Ownable.sol";
import "./utils/ArrayUtils.sol";


contract Kittycontract is IERC721, Ownable {

using SafeMath for uint256;
using ArrayUtils for uint256[];

constructor(string memory _Name, string memory _Symbol) public {
        _Name = Name;
        _Symbol = Symbol;
    }



//events
event Birth(
  address owner,
  uint256 genes,
  uint256 newKittenId,
  uint256 mumId,
  uint256 dadId,
  uint256 generation);

event Transfer(address indexed oldOwner, address indexed newOwner, uint256 indexed tokenId);
event Approval(address indexed Owner, address indexed approvedTo, uint256 indexed tokenId);
event ApproveForAll(address indexed Owner, address operator, bool success);

//Struct- it gets stored in storage on EVM
struct Cat {
    uint256 genes;
    uint64 birthTime;
    uint32 mumId;
    uint32 dadId;
    uint16 generation;
    }

//Mappings
//       owner    number of Cats
mapping(address => uint256) private tokenOwnershipCount;
//      tokenId     owner
mapping(uint256 => address) private ownershipCertificate;
// approval mapping
mapping(uint256 => address) private kittyIndexToApprove;
// approval all (operator) mapping
//[MYAADDR][OPERATORADDR] => TRUE/FALSE;
mapping(address => mapping(address => bool)) private _operatorApprovals;
//      Owner      Array of Owner's All Kitty Id's
mapping(address => uint256[]) private _ownersKittyIds;


//State variables

string private  Name;
string private Symbol;
uint256 private constant CREATION_LIMIT_GEN0 = 500;
uint64 private  gen0Counter = 0;
bytes4 internal constant MAGIC_ERC721_RECEIVED = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

//arrays- stored in storage on EVM
Cat[] private cats;

//##############################################################################################################
//FUNCTIONS START HERE :
//Function when called from external contract returns whether this contract support IERC721 or IERC165 standard?
function supportsInterface(bytes4 _interfaceId) public pure returns(bool) {
  return ( _interfaceId == _INTERFACE_ID_ERC165 || _interfaceId == _INTERFACE_ID_ERC721);
}

// SAFE TRANSFER FUNCTIONS
//Function executing an External Call from another User/ Contract(without Data):
function safeTransferFrom(address _from, address _to, uint256 _tokenId) external {
  _safeTransferFrom(msg.sender, _from, _to, _tokenId, " ");
}

//Function executing an Public Call which then goes through external Interface(called with @param bytes calldata _data):
function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes calldata _data) external {
  _safeTransferFrom(msg.sender, _from, _to, _tokenId, _data);
}

function _safeTransferFrom(address sender, address from, address to, uint256 tokenId, bytes memory data) internal {
  require(isApprovedOrOwner(sender, from, to, tokenId),"No authority to transfer token!");
  _safeTransfer(from, to, tokenId, data);
}

//Internal safeTransfer Function
function _safeTransfer(address _from, address _to, uint256 _tokenId, bytes memory _data) internal {
  require( _checkERC721Support(_from, _to, _tokenId, _data) );
  _transfer(_from, _to, _tokenId);
}

//Function executing an External Call from another User/ Contract:
function transferFrom(address _from, address _to, uint256 _tokenId) external {
  require(isApprovedOrOwner(msg.sender, _from, _to, _tokenId), "Neither approved nor Owner");
  _transfer(_from, _to, _tokenId);

}

//Function executing an External Call from another User/ Contract:
function transfer(address _to, uint256 _tokenId) external {
  require(_to != address(0), "Recipient's address is zero!");
  require(_to != address(this), "Recipient is contract address!");
  require(_isOwner(msg.sender, _tokenId), "Sender is not token owner!");

  _transfer(msg.sender, _to, _tokenId);
}

//Actual transfer of the token happens from this below Internal Function:
function _transfer(address _from, address _to, uint256 _tokenId) internal {

  if(_from != address(0)){
    tokenOwnershipCount[_from]-- ;
    _ownersKittyIds[_from].removeFrom(_tokenId);
    delete(kittyIndexToApprove[_tokenId]);
  }
  tokenOwnershipCount[_to]++ ;
  ownershipCertificate[_tokenId] = _to;
  _ownersKittyIds[_to].push(_tokenId);
  //Event Transfer to be emitted now :
  emit Transfer(_from, _to, _tokenId);
}


//##########################################################################################################



//BASIC CAT CREATION, BREEDING & GETTER FUNCTIONS
function createKittyGen0(uint256 _genes) public onlyOwner {
  require(gen0Counter < CREATION_LIMIT_GEN0);
  gen0Counter++;
  _createKitty(0,0, _genes, 0, msg.sender);

}

function breed(uint256 _dadId, uint256 _mumId) public returns(uint256) {
  // Ensure that the breeder is owner or guardian of parent cats
  require(isApprovedOrOwner(msg.sender,ownershipCertificate[_mumId],msg.sender,_mumId),"Must have access to mother cat!");
  require(isApprovedOrOwner(msg.sender,ownershipCertificate[_dadId],msg.sender,_dadId),"Must have access to father cat!");


  //( uint256 _dadDna,,,,, uint256 dadGeneration) = getKitty(_dadId);
  //( uint256 _mumDna,,,,, uint256 mumGeneration) = getKitty(_mumId);
  uint256 mumGen = cats[_mumId].generation;
  uint256 dadGen = cats[_dadId].generation;
  uint256 newDna = _mixDna(cats[_dadId].genes, cats[_mumId].genes);

  uint256 kidGen = mumGen.add(dadGen).div(2).add(1);
  /**if (dadGeneration < mumGeneration) {
    kidGen = mumGeneration +1;
    kidGen /= 2;
  }
  else if (dadGeneration > mumGeneration) {
    kidGen = dadGeneration +1 ;
    kidGen /= 2;
  }
  else {
    kidGen = mumGeneration + 1;
  }*/

  // Create the new kitty (with breeder becoming new kitties owner)
  uint256 newKittyId = _createKitty(_mumId, _dadId, newDna, kidGen, msg.sender);
  return newKittyId;

}

function _mixDna(uint256 _dadDna, uint256 _mumDna) internal view returns(uint256) {
  //uint256 firstHalf = _dadDna /100000000;
  //uint256 secondhalf = _mumDna % 100000000;
  //uint256 newDna = firstHalf * 100000000;
  //newDna += secondhalf;
  //emit event DNA
  //emit NewDnaCreated(newDna);
  //return newDna;
  uint256[8] memory geneArray;
  uint256 index = 8;
  uint8 random = uint8(now.mod(256));// binary between 00000000-11111111;
  //Create a gene Array (for each 2 digit pair of the 16 digit dna)
  uint256 i;// lets say Random number is 11001011
  for ( i = 1; i <= 128; i = i.mul(2) ){
    index = index.sub(1) ; // move back one 2-digit pair
    //DNA 16 digits
    if(random & i != 0){
      geneArray[index] = uint8(_mumDna.mod(100));
    }
    else {
      geneArray[index] = uint8(_dadDna.mod(100));
    }
    _mumDna = _mumDna.div(100);
    _dadDna = _dadDna.div(100);

    //1,2,4,8,16,32,64, 128
    //00000001 - 1
    //00000010 - 2
    //00000100 -  4
    //00001000 - 8
    //00010000 - 16
    //00100000 - 32
    //10000000 - 64
    //10000000 - 128;
    /* if (true && false)
    11001011
    &
    00000001 = 1 // Keep checking all numbers against 11001011
    if(1) then mum _genes
    if(0) then dad _genes */
  }
  assert(index == 0);
  assert(geneArray.length == 8);

  uint256 dnaSequence;
  // [ 11, 22, 33, 44,55 ,66, 77, 88]
  for (i = 0; i < 8; i ++) {
    dnaSequence = dnaSequence.add(geneArray[i]);
    if(i != 7) {
      dnaSequence = dnaSequence.mul(100);
    }
  }
  return dnaSequence;
}


function _createKitty (
  uint256 _mumId,
  uint256 _dadId,
  uint256 _genes,
  uint256 _generation,
  address _owner
) private returns(uint256) {

  Cat memory _cat = Cat({
    genes : _genes,
    birthTime : uint64(now),
    mumId : uint32(_mumId),
    dadId : uint32(_dadId),
    generation : uint16(_generation)
  });

  uint256 newKittenId = (cats.push(_cat)).sub(1);

  //Event Birth to  be emitted :
  emit Birth(_owner, _genes, newKittenId, _mumId, _dadId, _generation);

  _safeTransfer(address(0), _owner, newKittenId, "");
  return newKittenId;
}


function getKitty(uint256 _newKittenId) public view returns(
uint256 _genes,
uint256 _mumId,
uint256 _dadId,
uint256 _birthTime,
uint256 _generation){

  require(_isInExistance(_newKittenId), "No such kitty id!");
  Cat storage cat = cats[_newKittenId];
  _genes = cat.genes;
  _dadId = uint256(cat.dadId);
  _mumId = uint256(cat.mumId);
  _generation = uint256(cat.generation);
  _birthTime = uint256(cat.birthTime);


}

function getKittyByOwner(address _owner) external view returns(uint256[] memory) {
  /**uint256[] memory result = new uint256[](tokenOwnershipCount[_owner]);
  uint counter = 0;
  for (uint i = 0; i < cats.length; i ++) {
    if (ownershipCertificate[i] == _owner) {
      result[counter] = i;
      counter ++;
    }
  }*/
  // Set pointer to owners array of kitty Ids
  return _ownersKittyIds[_owner];
}

function balanceOf(address owner) external view returns (uint256 balance) {
  return tokenOwnershipCount[owner];
}

function totalSupply() public view returns (uint256 total) {
  total = cats.length;
  return total;
}

function name() external view returns (string memory tokenName) {
  tokenName = Name;
  return tokenName;
}


function symbol() external view returns (string memory tokenSymbol) {
  tokenSymbol = Symbol;
  return tokenSymbol;
}

function ownerOf(uint256 tokenId) external view returns (address owner) {
  require(_isInExistance(tokenId), "Token does not exist!");
  return ownershipCertificate[tokenId];
}

//##########################################################################################################


// APPROVE FUNCTION & GETTER FUNCTIONS RELATED TO APPROVALS :
//______________________________________________________________________________________
function approve(address to, uint256 tokenId) external {
  require(_isInExistance(tokenId), "No such kitty id!");//Token must exist
  require(_isOwner(msg.sender, tokenId) || _isOperator(ownershipCertificate[tokenId], msg.sender),"Not token owner, nor operator!");
  require( to != address(0), "0 address cannot be approved !");
  _approve(msg.sender, to, tokenId);
}

function _approve(address grantor, address _approved, uint _tokenId ) internal {
  _approved = kittyIndexToApprove[_tokenId];
  //emit event Approve
  emit Approval(grantor, _approved, _tokenId);

}

function getApproved(uint256 _tokenId) external view returns (address) {
  require(_isInExistance(_tokenId), "No such kitty id!");//Token must exist
  return kittyIndexToApprove[_tokenId];
}
//_______________________________________________________________________________________

function setApprovalForAll(address operator, bool approved) external {
  require(operator != msg.sender, "Operator cannot be msg.sender");
  _setApprovalForAll(msg.sender, operator, approved);
}

function _setApprovalForAll(address _owner, address _operator, bool _approved) internal {
  _operatorApprovals[_owner][_operator] = _approved;
  //emit event ApproveAll
  emit ApproveForAll(msg.sender, _operator, _approved);
}


function isApprovedForAll(address owner, address operator) external view returns (bool) {
  return  _isOperator(owner, operator);
}
//_______________________________________________________________________________________________

function isApprovedOrOwner(address _spender, address _from, address _to, uint256 _tokenId) internal view returns(bool) {
  require(_to != address(0), "Cannot approve address(0)");
  require(_isOwner(_from, _tokenId), "Sender is not token owner!");
  require(_isInExistance(_tokenId), "No such kitty id!");//Token must exist
  return (_isOwner(_spender, _tokenId) || _isApprovedFor(_spender, _tokenId) || _isOperator(ownershipCertificate[_tokenId], _spender));
}


function _isOwner(address claimant, uint256 tokenId) internal view returns (bool)  {
    return (ownershipCertificate[tokenId] == claimant);
}


function _isApprovedFor(address _candidate, uint256 _tokenId) internal view returns(bool) {
  return kittyIndexToApprove[_tokenId] == _candidate;
}

function _isOperator(address owner, address candidate) internal view returns (bool){
    return _operatorApprovals[owner][candidate];
}


function _isInExistance(uint256 tokenId) internal view returns (bool)  {
    return (tokenId < cats.length);
    }

//#######################################################################################################

// INTERNAL FUNCTION ASKING FOR ERC 721 SUPPORT  :
function _checkERC721Support(address _from, address _to, uint256 _tokenId, bytes memory _data) internal returns(bool) {
  if ( !_isContract(_to) ) {
    return true;
  }
  bytes4 returnData = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
  // Call on onERC721Received in the _to contract
  return returnData == MAGIC_ERC721_RECEIVED;
  // Check on Return Value;
}

// IF SIZE = O =>ITS A USER WALLET, IF > 0 => ITS A CONTRACT :
function _isContract(address _to) internal view returns(bool) {
  uint32 size;
  assembly{
    size := extcodesize(_to)
  }
  return size > 0;
}


}
