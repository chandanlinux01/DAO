// start new file
import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance, ThirdwebNftMedia, useNFT } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";
import { Link } from 'react-router-dom';
import { addresses } from '../constants/addresses';
import { proposalData } from '../constants/proposalData';
import { communityData, communityData2 } from '../constants/communityData';
import { Log } from '../constants/constants';

export default function Communities() {
  const address = useAddress();
  const editionDropAddress = "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1";
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { contract: token } = useContract('0x1E1aECDC3C932c4B3490203326A3e2e178C94315', 'token');
  const { contract: vote } = useContract("0x2FDaBe3f3Eaa7c6442faD20ccDF632280a46ef56", "vote");

  const { contract } = useContract("0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1");
  const tokenId = 0;
  const { data: nft, isLoading, error } = useNFT(contract, tokenId);
  // const { data: metadata, isLoading: loadingMetadata } = useContractMetadata(contract);

  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")
  const hasClaimedNFT = useMemo(() => {
    return nftBalance && nftBalance.gt(0);

  }, [nftBalance])


  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);
  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
  };
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // A simple call to vote.getAll() to grab the proposals.
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals);
        console.log(proposals[1]);
      } catch (error) {
        console.log("failed to get proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  // We also need to check if the user already voted.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // If we haven't finished retrieving the proposals from the useEffect above
    // then we can't check if the user voted yet!
    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
        } else {
        }
      } catch (error) {
      }
    };
    checkIfUserHasVoted();

  }, [hasClaimedNFT, proposals, address, vote]);

  // member stuff sj
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

  // member stuff sj 
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
  }, [memberAddresses, memberTokenAmounts]);



  if (hasClaimedNFT) {

    return (
      <div className="wrapper">
        <div className="member-page">
          <h1>{nft.metadata.name} </h1>
          <div>
            <div>
              <h2>Member List</h2>
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
            </div>
            <div>
              <h2>All Proposals</h2>
              <form>
                {proposals.map((proposal) => (
                  <div key={proposal.proposalId} className="card">
                    <h3>Proposal Title</h3>
                    <div className='cardHead'></div>
                    <p>{proposal.description}</p>
                    <div>
                      <button ><Link to="/ProposalTemplate">View Proposal Details</Link></button>

                    </div>


                  </div>

                ))}



                {!hasVoted && (
                  <small>
                    This will trigger multiple transactions that you will need to
                    sign.
                  </small>
                )}
              </form>
            </div>
          </div>
        </div>


      </div>

    );
  } else {
    return (
      // map over communityData and display each community



      <div className='container'>
        <h1>Please Join a Community</h1>
        <div className="row row-cols-1 row-cols-md-2 g-4">
  <div className="col">
    <div className="card">
      <img src={communityData.img} className="card-img-top" alt="..."/>
      <div className="card-body">
        <h5 className="card-title">{communityData.name}</h5>
        <p className="card-text">{communityData.description}</p>
      </div>
    </div>
  </div>
  <div className="col">
    <div className="card">
      <img src="..." className="card-img-top" alt="..."/>
      <div className="card-body">
        <h5 className="card-title">
        <Log value={communityData2} /></h5>
        
        

        <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      </div>
    </div>
  </div>
  <div className="col">
    <div className="card">
      <img src="..." className="card-img-top" alt="..."/>
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content.</p>
      </div>
    </div>
  </div>
  <div className="col">
    <div className="card">
      <img src="..." className="card-img-top" alt="..."/>
      <div className="card-body">
        <h5 className="card-title">Card title</h5>
        <p className="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      </div>
    </div>
  </div>
</div>


        <div className='cardWrapper'>
          <div className="card">
            {/* <img className="card-img-top" src="..." alt="Card image cap"> */}
            <div className="card-body">
              <h2 className="card-title">Legacy Park</h2>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#">View Proposals in this Community</a>
    
            </div>
          </div>
          <div className="card">
            {/* <img className="card-img-top" src="..." alt="Card image cap"> */}
            <div className="card-body">
              <h2 className="card-title">Westend</h2>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>

            </div>
          </div>
        </div>










      </div>
    );
  }
}
