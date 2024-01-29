import axios from "axios";

// Fetch price history data from the CoinGecko API
async function fetchPriceHistory(
  tokenId: string,
  days: number
): Promise<number[]> {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`
  );
  const priceData = response.data.prices;
  return priceData.map((data: any) => data[1]); // Extracting only the price values
}

// Calculate percentage increase for each data point
function calculatePercentageIncrease(data: number[]): number[] {
  const percentageIncreases: number[] = [];
  for (let i = 1; i < data.length; i++) {
    const percentageIncrease: number =
      ((data[i] - data[i - 1]) / data[i - 1]) * 100;
    percentageIncreases.push(percentageIncrease);
  }
  return percentageIncreases;
}

// Calculate average percentage increase using map and reduce
function calculateAveragePercentageIncrease(
  percentageIncreases: number[]
): number {
  const sum = percentageIncreases.reduce((acc, val) => acc + val, 0);
  return sum / percentageIncreases.length;
}

const tokenId = "solend";
const days = 7; // Fetch price history for the last 7 days

fetchPriceHistory(tokenId, days)
  .then((priceData) => {
    const percentageIncreases = calculatePercentageIncrease(priceData);
    const averagePercentageIncrease =
      calculateAveragePercentageIncrease(percentageIncreases);
    console.log("Average Percentage Increase:", averagePercentageIncrease);
  })
  .catch((error) => {
    console.error("Error fetching price history:", error);
  });
