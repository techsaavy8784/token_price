import axios from "axios";
import * as fs from "fs";
import fetchOHLCVData from "./avePercent_coingeckoTerminalAPI";

async function fetchPools_GetAveragePercetageIncrease(
  network_id: string,
  token_address: string,
  timeFrame: string,
  limit: number
): Promise<any> {
  try {
    const response = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/${network_id}/tokens/${token_address}/pools`
    );
    const poolsData = response.data.data;

    if (poolsData && Array.isArray(poolsData) && poolsData.length > 0) {
      // console.log("PoolsData:", poolsData);
      const printData: any[] = await Promise.all(
        poolsData.map(async (pool: any) => {
          const inputString: string = pool.id;
          const parts: string[] = inputString.split("_");
          const poolAddress: string = parts[1];
          return await fetchOHLCVData(
            network_id,
            poolAddress,
            timeFrame,
            limit
          );
        })
      );

      const jsonData = JSON.stringify(printData, null, 2);
      fs.writeFileSync("Result.txt", jsonData, "utf8");
    } else {
      console.error("Error: Invalid or empty poolsData in the response");
    }
  } catch (error) {
    console.error("Error fetching Pools data:", error);
  }
}

const network_id = "solana";
const token_address = "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm";
const timeFrame = "day";
const limit = 7;

fetchPools_GetAveragePercetageIncrease(
  network_id,
  token_address,
  timeFrame,
  limit
);
