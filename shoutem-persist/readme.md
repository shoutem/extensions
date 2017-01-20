# Shoutem persist

## Data persisting
Persisted data is stored on the device and it is available when you start application again.

Redux data is persisted by default when shoutem-persist is installed. If you do not 
want to persist data you have to handle `rehydrate` action specifically for the reducer.

Best way is to either implement `rehydrate` case in reducer or wrap you reducer with HOC
that will handle it for you. 

For example, you can use `preventStateRehydration` from `@shoutem/core`, to not restore
data from specific [combineReducer](http://redux.js.org/docs/api/combineReducers.html).

HOC (`preventStateRehydration`) definition
```javascript
export function preventStateRehydration(reducer) {
  // It is important that default state is the same as reducer you are wrapping
  return function (state = {}, action) {
    if (action.type === REHYDRATE) {
      // Prevent rehydration. New reference must be returned to prevent it.
      return { ...state };
    }
    return reducer(state, action);
  }
}
```

You can also use `rehydrate` action to format restored data [redux-persist](https://github.com/rt2zz/redux-persist). 

## RIO - Content caching - Data expiration (TODO - move to proper readme)
By default persisted data does not have expiration time, it is just stored on the device.

RIO enables you to add expiration time to the stored data and provides mechanism to validate data based 
on expiration time. You can use (RIO) `checkExpiration` action to invalidate `collection` or `one`. 
Using `shouldRefresh` will check expiration by default so you will know you have to reload your data even if
you didn't invalidate it first.

You can add expiration time to `collection` or `one` by adding `expirationTime` setting when creating new reference.

```
collection(SCHEMA, undefined, { expirationTime: 15 * 60 }) // 15 mins
one(SCHEMA, undefined, { expirationTime: 10 * 60 }) // 10 mins
```

Expiration time does not do anything with the persisted data itself, it just enables you to know if you data is still valid.

**Note:**
Our framework will check expiration every time app state changes (app becomes active).

### Expiration without RIO
If you have decided to develop custom reducers then you have to implement your own logic considering expiration time. 
