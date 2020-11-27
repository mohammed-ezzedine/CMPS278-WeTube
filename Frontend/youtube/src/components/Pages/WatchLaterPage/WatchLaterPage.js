import React from 'react';
import VideoRow from '../../VideoRow/VideoRow';

import './WatchLaterPage.css';

function WatchLaterPage() {
  return (
    <div className="watchLater">
      <div className="watchLater__latest">
        <h2>Latest Video</h2>
        <img
          src="http://i3.ytimg.com/vi/HnKaaDcWOXw/maxresdefault.jpg"
          alt=""
        />
        <hr />
        <h3>Ben Awad</h3>
        <p>Why I don't like Machine Learning</p>
      </div>
      <div className="watchLater__videos">
        <VideoRow
          views="32M"
          description="In this video I discuss why I have no interested in machine learning. ---- If you like cooking, checkout my side project: ..."
          timestamp="1 year ago"
          channel="Ben Awad"
          title="Why I don't like Machine Learning"
          image="http://i3.ytimg.com/vi/HnKaaDcWOXw/maxresdefault.jpg"
        />
        <VideoRow
          views="32M"
          description="Cats are awesome, and super funny too! Who doesn't like cats and kittens? They make us laugh and happy! Just look how they ..."
          timestamp="4 years ago"
          channel="Tiger Productions"
          title="The funniest and most humorous cat videos ever! - Funny cat compilation"
          image="http://i3.ytimg.com/vi/gXuU8qgJcYo/maxresdefault.jpg"
        />
        <VideoRow
          views="32M"
          description="Cats are awesome, and super funny too! Who doesn't like cats and kittens? They make us laugh and happy! Just look how they ..."
          timestamp="4 years ago"
          channel="Tiger Productions"
          title="The funniest and most humorous cat videos ever! - Funny cat compilation"
          image="http://i3.ytimg.com/vi/VPVzx1ZOVuw/maxresdefault.jpg"
        />
        <VideoRow
          views="32M"
          description="Cats are awesome, and super funny too! Who doesn't like cats and kittens? They make us laugh and happy! Just look how they ..."
          timestamp="4 years ago"
          channel="Tiger Productions"
          title="The funniest and most humorous cat videos ever! - Funny cat compilation"
          image="http://i3.ytimg.com/vi/rhPSo4_Tgi0/maxresdefault.jpg"
        />
        <VideoRow
          views="32M"
          description="Cats are awesome, and super funny too! Who doesn't like cats and kittens? They make us laugh and happy! Just look how they ..."
          timestamp="4 years ago"
          channel="Tiger Productions"
          title="The funniest and most humorous cat videos ever! - Funny cat compilation"
          image="http://i3.ytimg.com/vi/NT299zIk2JY/maxresdefault.jpg"
        />
      </div>
    </div>
  );
}

export default WatchLaterPage;
