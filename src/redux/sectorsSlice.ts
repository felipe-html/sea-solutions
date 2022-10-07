import { createSlice } from '@reduxjs/toolkit'
import { SectorProps } from '../components/SectionContainer'

export const counterSlice = createSlice({
    name: 'sectors',
    initialState: {
        sectors: [] as SectorProps[]
    },
    reducers: {
        increment: (state, { payload }) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.sectors.push(payload)
        },
        decrement: (state) => {
        },
        incrementByAmount: (state, action) => {
        },
    },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer