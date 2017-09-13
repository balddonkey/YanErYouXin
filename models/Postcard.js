
let DatePattern = /(\d{4}).(\d{1,2}).(\d{1,2}).+/mg;

function postcardFromMeta(meta) {
  let coordinate = meta.longitudeLatitude ? meta.longitudeLatitude.split(',') : null;
  
  meta.longitude = coordinate && coordinate.length > 0 ? parseFloat(coordinate[0]) : null;
  meta.latitude = coordinate && coordinate.length > 1 ? parseFloat(coordinate[1]) : null;

  let dateStr = meta.createTime.replace(DatePattern, '$1.$2.$3');
  meta.createTimeStr = dateStr;

  // meta.resource.path = 'https://www.streamind.com' + meta.resource.path;

  if (meta.resource.type == 3) {
    let duration = parseFloat(meta.resource.duration);
    let audioDurationStr = duration.toFixed(0);
    meta.resource.durationStr = audioDurationStr;
  }
  // meta.poster = {
  //   name: null,
  //   phone: meta.receiverPhone
  // }
  return meta;
}

module.exports = {
  postcardFromMeta
};