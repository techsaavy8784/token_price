import axios from "axios";

// Function to fetch OHLCV data based on a pool address
async function fetchOHLCVData(
  network_id: string,
  poolAddress: string,
  timeFrame: string,
  limit: number
): Promise<any> {
  try {
    const response = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/${network_id}/pools/${poolAddress}/ohlcv/${timeFrame}?limit=${limit}`
    );
    if (
      response.data &&
      response.data.data &&
      response.data.data.attributes &&
      response.data.data.attributes.ohlcv_list
    ) {
      const ohlcData = response.data.data.attributes.ohlcv_list;
      if (Array.isArray(ohlcData) && ohlcData.length > 0) {
        const closingPrices: number[] = ohlcData.map((data: any) => data[4]); // Extracting closing prices
        const percentageIncreases: number[] =
          calculatePercentageIncrease(closingPrices);
        const averagePercentageIncrease: number =
          calculateAveragePercentageIncrease(percentageIncreases);
        console.log("Network:", network_id);
        console.log("PoolAddress:", poolAddress);
        console.log("timeFrame:", timeFrame);
        console.log("ohlcData:", ohlcData);
        console.log(
          "Average Percentage Increase for one week:",
          averagePercentageIncrease
        );
      } else {
        console.error("Error: Invalid or empty OHLCV data in the response");
      }
    } else {
      console.error("Error: Invalid response data format");
    }
  } catch (error) {
    console.error("Error fetching OHLCV data:", error);
  }
}

// Function to calculate percentage increase for each data point
function calculatePercentageIncrease(data: number[]): number[] {
  const percentageIncreases: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const percentageIncrease: number =
      ((data[i] - data[i - 1]) / data[i - 1]) * 100;
    percentageIncreases.push(percentageIncrease);
  }
  return percentageIncreases;
}

// Function to calculate average percentage increase using reduce
function calculateAveragePercentageIncrease(
  percentageIncreases: number[]
): number {
  const sum = percentageIncreases.reduce((acc, val) => acc + val, 0);
  return sum / percentageIncreases.length;
}

export default fetchOHLCVData;
