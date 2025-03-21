import type { Rides, CountPriceObject, CountPrice } from './Rides';
import type { PickByValue } from './helpers';

export type BarChartTypes =
  | '_hours'
  | '_weeks'
  | '_days'
  | '_months'
  | '_cars'
  | '_years'
  | '_rates'
  | '_types'
  | '_restaurants';

export type BarChartsObject = {
  [K in BarChartTypes]?: CountPriceObject;
};

export type BarChartData = {
  [type: string]: string | number;
  count: number;
  price: number;
};
