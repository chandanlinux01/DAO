import Navbar from './Navbar';
import { ConnectWallet } from '@thirdweb-dev/react';



export default function Headers (){
    return (
        <div className="top_bar">
        <img src="assets/imgs/logo.png" alt="" className='header-logo'/>
        <div className='connect-to-wallet'>
            <ConnectWallet />
        </div>
     

        <Navbar />
        </div>
    )

}
