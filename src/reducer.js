// a reducer function that will handle updates to our store
// the reducer takes in state and the current action and returns the state
export default function (state, action) {
  switch (action.type) {
    case 'USER_FETCH':
      return {
        user: null,
        loading: true
      }
    //when user is fetched correctly
    case 'USER_FULFILLED':
      return {
        user: action.payload,
        loading: false
      }
    default: return state;
  }
}