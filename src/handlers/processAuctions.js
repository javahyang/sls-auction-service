import createError from 'http-errors';
import { closeAuction } from '../lib/closeAuction';
import { getEndedAuctions } from '../lib/getEndedAuctions';

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map(auction => closeAuction(auction));
    await Promise.all(closePromises);

    // 이 함수는 api gateway를 통해 트리거되는게 아니기 때문에, 원하는대로 리턴값을 지정할 수 있다
    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = processAuctions;