import downArrow from '../assets/down-arrow.svg';
import { useSelector } from 'react-redux';
import Banner from './Banner';
import Chart from 'react-apexcharts';
import { options, series } from './PriceChart.config';

const PriceChart = () => {
    const { account } = useSelector(state => state.provider);
    const { symbols } = useSelector(state => state.tokens);

    return (
        <div className="component exchange__chart">
            <div className='component__header flex-between'>
                <div className='flex'>

                    <h2>{symbols?.[0]}/{symbols?.[1]}</h2>

                    <div className='flex'>
                        <img src={downArrow} alt="Arrow down" />
                        <span className='up'></span>
                    </div>

                </div>
            </div>

            {/* Price chart goes here */}
            {
                account
                ? (
                    <Chart
                        options={options}  
                        type='candlestick'
                        width='100%'
                        height='100%'
                        series={series}
                    />
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
