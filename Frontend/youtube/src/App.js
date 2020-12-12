import React, { useContext, useState } from 'react';
import './App.css';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import RecommendedVideos from './components/Pages/RecommendedVideos/RecommendedVideos';
import SearchPage from './components/Pages/SearchPage/SearchPage';
import SubscriptionPage from './components/Pages/SubscriptionPage/SubscriptionPage';
import HistoryPage from './components/Pages/HistoryPage/HistoryPage';
import WatchLaterPage from './components/Pages/WatchLaterPage/WatchLaterPage';
import YourVideosPage from './components/Pages/YourVideosPage/YourVideosPage';
import TrendingPage from './components/Pages/TrendingPage/TrendingPage';
import PlaylistPage from './components/Pages/PlaylistPage/PlaylistPage';
import VideoPlayerPage from './components/Pages/VideoPlayerPage/VideoPlayerPage';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddVideo from './components/Pages/AddVideo/AddVideo';
import RegisterForm from './components/Forms/Register/RegisterForm';
import LoginForm from './components/Forms/Login/LoginForm';
import CreateChannel from './components/Forms/Channel/CreateChannel';
import { AuthContext } from './components/Auth/AuthContextProvider';
import EditChannel from './components/Forms/Channel/EditChannel';
import ChannelInfoPage from './components/Pages/ChannelInfoPage/ChannelInfoPage';
import ChannelStats from './components/Pages/ChannelStats/ChannelStats';

function App() {
  const [auth, setAuth] = useContext(AuthContext);
  return (
    <div className="app">
      <Router>
        <Header />

        <Switch>
        <Route path="/channel/:id/stats">
            <div className="app__page">
              <Sidebar />
              <ChannelStats />
            </div>
          </Route>
          <Route path="/channel/:id" component={ChannelInfoPage}>
            <div className="app__page">
              <Sidebar />
              <ChannelInfoPage />
            </div>
          </Route>
          <Route path="/video/:id/:playlistId?" component={VideoPlayerPage}>
            <div className="app__page">
              <Sidebar />
              <VideoPlayerPage />
            </div>
          </Route>
          <Route path="/trending">
            <div className="app__page">
              <Sidebar />
              <TrendingPage />
            </div>
          </Route>
          <Route path="/playlists">
            <div className="app__page">
              <Sidebar />
              <PlaylistPage />
            </div>
          </Route>
          <Route path="/your-videos">
            <div className="app__page">
              <Sidebar />
              <YourVideosPage />
            </div>
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
          <Route path="/search/:searchTerm/:page?">
            <div className="app__page">
              <Sidebar />
              <SearchPage />
            </div>
          </Route>
          <Route path="/add-video">
            <div className="app__page">
              <Sidebar />
              <AddVideo />
            </div>
          </Route>
          <Route path="/register">
            <div className="app__page">
              <Sidebar />
              <RegisterForm />
            </div>
          </Route>
          <Route path="/login">
            <div className="app__page">
              <Sidebar />
              <LoginForm />
            </div>
          </Route>
          <Route path="/createChannel">
            <div className="app__page">
              <Sidebar />
              <CreateChannel />
            </div>
          </Route>
          <Route path="/editChannel">
            <div className="app__page">
              <Sidebar />
              <EditChannel />
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
