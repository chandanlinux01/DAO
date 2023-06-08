// start new file
import { useAddress, ConnectWallet, Web3Button, useContract, useNFTBalance } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";


export default function Community() {
  const address = useAddress();
  const editionDropAddress = "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1";
  const { contract: editionDrop } = useContract(editionDropAddress, "edition-drop");
  const { contract: token } = useContract('0x1E1aECDC3C932c4B3490203326A3e2e178C94315', 'token');
  const { contract: vote } = useContract("0x2FDaBe3f3Eaa7c6442faD20ccDF632280a46ef56", "vote");
  
  
  // Hook to check if the user has our NFT
  const { data: nftBalance } = useNFTBalance(editionDrop, address, "0")

  const hasClaimedNFT = useMemo(() => {
     return nftBalance && nftBalance.gt(0);
    
   }, [nftBalance])

    
  // Memebers stuff sj 
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
        console.log("🥵 User has already voted");
      } else {
        console.log("🙂 User has not voted yet");
      }
    } catch (error) {
      console.error("Failed to check if wallet has voted", error);
    }
  };
  checkIfUserHasVoted();

}, [hasClaimedNFT, proposals, address, vote]);

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
}, [memberAddresses, memberTokenAmounts]);



if (hasClaimedNFT) {
  
  return (
    <div className="wrapper">
          <div className="member-page">
            <h1>Your Community : Westend </h1>
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
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        //before we do async things, we want to disable the button to prevent double clicks
        setIsVoting(true);

        // lets get the votes from the form for the values
        const votes = proposals.map((proposal) => {
          const voteResult = {
            proposalId: proposal.proposalId,
            //abstain by default
            vote: 2,
          };
          proposal.votes.forEach((vote) => {
            const elem = document.getElementById(
              proposal.proposalId + '-' + vote.type,
            );

            if (elem.checked) {
              voteResult.vote = vote.type;
              return;
            }
          });
          return voteResult;
        });

        // first we need to make sure the user delegates their token to vote
        try {
          //we'll check if the wallet still needs to delegate their tokens before they can vote
          const delegation = await token.getDelegationOf(address);
          // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
          if (delegation === AddressZero) {
            //if they haven't delegated their tokens yet, we'll have them delegate them before voting
            await token.delegateTo(address);
          }
          // then we need to vote on the proposals
          try {
            await Promise.all(
              votes.map(async ({ proposalId, vote: _vote }) => {
                // before voting we first need to check whether the proposal is open for voting
                // we first need to get the latest state of the proposal
                const proposal = await vote.get(proposalId);
                // then we check if the proposal is open for voting (state === 1 means it is open)
                if (proposal.state === 1) {
                  // if it is open for voting, we'll vote on it
                  return vote.vote(proposalId, _vote);
                }
                // if the proposal is not open for voting we just return nothing, letting us continue
                return;
              }),
            );
            try {
              // if any of the propsals are ready to be executed we'll need to execute them
              // a proposal is ready to be executed if it is in state 4
              await Promise.all(
                votes.map(async ({ proposalId }) => {
                  // we'll first get the latest state of the proposal again, since we may have just voted before
                  const proposal = await vote.get(proposalId);

                  //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                  if (proposal.state === 4) {
                    return vote.execute(proposalId);
                  }
                }),
              );
              // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
              setHasVoted(true);
              // and log out a success message
              console.log('successfully voted');
            } catch (err) {
              console.error('failed to execute votes', err);
            }
          } catch (err) {
            console.error('failed to vote', err);
          }
        } catch (err) {
          console.error('failed to delegate tokens');
        } finally {
          // in *either* case we need to set the isVoting state to false to enable the button again
          setIsVoting(false);
        }
      }}
    >
      {proposals.map((proposal) => (
        <div key={proposal.proposalId} className="card">
                <h3>Proposal Title</h3>
                <div className='cardHead'></div>
          <h5>{proposal.description} | </h5>
          <div>
            <button>View Project</button>
            {proposal.votes.map(({ type, label }) => (
              <div key={type}>
                <input
                  type="radio"
                  id={proposal.proposalId + '-' + type}
                  name={proposal.proposalId}
                  value={type}
                  //default the "abstain" vote to checked
                  defaultChecked={type === 2}
                />
                <label htmlFor={proposal.proposalId + '-' + type}>
                  {label}
                </label>
                <hr />
              </div>
            ))}
          </div>
          <button disabled={isVoting || hasVoted} type="submit">
        {isVoting
          ? 'Voting...'
          : hasVoted
          ? 'You Already Voted'
          : 'Submit Votes'}
      </button> 
      <hr />
     
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
    <>
    <h1>Please Join a Community</h1>


    <div className='cardWrapper'>
    <div className="card">
  {/* <img class="card-img-top" src="..." alt="Card image cap"> */}
  <div className="card-body">
    <h2 className="card-title">Legacy Park</h2>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="/join" className="btn btn-primary">Go somewhere</a>
    <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Join this Community
        </Web3Button>
  </div>
</div>
<div className="card">
  {/* <img class="card-img-top" src="..." alt="Card image cap"> */}
  <div className="card-body">
    <h2 className="card-title">Westend</h2>
    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="/join" className="btn btn-primary">Terms</a>
    <Web3Button 
          contractAddress={editionDropAddress}
          action={contract => {
            contract.erc1155.claim(0, 1)
          }}
          onSuccess={() => {
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
          }}
          onError={error => {
            console.error("Failed to mint NFT", error);
          }}
        >
          Join this Community
        </Web3Button>
  </div>
</div>
    </div>









  
    </>
  );
}
}
