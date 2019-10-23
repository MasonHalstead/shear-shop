import { setContainer } from 'ducks/actions';
import { getData } from 'utils/axios';
import { handleError } from './settings';

export const getContainer = job_id => async dispatch => {
  try {
    const res = await getData(`/jobs/${job_id}/containers/current`);
    await dispatch(setContainer(res.data));
    return res.data;
  } catch (err) {
    dispatch(handleError(err, job_id));

    throw err;
  }
};

export const getContainerStandardOut = container_id => async dispatch => {
  try {
    const res = await getData(`/containers/${container_id}/stdout_contents`);
    return res.data;
  } catch (err) {
    dispatch(handleError(err));

    throw err;
  }
};
