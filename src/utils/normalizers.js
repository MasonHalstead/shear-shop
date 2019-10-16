import uuid from 'uuid';
import moment from 'moment';
import momentDuration from 'moment-duration-format';

momentDuration(moment);

export function normalizeWithUUID(array) {
  return array.map(arr => ({
    ...arr,
    uuid: uuid.v1(),
  }));
}

export function normalizeDefinitions(data, filter) {
  return data
    .filter(definition => definition.is_archived === filter)
    .map(definition => normalizeDefinition(definition));
}

export function normalizeDefinition(data) {
  let location = data.location_name;

  if (!location) {
    location = `~ ${data.region_endpoint_hint}`;
  }
  return {
    ...data,
    location,
    timeout: moment.duration(data.timeout_seconds, 'seconds').format('hh:mm'),
    uuid: uuid.v1(),
  };
}

export function normalizeParameters(parameters) {
  return parameters.map(parameter => ({
    parameter_method_id: 1,
    modified: true,
    saved: true,
    uuid: uuid.v1(),
    ...parameter,
  }));
}
