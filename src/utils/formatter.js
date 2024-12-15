export const formatValue = (value, decimals = 4) => (
        value
		? Number(value).toFixed(decimals)
		: '0.0000'
    );
