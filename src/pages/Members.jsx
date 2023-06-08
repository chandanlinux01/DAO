// start new file
import {  useNFTBalance, useAddress, useContract } from '@thirdweb-dev/react';
import { useMemo, useState, useEffect } from 'react';

export default function Members() {

  const address = useAddress();
  const editionDropAddress = "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1";
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { contract: token } = useContract('0x1E1aECDC3C932c4B3490203326A3e2e178C94315', 'token');
  const { contract: vote } = useContract("0x2FDaBe3f3Eaa7c6442faD20ccDF632280a46ef56", "vote");

   // Hook to check if the user has our NFT

   // A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddress = (str) => {
  return str.substring(0, 6) + '...' + str.substring(str.length - 4);
};



    

    // Holds the amount of token each member has in state.
const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
// The array holding all of our members addresses.
const [memberAddresses, setMemberAddresses] = useState([]);


const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

const hasClaimedNFT = useMemo(() => {
   return nftBalance && nftBalance.gt(0);
  
 }, [nftBalance])

// This useEffect grabs all the addresses of our members holding our NFT.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
  // with tokenId 0.
  const getAllAddresses = async () => {
    try {
      const memberAddresses = await editionDrop?.history.getAllClaimerAddresses(
        0,
      );
      setMemberAddresses(memberAddresses);
      console.log('🚀 Members addresses', memberAddresses);
    } catch (error) {
      console.error('failed to get member list', error);
    }
  };
  getAllAddresses();
}, [hasClaimedNFT, editionDrop?.history]);
// This useEffect grabs the # of token each member holds.
useEffect(() => {
  if (!hasClaimedNFT) {
    return;
  }

  const getAllBalances = async () => {
    try {
      const amounts = await token?.history.getAllHolderBalances();
      setMemberTokenAmounts(amounts);
      console.log('👜 Amounts', amounts);
    } catch (error) {
      console.error('failed to get member balances', error);
    }
  };
  getAllBalances();
}, [hasClaimedNFT, token?.history]);


  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
const memberList = useMemo(() => {
  return memberAddresses.map((address) => {
    // We're checking if we are finding the address in the memberTokenAmounts array.
    // If we are, we'll return the amount of token the user has.
    // Otherwise, return 0.
    const member = memberTokenAmounts?.find(({ holder }) => holder === address);

    return {
      address,
      tokenAmount: member?.balance.displayValue || '0',
    };
  });
}, [memberAddresses, memberTokenAmounts])
  return (
    <>
        <table className="card">

<thead>
  <tr>
    <th>Name</th>
    <th>Address</th>
    {/* <th>Token Amount</th> */}
    <th>Votes</th>
  </tr>
</thead>
<tbody>
  {memberList.map((member) => {
    return (
      <tr key={member.address}>
        <td>John Doe</td>
        <td>{shortenAddress(member.address)}</td>
        <td>{member.tokenAmount}</td>
      </tr>
    );
  })}
</tbody>
</table>
    </>
  );
}