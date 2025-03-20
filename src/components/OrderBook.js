import { useSelector, useDispatch } from 'react-redux';
import sort from '../assets/sort.svg';
import { myOpenOrdersSelector, orderBookSelector } from '../store/selectors';
import { useTokensContracts } from '../hooks/useTokensContracts';
import { OrderType } from '../enums/orderType';
import { fillOrder } from '../store/interactions';
import { useExchangeContract } from '../hooks/useExchangeContract';
import { useWeb3Connection } from '../hooks/useWeb3Connection';
import { CircularProgress, styled } from '@mui/material';
import { 
    forwardRef,
    Fragment
} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

const StyledTableCell = styled(TableCell)(({
    theme
}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${
        tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({
    theme
}) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const OrderBook = () => {
    const [ tokens ] = useTokensContracts();
    const exchange = useExchangeContract();
    const provider = useWeb3Connection();
    
    const { symbols } = useSelector(state => state.tokens);
    const { data: orderBook, loaded } = useSelector(state => orderBookSelector(state, tokens));
    const {
        data: myOpenOrders,
        loaded: myOpenOrdersLoaded,
    } = useSelector(state => myOpenOrdersSelector(state, tokens));

    const dispatch = useDispatch();

    const fillOrderHandler = async (e, orderId) => {
        e.preventDefault();

        await fillOrder(orderId, exchange, provider, dispatch);
    }

    const checkOwnOrder = (order) => {
        return myOpenOrders.find(myOpenOrder => myOpenOrder.id === order.id);
    }
    
    const createData = (data, symbol0, symbol1) => {
        if (
            !Array.isArray(data) || 
            data.length === 0 ||
            !symbol0 ||
            !symbol1
        ) return [];
        
        return data.map((order, id) => ({
            id,
            [`${symbol0}`]: order.token0Amount,
            [`${symbol0}/${symbol1}`]: order.tokenPrice,
            [`${symbol1}`]: order.token1Amount,
        }));
    };
    const columns = (symbol0, symbol1) => [
        {
            width: 100,
            label: symbol0,
            dataKey: symbol0,
        },
        {
            width: 100,
            label: `${symbol0}/${symbol1}`,
            dataKey: `${symbol0}/${symbol1}`,
        },
        {
            width: 100,
            label: symbol1,
            dataKey: symbol1,
        },
    ];      

    const fixedHeaderContent = columns => {
        return (
            <TableRow>
                {columns.map(column => (
                    <StyledTableCell key={column.dataKey} variant="head" align={column.numeric || false ? 'right' : 'left'}>
                        {column.label}
                    </StyledTableCell>
                ))}
            </TableRow>
        );
    };

    function rowContent(_index, row) {
        return (
            <Fragment>
                {columns(symbols?.[0], symbols?.[1]).map(column => (
                    <StyledTableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
                        {row[column.dataKey]}
                    </StyledTableCell>
                ))}
            </Fragment>
        );
    }

    const VirtuosoTableComponents = {
        Scroller: forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
        Table: props => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
        TableHead: forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
        TableRow: forwardRef((props, ref) => <StyledTableRow {...props} ref={ref} />),
        TableCell: forwardRef((props, ref) => <StyledTableCell {...props} ref={ref} />),
        TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };
    
    return (
        <div className="component exchange__orderbook">
            <div className='component__header flex-between'>
                <h2>Order Book</h2>
            </div>

                {
                    (loaded && myOpenOrdersLoaded) ? (
                            <div className="flex items-start">
                                {
                                    orderBook?.[OrderType.SELL]
                                    ? (
                                        <Paper style={{ height: 400, width: '100%' }}>
                                            <TableVirtuoso
                                                data={createData(
                                                        orderBook[OrderType.SELL],
                                                        symbols?.[0],
                                                        symbols?.[1]
                                                    )
                                                }
                                                components={VirtuosoTableComponents}
                                                fixedHeaderContent={() => fixedHeaderContent(
                                                    columns(
                                                        symbols?.[0],
                                                        symbols?.[1],
                                                    )
                                                )}
                                            itemContent={rowContent}
                                            />
                                       </Paper>
                                    )
                                    : (
                                        <p className='flex-center'>No Sell Orders</p>
                                    )
                                }

                                <div className='divider'></div>
                            
                                {
                                    orderBook?.[OrderType.BUY]
                                    ? (
                                        <table className='exchange__orderbook--buy'>
                                            <caption>Buying</caption>
                                            <thead>
                                                <tr>
                                                    <th>{symbols?.[0]}<img src={sort} alt='Sort' /></th>
                                                    <th>{symbols?.[0]}/{symbols?.[1]}<img src={sort} alt='Sort' /></th>
                                                    <th>{symbols?.[1]}<img src={sort} alt='Sort' /></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                
                                                {
                                                    orderBook[OrderType.BUY].map(order => {
                                                        return (
                                                            <tr key={btoa(order.id)}
                                                                onClick={(e) => fillOrderHandler(e, order.id)}
                                                            >
                                                                <td>{order.token0Amount}</td>
                                                                <td style={{color: order.orderTypeClass}}>{order.tokenPrice}</td>
                                                                <td>{order.token1Amount}</td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    )
                                    : (
                                        <p className='flex-center'>No Buy Orders</p>
                                    )
                                }
                            </div>
                    ) : (
                        <div className="flex justify-center align-center">
                            <CircularProgress sx={{ color: '#2187D0' }} />
                        </div>
                    )
                }
        </div>
    );
}

export default OrderBook;
