import Comments from "../components/Comments";
import { ThirdwebNftMedia, useContract, useNFT, useContractMetadata } from '@thirdweb-dev/react';
import { proposalData } from "../constants/proposalData";
import { communityData } from "../constants/communityData";
// import { Voting } from "../components/Voting2";

import { NFT_CONTRACT_ADDRESS } from "../constants/addresses";
import "../styles/proposalDetails.css"


export default function ProjectTemplate() {

  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  const tokenId = 0;
  const { data: nft, isLoading } = useNFT(contract, tokenId);
  const { data: metadata, isLoading: loadingMetadata } = useContractMetadata(contract);

  return (
    <>
      <div className="container">
        <div className="row">
          {/* Left Col - NFT/DAO Info  */}
          <div className="col-lg-4">
            <div className="card" >
              {console.log(metadata)}
            {!loadingMetadata && ( 
              <div>
              {/* <img src= alt="" /> */}
              <h3>{metadata?.name}</h3>
              {/* {nft.metadata?.image} */}
              {metadata?.image}
             </div>
             ) 
             }

                <img src={communityData.img} alt="" />

                <div className="card-body">
                  <h5 className="card-title">
                    { communityData.name}
                  </h5>
                  <p className="card-text">
                    {/* {nft.metadata.description} */}
                  </p>
                </div>

                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Total Members:{communityData.members} </li>
                  <li className="list-group-item">Verified members: {communityData.verifiedMembers}</li>
                  <li className="list-group-item"> Proposals: {communityData.proposals}</li>
                  <li className="list-group-item">Total Proposals: {communityData.proposals}</li>
                  <li className="list-group-item">Projects: {communityData.projects}</li>
                </ul>
                {/* <div className="card-body">
                  <a href="#" className="card-link">Card link</a>
                  <a href="#" className="card-link">Another link</a>
                </div> */}
              <br />
              </div>


              {/*  2nd Card  */}

              <div className="card" >

                ( add voting component here )

              {/* <Voting /> */}
        
        
              </div>
              </div>


          {/* Right Col */}
          <div className="col-lg-8">
            <div className="proposalDetails">
            <div className="proposalDetailsHeader">
            <h1>{ proposalData.title} </h1>
              </div>
            <div>Voting time </div>
            <div> Status: { proposalData.status} </div>
            <div>Budget: { proposalData.budget} </div>
            <img src= {proposalData.image} alt="" />
            { proposalData.description}
            </div>
              {/* <img src="/src/assets/imgs/project.png" alt="" /> */}
              {/* <Comments /> */}
            </div>
        </div>
      </div>
    </>
  );
}