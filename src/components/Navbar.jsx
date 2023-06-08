// import { API_URL } from '../constants/constants';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (

        <ul className="nav nav-pills nav-fill">
            <li className="nav-item active"><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/ProposalTemplate" className="nav-link">Proposal Details Page</Link></li>
            <li className="nav-item"><Link to="/Communities" className="nav-link">Communities</Link></li>
            {/* <li className="nav-item"><Link to="/Members" className="nav-link">Members</Link></li> */}
            <li className="nav-item"><Link to="/MyCommunity" className="nav-link" >My Community</Link></li>
            <li className="nav-item"><Link to="/Join" className="nav-link">Join</Link></li>
        </ul>






    )

}
