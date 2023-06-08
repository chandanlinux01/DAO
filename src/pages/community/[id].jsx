// display list of nfts in a community<br />// 

import { useContractEvents, useContract, useNFT } from "@thirdweb-dev/react";
import { useRouter } from "next/router";

// https://www.youtube.com/watch?v=VoM69TYbaqE&t=10s
const CommunityDetailsPage = () => {
    const {id} = useRouter().query;
    const { contract } = useContract(NFT_CONTRACT_ADDRESS);
    const { data: nft, isLoading } = useNFT(id, contract);
    const { data: events, isLoading: isLoadingEvents } = useContractEvents(contract, "Transfer",
     {
        queryFilter: {
            filters: {
                tokenId: id,
            },  
            order: "desc",
            // Stopped here 

        }
    });

    return (
        <div>
            <h1>Community Details Page</h1>
        </div>
    );

};

export default CommunityDetailsPage;


