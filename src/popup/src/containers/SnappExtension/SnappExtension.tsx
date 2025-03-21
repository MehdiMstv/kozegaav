import {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  lazy,
  Suspense,
} from 'react';
import get from 'lodash.get';

import type { DataSource, SnappTaxiDataStorage, SnappfoodDataStorage } from 'types/Storage';
import type { RideHistoryResponse } from 'types/RideHistoryResponse';
import type { SnappfoodOrder } from 'types/SnappfoodOrderResponse';

import { getReport, mergeReports, getSnappfoodReport } from 'manipulate';
import { getErrorMessage, getLastRideDateMessage } from 'utils/messages';
import { fetchSingleRidePage, fetchSnappfoodOrderPage } from 'api';
import constants from 'utils/constants';
import { convertToLastVersion, getLastVersionNumber } from 'manipulate/convert';

import CarAnimation from 'components/CarAnimation';
import Footer from 'components/Footer';
import Link from 'components/Link';
import styles from './SnappExtension.module.css';

const ResultComponent = lazy(() => import('containers/Result'));

const SnappExtension = () => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [dataInStorage, setDataInStorage] = useState<SnappTaxiDataStorage | SnappfoodDataStorage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [isSnappfoodLoading, setIsSnappfoodLoading] = useState<boolean>(false);
  const [snappfoodPage, setSnappfoodPage] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'snapp' | 'snappfood'>('snapp');
  const [currentData, setCurrentData] = useState<SnappTaxiDataStorage | SnappfoodDataStorage | null>(null);
  const [resultDataType, setResultDataType] = useState<DataSource>('snapp');
  const [isResultPage, setIsResultPage] = useState<boolean>(false);

  const pendingTimer = useRef<NodeJS.Timeout>();
  
  // set Snapp access token
  useEffect(() => {
    chrome.storage.local.get('accessToken', ({ accessToken }) => {
      setAccessToken(accessToken);
    });

    // clean-up
    return () => {
      if (pendingTimer.current) {
        clearTimeout(pendingTimer.current);
      }
    };
  }, []);

  // Set data based on active tab
  useEffect(() => {
    chrome.storage.local.get(['rideResult', 'foodResult'], (result) => {
      setDataInStorage(activeTab === 'snapp' ? result.rideResult : result.foodResult);
    });
  }, [activeTab]);

  // Check if we're on the result page
  useEffect(() => {
    setIsResultPage(window.location.href.includes('#result'));
  }, []);

  // Load result data when in result page
  useEffect(() => {
    if (isResultPage) {
      // Determine which data to display based on URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const dataTypeParam = urlParams.get('type') || 'snapp';
      const dataType = dataTypeParam === 'snappfood' ? 'snappfood' as const : 'snapp' as const;
      setResultDataType(dataType);
      setActiveTab(dataType);
      
      // Get data from storage
      chrome.storage.local.get(['rideResult', 'foodResult'], (result) => {
        const data = dataType === 'snappfood' ? result.foodResult : result.rideResult;
        if (data) {
          setCurrentData(data);
        }
      });
    }
  }, [isResultPage]);

  // Render the result page if we're on the result route
  if (isResultPage) {
    if (!currentData) {
      return <div className={styles.loadData}>{constants.loadData}</div>;
    }
    return (
      <Suspense fallback={<div className={styles.loadData}>{constants.loadData}</div>}>
        <ResultComponent
          data={currentData}
          dataType={resultDataType}
        />
      </Suspense>
    );
  }

  const getSingleRidePage = async (accessToken: string, page: number) => {
    try {
      return await fetchSingleRidePage(accessToken, page++);
    } catch (e) {
      const error =
        getErrorMessage[(e as Error).message] || constants.somethingWentWrong;
      setError(error);
      setIsLoading(false);
      return [];
    }
  };

  // fetch data from Snapp API
  const getAllRides = async (
    accessToken: string
  ): Promise<RideHistoryResponse[]> => {
    let page = 1;
    setPage(page);
    let rides = await getSingleRidePage(accessToken, page++);
    let response = [...rides];

    while (rides.length > 0) {
      response = [...response, ...rides];
      setPage(page);
      rides = await getSingleRidePage(accessToken, page++);
    }
    return response;
  };

  const getNewRides = async (
    pageOneHistory: RideHistoryResponse[],
    filterRideId: string
  ): Promise<RideHistoryResponse[]> => {
    let page = 2;
    setPage(page);
    let rides = await getSingleRidePage(accessToken, page++);
    let response = [...pageOneHistory, ...rides];

    while (rides.length > 0) {
      const lastRideIdIndex = response.findIndex(
        (r) => r.human_readable_id === filterRideId
      );
      if (lastRideIdIndex > -1) {
        // return new rides
        return response.slice(0, lastRideIdIndex);
      } else {
        response = [...response, ...rides];
        setPage(page);
        rides = await getSingleRidePage(accessToken, page++);
      }
    }
    return response;
  };

  const prepareRidesData = async (accessToken: string) => {
    const ridesHistory = await getAllRides(accessToken);
    const [lastRide] = ridesHistory;

    const rides = getReport(ridesHistory);

    handleShowResult(
      {
        rides,
        meta: {
          lastRideId: lastRide.human_readable_id,
          version: getLastVersionNumber(),
          forceUpdate: false,
          dataType: 'snapp'
        },
      } as SnappTaxiDataStorage,
      true
    );
    setIsFetching(false);
  };

  // fetch a single page of Snappfood orders
  const getSnappfoodOrderPage = async (page: number) => {
    try {
      return await fetchSnappfoodOrderPage(page);
    } catch (e) {
      const error =
        getErrorMessage[(e as Error).message] || constants.somethingWentWrong;
      setError(error);
      setIsSnappfoodLoading(false);
      return null;
    }
  };

  // fetch all Snappfood orders
  const getAllSnappfoodOrders = async (): Promise<SnappfoodOrder[]> => {
    let page = 0;
    setSnappfoodPage(page);
    let response = await getSnappfoodOrderPage(page++);
    
    if (!response) return [];
    
    let orders = [...response.data.orders];
    const totalPages = Math.ceil(response.data.count / response.data.pageSize);
    
    while (page < totalPages) {
      setSnappfoodPage(page);
      response = await getSnappfoodOrderPage(page++);
      if (response) {
        orders = [...orders, ...response.data.orders];
      }
    }
    
    return orders;
  };

  // process Snappfood data
  const prepareSnappfoodData = async () => {
    const orders = await getAllSnappfoodOrders();
    const snappfoodData = getSnappfoodReport(orders);
    
    const data = {
      orders: snappfoodData,
      meta: {
        lastOrderId: orders.length > 0 ? orders[0].orderCode : '',
        version: getLastVersionNumber(),
        forceUpdate: false,
        dataType: 'snappfood' as const
      },
    } as SnappfoodDataStorage;

    chrome.storage.local.set({ foodResult: data }, () => {
      pendingTimer.current = setTimeout(() => {
        setIsSnappfoodLoading(false);
        chrome.tabs.create({
          url: chrome.runtime.getURL('popup/index.html?type=snappfood#result'),
        });
      }, 3000);
    });
  };

  const handleGetSnappfoodOrders = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveTab('snappfood');
    setResultDataType('snappfood');
    setIsSnappfoodLoading(true);
    setIsFetching(false);
    await prepareSnappfoodData();
  };

  const handleGetRidesHistory = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setActiveTab('snapp');
    
    if (e.target instanceof HTMLElement) {
      const accessToken = e.target.dataset.accessToken as string;

      if (dataInStorage && 'rides' in dataInStorage) {
        const { meta, rides } = convertToLastVersion(dataInStorage as SnappTaxiDataStorage);
        if (meta.forceUpdate) {
          prepareRidesData(accessToken);
        } else {
          // get last ride
          setPage(1);
          const lastRidesPage = await getSingleRidePage(accessToken, 1);
          if (lastRidesPage.length > 0) {
            const lastRideId = lastRidesPage[0].human_readable_id;

            const isUpdated = lastRideId === meta.lastRideId;

            if (isUpdated) {
              handleShowResult({ rides, meta } as SnappTaxiDataStorage, false);
            } else {
              // fetch new rides history based on last ride id
              const ridesHistory = await getNewRides(
                lastRidesPage,
                meta.lastRideId!
              );
              const newRides = getReport(ridesHistory);
              const rides = mergeReports(newRides, (dataInStorage as SnappTaxiDataStorage).rides);

              handleShowResult({ rides, meta: { ...meta, lastRideId } } as SnappTaxiDataStorage, false);
            }
          }
        }
      } else {
        prepareRidesData(accessToken);
      }
    }
  };

  const handleShowResult = (data: SnappTaxiDataStorage | SnappfoodDataStorage, withLoading: boolean) => {
    const storageKey = data.meta.dataType === 'snappfood' ? 'foodResult' : 'rideResult';
    
    chrome.storage.local.set({ [storageKey]: data }, () => {
      if (withLoading) {
        pendingTimer.current = setTimeout(() => {
          setIsLoading(false);
          setIsSnappfoodLoading(false);
          handleOpenNewTab();
        }, 3000);
      } else {
        setIsLoading(false);
        setIsSnappfoodLoading(false);
        handleOpenNewTab();
      }
    });
  };

  const handleOpenNewTab = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL(`popup/index.html?type=${activeTab}#result`),
    });
  };


  if (isLoading) {
    return <CarAnimation isFetching={isFetching} speed={page} />;
  }

  if (isSnappfoodLoading) {
    return <CarAnimation isFetching={isFetching} speed={snappfoodPage} />;
  }

  const lastRideEndRange = get(dataInStorage, 'rides.total._ranges.end', '');

  return (
    <main className={styles.extension}>
      <div className={styles.actions}>
        {accessToken && !error ? (
          <>
            <div className={styles.buttonsContainer}>
              <button
                className={styles.snappButton}
                data-access-token={accessToken}
                onClick={handleGetRidesHistory}
                type="button"
              >
                {constants.getSnappRides}
              </button>
              
              <button
                className={styles.snappfoodButton}
                onClick={handleGetSnappfoodOrders}
                type="button"
              >
                {constants.getSnappfoodOrders}
              </button>
            </div>
            <span className={styles.lastRideDate}>
              {lastRideEndRange && getLastRideDateMessage(lastRideEndRange, resultDataType)}
            </span>
          </>
        ) : (
          <>
            <span className={styles.hint}>
              {error ? error : constants.snappLoginHint}
            </span>
            <Link url="snappPWA">
              <button className={styles.snappButton} type="button">
                {constants.loginToSnapp}
              </button>
            </Link>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default SnappExtension;
