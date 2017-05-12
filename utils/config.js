module.exports = {
  api: 'http://api2.heyhou.com',
  //tapi: 'http://tapi.heyhou.com',
  tapi: 'https://sapi.heyhou.com',
  //tapi: 'http://192.168.1.130',
  //tapi: 'http://heyhou.me',
  appID: 'wx625e5106ecf2cd1e',
  // appID: 'wx398f9d4ef8357a15',
  debug: true,
  storageKeys: {
    userInfo: 'HH_USER_INFO',
    userDetailInfo: 'HH_Detail_USER_INFO',
    cityInfo: 'HH_POSITION_CITY',
    positionCityInfo: 'HH_POSITION_CITY_INFO',
    autoGetPositionCity: 'HH_AUTO_GET_POSITION_CITY',
    TICKET_ORDER_INFO: 'HH_TICKET_ORDER_INFO',
    MALL_RECEIPT_ADDRESS: 'HH_RECEIPT_ADDRESS',
    TRANSFER_ORDER_INFO: 'HH_TRANSFER_ORDER_INFO',
    PAY_SUCCESS_INFO: 'HH_PAY_SUCCESS_INFO',
    REGISTER_AREA_CODE: 'HH_REGISTER_AREA_CODE'
  },
  AMAP: {
    URL: 'https://restapi.amap.com/v3',
    KEY: 'b0e90a709ef02c7c47882bb625859432'
  }
}