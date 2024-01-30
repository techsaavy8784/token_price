import axios from "axios";

// Function to fetch OHLCV data based on a pool address
async function fetchOHLCVData(
  network_id: string,
  poolAddress: string,
  timeFrame: string
): Promise<any> {
  try {
    const response = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/${network_id}/pools/${poolAddress}/ohlcv/${timeFrame}`
    );
    const ohlcData = response.data.data.attributes.ohlcv_list;
    if (ohlcData && Array.isArray(ohlcData) && ohlcData.length > 0) {
      console.log("OHLCV Data:", ohlcData);
      const closingPrices: number[] = ohlcData.map((data: any) => data[4]); // Extracting closing prices
      const percentageIncreases: number[] =
        calculatePercentageIncrease(closingPrices);
      const averagePercentageIncrease: number =
        calculateAveragePercentageIncrease(percentageIncreases);
      console.log("Average Percentage Increase:", averagePercentageIncrease);
    } else {
      console.error("Error: Invalid or empty OHLCV data in the response");
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

// Function to calculate average percentage increase using map and reduce
function calculateAveragePercentageIncrease(
  percentageIncreases: number[]
): number {
  const sum = percentageIncreases.reduce((acc, val) => acc + val, 0);
  return sum / percentageIncreases.length;
}

// Example usage
const network_id = "solana";
const poolAddress = "5WGx6mE9Xww3ocYzSenGVQMJLCVVwK7ePnYV6cXcpJtK"; // Replace with the actual pool address
const timeFrame = "day";

fetchOHLCVData(network_id, poolAddress, timeFrame);
