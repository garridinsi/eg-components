export interface WCResponse {
  url: string;
  green: boolean;
  bytes: number;
  cleanerThan: number;
  statistics: {
    adjustedBytes: number;
    energy: number;
    co2: {
      grid: {
        grams: number;
        litres: number;
      };
      renewable: {
        grams: number;
        litres: number;
      };
    };
  };
  timestamp: number;
}
