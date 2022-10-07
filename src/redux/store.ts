import { configureStore } from '@reduxjs/toolkit'
import CounterReducer from './sectorsSlice'

export default configureStore({
    reducer: {
        counter: CounterReducer
    },
})