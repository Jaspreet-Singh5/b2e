import { ethers } from "ethers"

export const parseTokens = (amount) => {
    return ethers.utils.parseEther(amount.toString());
}
