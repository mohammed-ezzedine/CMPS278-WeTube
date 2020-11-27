import React from 'react';
import './App.css';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import RecommendedVideos from './components/Pages/RecommendedVideos/RecommendedVideos';
import SearchPage from './components/Pages/SearchPage/SearchPage';
import SubscriptionPage from './components/Pages/SubscriptionPage/SubscriptionPage';
import HistoryPage from './components/Pages/HistoryPage/HistoryPage';
import WatchLaterPage from './components/Pages/WatchLaterPage/WatchLaterPage';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <Router>
        <Header />

        <Switch>
          <Route path="/trending">
            <Sidebar />
          </Route>
          <Route path="/playlists">
            <Sidebar />
          </Route>
          <Route path="/your-videos">
            <Sidebar />
          </Route>
          <Route path="/watch-later">
            <div className="app__page">
              <Sidebar />
              <WatchLaterPage />
            </div>
          </Route>
          <Route path="/history">
            <div className="app__page">
              <Sidebar />
              <HistoryPage />
            </div>
          </Route>
          <Route path="/subscriptions">
            <div className="app__page">
              <Sidebar />
              <SubscriptionPage />
            </div>
          </Route>
          <Route path="/search/:searchTerm">
            <div className="app__page">
              <Sidebar />
              <SearchPage />
            </div>
          </Route>
          <Route path="/">
            <div className="app__page">
              <Sidebar />
              <RecommendedVideos />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
