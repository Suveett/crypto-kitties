pragma solidity 0.5.12;

import "./Kittycontract.sol";
import "./IKittyMarketPlace.sol";
import "./utils/SafeMath.sol";
import "./Ownable.sol";


contract KittyMarketPlace is IKittyMarketPlace,Ownable {

  using SafeMath for uint256;



  Kittycontract private _kittyContract;

//events
event MarketTransaction(string TxType, address owner, uint256 tokenId);

//Struct with Offer Details of the MarketPlace web app:
  struct Offer {
    address payable seller;
    uint256 price;
    uint256 index;
    uint256 tokenId;
    bool active;
  }

//Mapping tokenId =>  struct
mapping (uint256 => Offer) tokenIdToOffer;

//Offer array of available Offers;
Offer[] offers;

//Constructor :
constructor(address kittyContractAddress) public {
  setKittyContract(kittyContractAddress);
}

function setKittyContract(address kittyContractAddress)
public onlyOwner {
  _kittyContract = Kittycontract(kittyContractAddress);
}


function getOffer(uint256 _tokenId) public view returns
(
  address seller,
  uint256 price,
  uint256 index,
  uint256 tokenId,
  bool active
) {

  //require(_isOnOffer(_tokenId) == true, "There is No Active Offer for this Cat");
  require(tokenIdToOffer[_tokenId].seller != address(0), "Token not on offer!");

/** Below is One Method of assigning variables to Mappingwhich point to a Struct
  seller = tokenIdToOffer[_tokenId].seller;
  price = tokenIdToOffer[_tokenId].price;
  index = tokenIdToOffer[_tokenId].index;
  tokenId = tokenIdToOffer[_tokenId].tokenId;
  active = tokenIdToOffer[_tokenId].active;
*/
  //another way of doing it (assigning directly to Struct + Mapping) is like below :

Offer storage offer = tokenIdToOffer[_tokenId];
return (
  offer.seller,
  offer.price,
  offer.index,
  offer.tokenId,
  offer.active
);

}


function setOffer(uint256 _price, uint256 _tokenId) external {
  require(_isKittyOwner(msg.sender, _tokenId), "You are not the owner of this Cat");
  require(!_isOnOffer(_tokenId), "There is already an Active Offer for this Cat so You cannot sell the same Token twice");
  require(_kittyContract.isApprovedForAll(msg.sender, address(this)), "MarketPlace Contract needs to be authorized for selling Kitty in the Future");

Offer memory newOffer = Offer({
  seller : msg.sender,
  price : _price,
  tokenId : _tokenId,
  index : offers.length,
  active : true

});

 offers.push(newOffer);
 tokenIdToOffer[_tokenId] = newOffer;

//Emit Event MarketTransaction
emit MarketTransaction("Create Offer", msg.sender, _tokenId);
}


function getAllTokenOnSale() external view  returns(uint256[] memory ) {

  uint256 totalOffers = offers.length;
// Filip's way:
  /**if (totalOffers == 0) {
   return new uint256[](0);//SIZE 1,2,3,4,5,
  }
 else {
*/
  uint256[] memory allOfferIds = new uint256[](totalOffers);
  uint256 i;
  uint256 activeOffers = 0;
  for (i = 0; i < totalOffers; i++) {
    if (offers[i].active == true) {
      allOfferIds[activeOffers] = offers[i].tokenId;
      activeOffers = activeOffers.add(1);
    }
  }

  if (activeOffers == totalOffers) return allOfferIds;

  //Else return a correctly sized array of only Active offers
  uint256[] memory activeOfferIds = new uint[](activeOffers);
  for (i = 0; i < activeOffers; i++ ) {
    activeOfferIds[i] = allOfferIds[i];
  }
return activeOfferIds;

//Continuation of Filip's way :
  /**uint256[] memory result = new uint256[](totalOffers);
  uint256 offerId;

  for (offerId = 0; offerId < totalOffers; offerId ++) {
    if(offers[offerId].active == true) {
      result[offerId] = offers[offerId].tokenId;
    }
  }

  return result;

}*/
}



function removeOffer(uint256 _tokenId) external {
  require(_isOnOffer(_tokenId) == true, "There is No Active Offer against this Cat");
  require(msg.sender == tokenIdToOffer[_tokenId].seller, "Only Seller can Remove Offer");

  _removeOffer(_tokenId);
  // or We can use below two lines of code to ensure that the Offer is removed both from the Offer mapping i.e tokenIdToOffer and also from the offers array
  //delete(tokenIdToOffer[_tokenId]);
  //offers[tokenIdToOffer[_tokenId].index].active = false;


  //Emit Market Transaction event
  emit MarketTransaction("Remove Offer", msg.sender, _tokenId);
}



function buyKitty(uint256 _tokenId) external payable {
  Offer memory offer = tokenIdToOffer[_tokenId];
  require(_isOnOffer(_tokenId) == true, "This Cat is not for sale as there is No Active Offer against this");
  require(msg.value >= offer.price, "Please send Full Token Price");

  // Delete the Mapping of the Tranferrable token
  // Set the Bool= active as false in the Offer array as well
  //delete(tokenIdToOffer[_tokenId]);
  //offers[offer.index].active = false;
  _removeOffer(_tokenId);
  //transfer of the price to the seller
  //PUSH METHOD
  //if (offer.price > 0) {
    //offer.seller.transfer(offer.price);
  //IMPLEMENTED PULL METHOD AS BELOW
  if(msg.value > 0) {
    (bool success, ) = offer.seller.call.value(msg.value)("");
    require(success, "Payment to seller failed!");
    }

  //Finally transfer the Ownership of the Kitty using the transferFrom function in KittyContract:
  _kittyContract.safeTransferFrom(offer.seller, msg.sender, _tokenId);

  //Emit MarketTransaction event
  emit MarketTransaction("Buy", msg.sender, _tokenId);
}


function _isKittyOwner(address claimant,uint256 tokenId)
    internal
    view
    returns (bool)
{
    return(_kittyContract.ownerOf(tokenId) == claimant);
}


function _isOnOffer(uint256 tokenId) internal view returns (bool) {
    return(tokenIdToOffer[tokenId].active == true);
}


/* External Function:
** Checks if given tokenId is on sale or not; returning true if it is, false if not.
*/
function isTokenOnSale(uint256 tokenId) external view returns (bool) {
    return (_isOnOffer(tokenId));
}


function _removeOffer(uint256 tokenId) internal {
    Offer memory toBeRemoved = tokenIdToOffer[tokenId];

    uint256 lastIndex = offers.length.sub(1);
    if (toBeRemoved.index < lastIndex) { // not the last offer in the array
        // Move last offer record (in array) to overwrite the offer to be removed
        Offer memory lastOffer = offers[lastIndex];
        lastOffer.index = toBeRemoved.index;       // poisition to which last offer record will be moved
        offers[toBeRemoved.index] = lastOffer;    // overwrite offer to be removed (with last offer record)
        tokenIdToOffer[lastOffer.tokenId] = lastOffer; // Update record in the token mapping
        }
    offers.pop();   // remove last offer record (now redundant as moved, or is the offer to be removed)
    delete tokenIdToOffer[toBeRemoved.tokenId];
    }




}
