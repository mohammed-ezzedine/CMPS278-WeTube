import React, { useEffect, useState } from 'react';
import './SearchPage.css';
import VideoRow from '../../VideoRow/VideoRow';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {Helmet} from "react-helmet";

function SearchPage() {
  const [content, setContent] = useState({});
  let { searchTerm, page } = useParams();

  var query = `?q=${searchTerm}`;
  if (page) {
    query += `&p=${page}`;
  }

  useEffect(() => {
    fetch(`https://youtube278.azurewebsites.net/api/video/search${query}`)
      .then((response) => response.json())
      .then((result) => setContent(result))
      .catch((error) => console.log('error', error));
  }, [searchTerm, page]);

  var pages = [];
  for (var i = 1; i <= content.pagesCount; i++) {
    pages.push(i);
  }

  console.log(content);

  return (
    <div className="searchPage">
      <Helmet>
          <meta charSet="utf-8" />
          <title>WeTube - Search: {searchTerm}</title>
          <link rel="canonical" href="http://example.com" />
      </Helmet>
      <hr />
      {content.videos?.map((video) => {
        return (
          <VideoRow
            title={video.title}
            views={video.views.length}
            path={video.id}
            key={video.id}
            description={video.description}
            timestamp={video.uploadDate}
            channelImg={`https://youtube278.azurewebsites.net/api/channel/image-stream/${video.author.id}`}
            channel={video.author.name}
            image={`https://youtube278.azurewebsites.net/api/video/image-stream/${video.id}`}
          />
        );
      })}
      <hr />
      {pages.map((i) => (
        <Link className="pagination-link" to={`/search/${searchTerm}/${i}`}>
          {i}
        </Link>
      ))}
    </div>
  );
}

export default SearchPage;
