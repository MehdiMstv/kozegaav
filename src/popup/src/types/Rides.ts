export type CountPrice = {
  count: number;
  price: number;
};

export type CountPriceObject = { [name: string]: CountPrice };

export type Coordinate = {
  lat: string | number;
  lng: string | number;
};

export type LocationPoint = {
  origin: Coordinate[];
  destination: Coordinate[];
};

export interface OrderDetail {
  id: string;
  date: string;
  price: number;
  vendor: string;
  address: string;
  destination: {
    latitude: number;
    longitude: number;
  };
  origin: {
    latitude: number;
    longitude: number;
  };
  type: string;
  products?: string;
}

// Common properties for both Rides and Orders
export type CommonData = {
  _summary: {
    count: number;
    prices: number; // Tomans
    distance?: number;
    durations?: number;
  };
  _ranges: {
    start: string; // start time
    end: string; // end time
  };
  _hours: CountPriceObject;
  _days: CountPriceObject;
  _months: CountPriceObject;
  _weeks: CountPriceObject;
  _types: CountPriceObject;
  _years?: CountPriceObject;
};

export type Rides = CommonData & {
  _cars: CountPriceObject;
  _points: LocationPoint;
  _rates: CountPriceObject & {
    count?: number;
    rated_count?: number;
    rates?: number;
  };
};

export type Orders = CommonData & {
  _restaurants: CountPriceObject; // For restaurants
  orders?: OrderDetail[];
};

export type RidesData = { [year: string]: Rides };
export type OrdersData = { [year: string]: Orders };

export type CommonSummary = {
  count: number;
  prices: number;
  distance?: number;
  durations?: number;
  maxPrice?: number;
};