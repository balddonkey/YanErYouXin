
function postcardFromMeta(meta) {
  meta.audioList && meta.audioList.length > 0
    && (meta.audio = 'https://www.streamind.com' + meta.audioList[0]);
  meta.videoList && meta.videoList.length > 0
    && (meta.video = 'https://www.streamind.com' + meta.videoList[0]);
  let coordinate = meta.longitudeLatitude.split(',');
  console.log('coor:', coordinate);
  meta.location = {
    name: meta.address,
    longitude: coordinate[0],
    lagitude: coordinate[1]
  }
  return meta;
}

module.exports = {
  postcardFromMeta
};