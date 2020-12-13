import React, { useEffect, useState } from "react";
import VideoRow from "../../VideoRow/VideoRow";
import { Link } from "react-router-dom";

import "./PlayerRecommendation.css";

function PlayerRecommendation({ recommendationLink, currentVideoId }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    if (recommendationLink !== undefined) {
      fetch(recommendationLink, requestOptions)
        .then((response) => response.json())

        .then((result) => {
          if (result.videos !== undefined) {
            setVideos(
              result.videos.filter((video) => {
                return video.id !== currentVideoId;
              })
            );
          } else {
            setVideos(result.filter(video => video.id !== currentVideoId));
          }
        })
        .catch((error) => console.log("error", error));
    }
  }, [recommendationLink, currentVideoId]);

  console.log(videos);
  return (
    <div className="playerRecommendation">
      {videos?.map((video) => {
        return (
          <VideoRow
            key={video.id}
            title={video.title}
            videoId={video.id}
            views={video.views?.length}
            description={video.description}
            timestamp={video.uploadDate.split("T")[0]}
            channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author?.id}`}
            channel={video.author}
            image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
            isShown={0}
          />
        );
      })}
    </div>
  );
}

export default PlayerRecommendation;
