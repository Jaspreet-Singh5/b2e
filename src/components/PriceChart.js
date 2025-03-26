import downArrow from '../assets/down-arrow.svg';
import upArrow from '../assets/up-arrow.svg';
import { useSelector } from 'react-redux';
import Banner from './Banner';
import Chart from 'react-apexcharts';
import { defaultSeries, options } from './PriceChart.config';
import { priceChartSelector } from '../store/selectors';
import { useTokensContracts } from '../hooks/useTokensContracts';
import { CircularProgress } from '@mui/material';

const PriceChart = () => {
    const [tokens] = useTokensContracts();

    const { account } = useSelector(state => state.provider);
    const { symbols } = useSelector(state => state.tokens);
    const priceChart = useSelector(state => priceChartSelector(state, tokens));

    return (
        <div className="component exchange__chart">
            <div className='component__header flex-between'>
                <div className='flex'>

                    <h2>{symbols?.[0]}/{symbols?.[1]}</h2>

                    <div className='flex'>
                        {priceChart?.lastPriceChange === '+' ? (
                            <img src={upArrow} alt="Arrow up" />
                        ) : (
                            <img src={downArrow} alt="Arrow down" />
                        )}

                        <span className='up'>{priceChart?.lastOrderPrice}</span>
                    </div>

                </div>
            </div>

            {/* Price chart goes here */}
            {
                account
                    ? (
                        priceChart.loaded ? (
                            <Chart
                                options={options}
                                type='candlestick'
                                width='100%'
                                height='100%'
                                series={priceChart?.series ?? defaultSeries}
                            />
                        ) : (
                            <div className="flex justify-center align-center">
                                <CircularProgress className="circular-spinner" />
                            </div>
                        )
                    ) : (
                        <Banner>
                            Please Connect with MetaMask
                        </Banner>
                    )
            }

        </div>
    );
}

export default PriceChart;
