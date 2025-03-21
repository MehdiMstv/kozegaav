import type { RideHistoryResponse } from 'types/RideHistoryResponse';
import type { SnappfoodOrderResponse } from 'types/SnappfoodOrderResponse';

export const fetchSingleRidePage = async (
  accessToken: string,
  page: number
): Promise<RideHistoryResponse[]> => {
  const url = `https://app.snapp.taxi/api/api-base/v2/passenger/ride/history?page=${page}`;
  return await fetch(url, {
    headers: {
      'User-Agent': navigator.userAgent,
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'app-version': 'pwa',
      'x-app-version': '5.0.1',
      'x-app-name': 'passenger-pwa',
      'content-type': 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
    referrer: 'https://app.snapp.taxi/ride-history',
    method: 'GET',
    mode: 'cors',
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(`${response.status}`);
        } else if (response.status === 500) {
          return {
            data: {
              rides: [],
            },
          };
        }
      } else {
        return response.json();
      }
    })
    .then(({ data }) => data.rides)
    .catch((error) => Promise.reject(error));
};

export const fetchSnappfoodOrderPage = async (
  page: number,
  size = 100
): Promise<SnappfoodOrderResponse> => {
  const url = `https://snappfood.ir/mobile/v1/order/reorder?page=${page}&size=${size}`;
  
  return await fetch(url, {
    headers: {
      'User-Agent': navigator.userAgent,
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'content-type': 'application/json',
    }, 
    referrer: 'https://snappfood.ir',
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(`${response.status}`);
        }
      } else {
        return response.json();
      }
    })
    .then((data) => data)
    .catch((error) => Promise.reject(error));
};
