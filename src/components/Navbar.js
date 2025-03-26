import logo from '../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import Blockies from 'react-blockies';
import { loadAccount } from '../store/interactions';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import eth from '../assets/eth.svg';
import config from '../config.json';
import { formatValue } from '../utils/formatter';

const Navbar = () => {
	const { account, balance, chainId } = useSelector(state => state.provider);
    const dispatch = useDispatch();
    const provider = useWeb3Connection();

    const networkHandler = async event => {
        // 1. check if chain exists
        // 2. add eth chain
        // switch eth chain
        let chainId = event.target.value;

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: chainId,
                    },
                ],
            });
        } catch (error) {
            if (error.code === 4902) {
                try {
                    let { name, nativeCurrency, rpcUrls, explorerURL } = config[parseInt(chainId, 16)];

                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId,
                                chainName: name,
                                nativeCurrency,
                                rpcUrls,
                                blockExplorerUrls: [explorerURL],
                            },
                        ],
                    });
                } catch (addError) {
                    console.error('Failed to add chain:', addError);
                }
            } else {
                console.error('Error switching chain:', error);
            }
        }
    };

    return (
        <div className="exchange__header grid">
            <div className="exchange__header--brand flex">
                <img src={logo} className="logo" alt="B2E logo" />
                <h1>B2E</h1>
            </div>

            <div className="exchange__header--networks flex">
                <img src={eth} alt="ETH logo" className="Eth logo" />

                {chainId && (
                    <select name="networks" id="networks" value={config[chainId] ? `0x${chainId.toString(16)}` : '0'} onChange={networkHandler}>
                        <option value="0" disabled>
                            Select network
                        </option>
                        {Object.keys(config).map(chainId => (
                            <option value={`0x${Number(chainId).toString(16)}`} key={chainId}>
                                {config[chainId].name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="exchange__header--account flex">
                <p>
                    <small>My Balance</small>
                    {`${formatValue(balance)} ETH`}
                </p>

                {account ? (
                    <a href={`${config[chainId]?.explorerURL}/address/${account}`} target="_blank" rel="noopener noreferrer">
                        {`${account.slice(0, 7)}...${account.slice(-5)}`}

                        <Blockies seed={account} size={10} scale={3} color="#9670f6" bgColor="#F1F2F9" spotColor="#767F92" className="identicon" />
                    </a>
                ) : (
                    <button className="button" onClick={async () => await loadAccount(dispatch, provider)}>
                        Connect
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
