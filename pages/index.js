import React, { useState } from 'react'
import styles from '../styles/Home.module.css'

import { createSlice, configureStore } from '@reduxjs/toolkit';

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    // history: new Map(), // hashmaps can't be serialized properly, so we use objects instead 
    history: {}, // contains all of the previous calls
    expansions: [], // contains expansions for current call
    expansions_index: 0,
    query: "", // current query
  },
  reducers: {

    insertQuery: (state, action) => {
      state.query += action.payload;
    },
    popQuery: (state) => {
      state.query = state.query.slice(0, -1);
    },

    setExpansions: (state, action) => {
      state.expansions = action.payload;
    },

    setHistory: (state, action) => {
      // if the entry is not in the map, add it...
      if(!(state.query in state.history)){
        state.history[state.query]
        state.history = {
          ...state.history,
          [state.query] : action.payload,
        }
      }

    },

    doCycle: (state) => {
      state.expansions_index = ++ state.expansions_index % state.expansions.length;
    },
    resetCycle: (state) => {
      state.expansions_index = 0;
    }
  }
})

const { 
  insertQuery,
  popQuery, 
  setExpansions, 
  setHistory, 
  doCycle, 
  resetCycle,
 } = storeSlice.actions;

const store = configureStore({
  reducer: storeSlice.reducer
});

const thunkInsert = amount =>  {
  return async (dispatch, getState) => {
    // firstly insert the amount
    dispatch(insertQuery(amount));

    const state = getState();
    
    // get the updated query
    const query = state.query;

    // check if the query is in history hashmap
    if(state.query in state.history){
      dispatch(setExpansions(state.history[state.query]));
    }
    else {
      // fetch data from the server
      const res = await fetch(`/api/parse`, {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        // TODO: Dont forget to fix client-server naming missmatch
        body: JSON.stringify({ str: query }),
      });
      const data = await res.json();

      // put the query in the history hashmap
      dispatch(setHistory(data.expansions));
      dispatch(setExpansions(data.expansions));
    }
    // reset the index for cycles
    dispatch(resetCycle());
  }
}

const thunkPop = () => {
  return async (dispatch, getState) => {
    // firstly insert the amount
    dispatch(popQuery());

    const state = getState();
    // get the updated query
    const query = state.query;

    // check if the query is in history hashmap
    if(state.history[state.query])
      dispatch(setExpansions(state.history[state.query]));
    else
      dispatch(setExpansions([]));


    // reset the index for cycles
    dispatch(resetCycle());
  }
}

export default function Home({ obj }) {

  // combining Redux with Hooks for the sake of exercise
  const [str, setStr] = useState("")
  const [expansion, setExpansion] = useState([])
  
  // TODO: look into the subscribe function - it is being called way too often (probably for each element of the array??)
  store.subscribe(() => {
    //console.log('change!');
    setStr(store.getState().query);
    setExpansion((store.getState().expansions)[store.getState().expansions_index]);
  });

  // only used for the UI
  const buttons = [
    { type: 'cycle', heading: 'cycle', subheading: "" },
    { type: 'none', heading: '', subheading: "" },
    { type: 'delete', heading: 'delete', subheading: '' },
    { type: 'digit', heading: '1', subheading: "" },
    { type: 'digit', heading: '2', subheading: "abc" },
    { type: 'digit', heading: '3', subheading: "def" },
    { type: 'digit', heading: '4', subheading: "ghi" },
    { type: 'digit', heading: '5', subheading: "jkl" },
    { type: 'digit', heading: '6', subheading: "mno" },
    { type: 'digit', heading: '7', subheading: "pqrs" },
    { type: 'digit', heading: '8', subheading: "tuv" },
    { type: 'digit', heading: '9', subheading: "wxyz" },
    { type: 'digit', heading: '*', subheading: "" },
    { type: 'digit', heading: '0', subheading: "" },
    { type: 'digit', heading: '#', subheading: "" },
  ];

  return (
    /* device main */
    /* search for a smarter way to display multiple dynamic classes */
    <div className={`${styles.deviceContainer} ${styles.deviceMain} `}>

      {/* device screen numbers */}
      <div className={` ${styles.deviceScreen} ${styles.numbers} ${str.length > 0 ? null : styles.empty} `}> {str} </div>

      {/* device screen main */}
      <div className={` ${styles.deviceScreen} ${str.length > 0 ? null : styles.empty} `}> {expansion} </div>

      {/* device buttons */}
      <div className={`${styles.deviceContainer} ${styles.deviceButtons} `}>
        {buttons.map(btn => (
          <button key={btn.heading} className='button' onClick={() => {
            switch (btn.type) {
              case 'digit':
                // setStr(str + btn.heading) 
                store.dispatch(thunkInsert(btn.heading));
                break
              case 'delete':
                // setStr(str.substring(0, str.length - 1))
                store.dispatch(thunkPop());
                break
              case 'cycle':
                //cycle
                store.dispatch(doCycle());
                break
            }
          }}>
            {` ${btn.heading} `} <a> {btn.subheading} </a>
          </button>
        ))}
      </div>

    </div>
  )
}

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/test');
  const obj = await res.json();

  return {
    props: {
      obj
    },
  }
}