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
import BarChart from './components/Pages/ChannelStats/BarChart';

function App() {
  const [auth, setAuth] = useContext(AuthContext);
  return (
    <div className="app">
      <Router>
        <Header />

        <Switch>
        <Route exact path="/channel/stats">
            <div className="app__page">
              <Sidebar />
              <ChannelStats />
            </div>
          </Route>
          <Route exact path="/channel/:id" component={ChannelInfoPage}>
            <div className="app__page">
              <Sidebar />
              <ChannelInfoPage />
            </div>
          </Route>
          <Route exact path="/video/:id/:playlistId?" component={VideoPlayerPage}>
            <div className="app__page">
              <Sidebar />
              <VideoPlayerPage />
            </div>
          </Route>
          <Route exact path="/trending">
            <div className="app__page">
              <Sidebar />
              <TrendingPage />
            </div>
          </Route>
          <Route exact path="/playlists">
            <div className="app__page">
              <Sidebar />
              <PlaylistPage />
            </div>
          </Route>
          <Route exact path="/your-videos">
            <div className="app__page">
              <Sidebar />
              <YourVideosPage />
            </div>
          </Route>
          <Route exact path="/watch-later">
            <div className="app__page">
              <Sidebar />
              <WatchLaterPage />
            </div>
          </Route>
          <Route exact path="/history">
            <div className="app__page">
              <Sidebar />
              <HistoryPage />
            </div>
          </Route>
          <Route exact path="/subscriptions">
            <div className="app__page">
              <Sidebar />
              <SubscriptionPage />
            </div>
          </Route>
          <Route exact path="/search/:searchTerm/:page?">
            <div className="app__page">
              <Sidebar />
              <SearchPage />
            </div>
          </Route>
          <Route exact path="/add-video">
            <div className="app__page">
              <Sidebar />
              <AddVideo />
            </div>
          </Route>
          <Route exact path="/register">
            <div className="app__page">
              <Sidebar />
              <RegisterForm />
            </div>
          </Route>
          <Route exact path="/login">
            <div className="app__page">
              <Sidebar />
              <LoginForm />
            </div>
          </Route>
          <Route exact path="/createChannel">
            <div className="app__page">
              <Sidebar />
              <CreateChannel />
            </div>
          </Route>
          <Route exact path="/editChannel">
            <div className="app__page">
              <Sidebar />
              <EditChannel />
            </div>
          </Route>
          <Route exact path="/home">
            <div className="app__page">
              <Sidebar />
              <RecommendedVideos />
            </div>
          </Route>
          <Route exact path="/">
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
