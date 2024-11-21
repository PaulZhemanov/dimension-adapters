import type { SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";
import fetch from "node-fetch";

const url = 'https://app.sentio.xyz/api/v1/analytics/zhpv96/spark-processor/sql/execute';
const apiKey = 'TLjw41s3DYbWALbwmvwLDM9vbVEDrD9BP';
const data = {
  sql: "SELECT SUM(tradeVolume) AS dailyTradeVolume FROM `TradeVolume_raw` LIMIT 10000;",
};

const fetchTradeVolume = async () => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    console.log('API Response:', json);

    const rows = json.result?.rows || [];
    const dailyVolume = rows.length > 0 ? rows[0]?.dailyTradeVolume || 0 : 0;

    console.log('Daily Volume:', dailyVolume);

    return {
      dailyVolume,
    };
  } catch (error) {
    console.error('Error fetching daily volume:', error);
    return { dailyVolume: 0 };
  }
};

const adapters: SimpleAdapter = {
  version: 1,
  adapter: {
    [CHAIN.FUEL]: {
      fetch: fetchTradeVolume,
      start: 1601424000,
    },
  },
};
  
export default adapters;