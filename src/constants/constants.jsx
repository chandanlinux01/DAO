// define constants here

import { useAddress , useContract } from '@thirdweb-dev/react';
import Comments from '../components/Comments';
export const API_URL = 'http://localhost:3000/api/v1';

  // <Log value={objectNameHere} />
  export const Log = ({ value, replacer = null, space = 2 }) => (
    <pre className="bg-dark text-white p-3">
      <code>{JSON.stringify(value, replacer, space)}</code>
    </pre>
  );


export const path = window.location.pathname;

export const projectID = [
    1,
    2,
    3,
    4,
    5,
    6,
];


export const states


= {
    0: "Pending",
    1: "Active",
    2: "Canceled",
    3: "Defeated",
    4: "Succeeded",
    5: "Queued",
    6: "Expired",
    7: "Executed",
};




    export const users = [
        {
            id: 1,
            username: "user1",
            address: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            image: "/src/assets/imgs/project.png",
            bio: "This is a description of project 1",
            projects: 2,
            proposals: 5,
            comments: 2,
            votes: 5,
            created: "12/12/2021",
            verified: true,
            community: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            verifiedBy: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            verifiedDate: "12/12/2021",
            verifiedStatus: "Active", 
        },
        {
            id: 3,
            username: "user3",
            address: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            image: "/src/assets/imgs/project.png",
            bio: "This is a description of project 1",
            projects: 2,
            proposals: 5,
            comments: 2,
            votes: 5,
            created: "12/12/2021",
            verified: true,
            community: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            verifiedBy: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            verifiedDate: "12/12/2021",
            verifiedStatus: "Active", 
        },
        {
            id: 3,
            username: "user3",
            address: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            image: "/src/assets/imgs/project.png",
            bio: "This is a description of project 1",
            projects: 2,
            proposals: 5,
            comments: 2,
            votes: 5,
            created: "12/12/2021",
            verified: true,
            community: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            verifiedBy: "0x364f65C9309BCCC0998B7B8aEb9410FD26ead3f1",
            verifiedDate: "12/12/2021",
            verifiedStatus: "Active", 
        },
    ];

