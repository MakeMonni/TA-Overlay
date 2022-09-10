import React from 'react';
import ReactDOM from 'react-dom';
import './song.css'
import Song from './song'
import './scores.css';
import Scores from './scores';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
  
    <BrowserRouter>
      <Routes>
        
          <Route path="song" element={<Song />} />
          <Route path="scores" element={<Scores />} />
      </Routes>
    </BrowserRouter>)
}

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
