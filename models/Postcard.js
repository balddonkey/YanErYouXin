
function postcardFromMeta(meta) {
  meta.audioList && meta.audioList.length > 0
    && (meta.audio = 'https://www.streamind.com' + meta.audioList[0]);
  meta.videoList && meta.videoList.length > 0
    && (meta.video = 'https://www.streamind.com' + meta.videoList[0]);
  let coordinate = meta.longitudeLatitude ? meta.longitudeLatitude.split(',') : null;
  
  meta.longitude = coordinate && coordinate.length > 0 ? coordinate[0] : null;
  meta.lagitude = coordinate && coordinate.length > 1 ? coordinate[1] : null;
  // meta.poster = {
  //   name: null,
  //   phone: meta.recevierPhone
  // }
  return meta;
}

module.exports = {
  postcardFromMeta
};