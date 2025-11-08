import { Client } from '@googlemaps/google-maps-services-js';

let mapsClient;

/**
 * Google Maps APIクライアントの初期化
 */
export function initializeMaps() {
  if (mapsClient) {
    return mapsClient;
  }

  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not set');
  }

  mapsClient = new Client({});
  console.log('✅ Google Maps initialized');
  return mapsClient;
}

/**
 * 2地点間の移動時間を計算
 */
export async function calculateTravelTime(origin, destination, mode = 'driving') {
  const client = initializeMaps();

  try {
    const response = await client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        mode: mode, // driving, walking, transit, bicycling
        language: 'ja',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.rows[0].elements[0].status === 'OK') {
      const element = response.data.rows[0].elements[0];
      return {
        duration: Math.ceil(element.duration.value / 60), // 秒→分
        distance: element.distance.value, // メートル
        durationText: element.duration.text,
        distanceText: element.distance.text,
      };
    } else {
      throw new Error('Failed to calculate travel time');
    }
  } catch (error) {
    console.error('Travel time calculation error:', error);
    throw error;
  }
}

/**
 * 住所から緯度経度を取得（ジオコーディング）
 */
export async function geocodeAddress(address) {
  const client = initializeMaps();

  try {
    const response = await client.geocode({
      params: {
        address: address,
        language: 'ja',
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
        formattedAddress: response.data.results[0].formatted_address,
      };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
}

/**
 * タスク間に自動的に移動タスクを挿入すべきか判定
 */
export async function shouldInsertTravelTask(task1, task2) {
  if (!task1.location || !task2.location) {
    return null;
  }

  if (task1.location === task2.location) {
    return null;
  }

  try {
    const travelTime = await calculateTravelTime(task1.location, task2.location);

    // 移動時間が10分以上なら移動タスクを挿入推奨
    if (travelTime.duration >= 10) {
      return {
        title: `${task1.location} → ${task2.location} への移動`,
        type: 'travel',
        estimatedDuration: travelTime.duration,
        location: task2.location,
        description: `距離: ${travelTime.distanceText}, 所要時間: ${travelTime.durationText}`,
      };
    }

    return null;
  } catch (error) {
    console.error('Travel task insertion check error:', error);
    return null;
  }
}

export default { initializeMaps, calculateTravelTime, geocodeAddress, shouldInsertTravelTask };
