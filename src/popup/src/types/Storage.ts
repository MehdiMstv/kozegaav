import type { ArrayElement } from './helpers';
import type { OrdersData, RidesData } from './Rides';

export const DATA_VERSIONS = ['1'] as const;

export type VersionsKeys = ArrayElement<typeof DATA_VERSIONS>;

export type VersionObject = {
  forceUpdate: boolean;
};

export type DataSource = 'snapp' | 'snappfood';

export type MetaData = {
  lastRideId: string;
  lastOrderId?: string;
  version: VersionsKeys;
  dataType?: DataSource;
} & Pick<VersionObject, 'forceUpdate'>;

export type SnappTaxiDataStorage = {
  rides: RidesData;
  meta: MetaData;
};

export type SnappfoodDataStorage = {
  orders: OrdersData;
  meta: MetaData;
};

