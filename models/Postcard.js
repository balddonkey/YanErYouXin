
let DatePattern = /(\d{4}).(\d{1,2}).(\d{1,2}).+/mg;

function postcardFromMeta(meta) {
  meta.audioList && meta.audioList.length > 0 && 
    (meta.audio = 'https://www.streamind.com' + meta.audioList[0].path, 
    meta.audioDuration = meta.audioList[0].duration);
  meta.videoList && meta.videoList.length > 0
    && (meta.video = 'https://www.streamind.com' + meta.videoList[0].path);
  let coordinate = meta.longitudeLatitude ? meta.longitudeLatitude.split(',') : null;
  
  meta.longitude = coordinate && coordinate.length > 0 ? coordinate[0] : null;
  meta.lagitude = coordinate && coordinate.length > 1 ? coordinate[1] : null;

  let dateStr = meta.createTime.replace(DatePattern, '$1.$2.$3');
  meta.createTimeStr = dateStr;

  let duration = parseFloat(meta.audioDuration);
  meta.audioDurationStr = duration.toFixed(0);
  // meta.poster = {
  //   name: null,
  //   phone: meta.recevierPhone
  // }
  return meta;
}

module.exports = {
  postcardFromMeta
};