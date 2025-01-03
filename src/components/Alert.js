import { useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import { myEventsSelector } from '../store/selectors';
import config from '../config.json';

const Alert = () => {
    const { isPending, isSuccess, isError } = useSelector(state => state.exchange.transaction);
    const { account } = useSelector(state => state.provider);
    const myEvents = useSelector(myEventsSelector);
    const { chainId } = useSelector(state => state.provider);

    const alertRef = useRef();

    useEffect(() => {
        if (
            (
                isPending ||
                isError ||
                isSuccess
            ) && account
        ) {
            alertRef.current.className = 'alert';
        }
    }, [isPending, isError, isSuccess, account, myEvents]);

    const removeHandler = () => (alertRef.current.className = 'alert alert--remove');

    return (
        <div>
            {
                isPending && (
                    <div 
                        className="alert alert--remove"
                        ref={alertRef}
                        onClick={removeHandler}>
                        <h1>Transaction Pending...</h1>
                    </div>
                )
            }

            {
                isError && (
                    <div 
                        className="alert alert--remove"
                        ref={alertRef}
                        onClick={removeHandler}>
                        <h1>Transaction Will Fail</h1>
                    </div>
                )
            }

            {
                isSuccess && (
                    <div 
                        className="alert alert--remove"
                        ref={alertRef}
                        onClick={removeHandler}>
                        <h1>Transaction Successful</h1>
                        <a
                            href={`${config[chainId]?.explorerURL}/tx/${myEvents?.[0]?.transactionHash}`}
                            target='_blank'
                            rel='noreferrer'
                        >
                            {myEvents?.[0]?.transactionHash.slice(0, 6)}...{myEvents?.[0]?.transactionHash.slice(-6)}
                        </a>
                    </div>
                )
            }
            <div className="alert alert--remove"></div>
        </div>
    );
}

export default Alert;
