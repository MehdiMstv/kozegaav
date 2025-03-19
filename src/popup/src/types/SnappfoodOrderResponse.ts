export interface SnappfoodOrderResponse {
  status: boolean;
  data: {
    count: number;
    orders: SnappfoodOrder[];
    pageSize: number;
  };
}

export interface SnappfoodOrder {
  orderId: number;
  vendorCode: string;
  orderCanceled: boolean;
  newTypeTitle: string;
  newType: string;
  vendorId: number;
  customerComment: string;
  superTypeAlias: string;
  vendorTitle: string;
  vendorLogo: string;
  isVendorEcommerce: boolean;
  childType: string;
  orderCode: string;
  date: string;
  time: string;
  reviewed: boolean;
  showReview: boolean;
  reviewText: string;
  rate: number | null;
  deliveryRate: number | null;
  reviewLink: string;
  totalPrice: number;
  containerPrice: number;
  vatAmount: number;
  subTotalDiscount: number;
  couponDiscountAmount: number;
  couponDeliveryDiscountAmount: number;
  containerPriceDiscount: number;
  deliveryFeeDiscount: number;
  voucherDiscount: string;
  vatAmountDiscount: number;
  sumAllDiscount: number;
  deliveryFee: number;
  grossDeliveryFee: number;
  startedAt: string;
  startedAtObject: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  statusDate: string;
  statusDateObject: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  deliveryTime: number;
  paymentTypeCode: string;
  orderAddress: {
    id: string;
    label: string;
    address: string;
    longitude: number;
    latitude: number;
  };
  vendorLongitude: number;
  vendorLatitude: number;
  vendorAddress: string;
  inPlaceDelivery: boolean;
  isSpecial: boolean;
  displayContainerPrice: boolean;
  dataSettlement: {
    unpaidDeltaSettlementWithCashBack: number;
    unpaidDeltaSettlement: number;
    isDeltaSettlementPaid: boolean;
  };
  serviceFee: number;
  sfServiceFeeMinPrice: number;
  sfServiceFee: number;
  expeditionType: string;
  products: SnappfoodProduct[];
  vendorPaymentTypes: number[];
}

export interface SnappfoodProduct {
  id: number;
  categoryId: string;
  orderProductId: number;
  rootOrderProductId: null;
  count: number;
  productVariationTitle: string;
  title: string;
  description: string;
  price: number;
  type: any[];
  discount: number;
  discountRatio: number;
  productToppings: any[];
  productTitle: string | null;
  createdAt: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  containerPrice: number;
  vat: number;
  images: {
    imageId: number;
    imageSrc: string;
    imageThumbnailSrc: string;
    imageUserType: string;
    imageDescription: string;
  }[];
  rating: number;
  disabledUntil: boolean;
  visible: boolean;
  productVariationCode: string | null;
  productVariationId: number;
} 