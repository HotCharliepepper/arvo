// No network or transaction API. A new integration requires separate review.
export const BOOKING_STATES=Object.freeze(['OTA_ONLY','VENDIT_READY_FOR_QA','DIRECT_BOOKING_LIVE']);
export function bookingAdapter(data) {
  const state=data.booking?.state;
  if(!BOOKING_STATES.includes(state)) throw new Error('Unknown booking state');
  if(state!=='OTA_ONLY') throw new Error('DIRECT BOOKING BLOCKED: approved scope and an independently reviewed integration are required');
  const channels={nol:'https://nol.yanolja.com/stay/domestic/1000099461',yeogi:'https://www.yeogi.com/domestic-accommodations/57753'};
  for(const [key,url] of Object.entries(channels)) if(data.reservation[key]!==url) throw new Error('OTA destination requires re-verification: '+key);
  return Object.freeze({state,channels,supportsTransactions:false});
}
