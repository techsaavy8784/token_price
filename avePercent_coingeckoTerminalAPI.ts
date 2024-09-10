import axios from "axios";

interface OHLCVDATA {
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
}

interface OHLCVResult {
  network_id: string;
  poolAddress: string;
  timeFrame: string;
  ohlcvData: OHLCVDATA[];
  averagePercentageIncrease: number;
}

// Function to fetch OHLCV data based on a pool address
async function fetchOHLCVData(
  network_id: string,
  poolAddress: string,
  timeFrame: string,
  limit: number
): Promise<OHLCVResult | undefined> {
  try {
    const { data: resp } = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/${network_id}/pools/${poolAddress}/ohlcv/${timeFrame}?limit=${limit}`
    );

    if (
      resp &&
      resp.data &&
      resp.data.attributes &&
      resp.data.attributes.ohlcv_list
    ) {
      const ohlcData = resp.data.attributes.ohlcv_list;
      if (Array.isArray(ohlcData) && ohlcData.length > 0) {
        const closingPrices: number[] = ohlcData.map((data: any) => data[4]); // Extracting closing prices
        const percentageIncreases: number[] =
          calculatePercentageIncrease(closingPrices);
        const averagePercentageIncrease: number =
          calculateAveragePercentageIncrease(percentageIncreases);
        const ohlcvData = ohlcData.map((dataPoint: number[]) => {
          return {
            openPrice: dataPoint[1],
            highPrice: dataPoint[2],
            lowPrice: dataPoint[3],
            closePrice: dataPoint[4],
            volume: dataPoint[5],
          };
        });
        const resultData = {
          network_id,
          poolAddress,
          timeFrame,
          ohlcvData,
          averagePercentageIncrease,
        };
        return resultData;
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
