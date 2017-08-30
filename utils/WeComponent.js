
function create(config) {
  let randomString = '';
  let component = {};
  Object.assign(component.functions, config);
  Object.assign(component.data, config.data);
  delete component.data;
  return component;
}