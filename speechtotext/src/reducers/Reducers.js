import {ACTIONS} from '../actions/Actions';

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_PAUSE:
      // let newpaused = !state.paused;
      return {...state, paused: action.payload};
    case ACTIONS.SET_TERM:
      return {...state, Term: action.payload};
    case ACTIONS.SET_LOADING:
      return {...state, loading: action.payload};
    case ACTIONS.SET_CURRENT_INDEX:
      return {...state, currentIndex: action.payload};
    case ACTIONS.SET_VIDEO_LIST:
      return {...state, videoList: action.payload};
    case ACTIONS.SET_TIMER_TIME:
      if (action.payload !== null) return {...state, timerTime: action.payload};
      else if (state.timerTime + 1 >= 5) {
        return {...state, timerTime: 0};
      } else {
        return {...state, timerTime: state.timerTime + 1};
      }

    default:
      break;
  }
};
