import { useReducer } from 'react';
import { TripPlannerState, TripPlannerAction } from '../types/tripPlannerData';

function reducer(
  state: TripPlannerState,
  action: TripPlannerAction
): TripPlannerState {
  switch (action.type) {
    case 'ADD_DETAIL':
    // 加入新景點到指定日期
    case 'UPDATE_DETAIL':
    // 更新景點資訊
    case 'DELETE_DETAIL':
    // 從指定日期移除景點
    case 'MOVE_DETAIL':
    // 跨日移動景點
    default:
      return state;
  }
}

export function useTripPlanner(initialState: TripPlannerState) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
