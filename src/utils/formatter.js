import { ethers } from "ethers";

export const formatValue = (value, decimals = 4) => (
        value
		? Number(value).toFixed(decimals)
		: '0.0000'
    );

export const formatOrder = (order) => {
    const {
        id,
        user,
        tokenGet,
        valueGet,
        tokenGive,
        valueGive,
        timestamp,
        creator
    } = order;
    
    return {
        id: id.toString(),
        user,
        tokenGet,
        valueGet: ethers.utils.formatEther(valueGet),
        tokenGive,
        valueGive: ethers.utils.formatEther(valueGive),
        timestamp: timestamp.toString(),
        creator
    };
}
