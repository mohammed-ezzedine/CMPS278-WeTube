import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {get} from 'axios';

function ChannelInfoPage() {

    const {id} = useParams();
    const [channel, setChannel] = useState({})

    useEffect(() => {
        
        fetch(`https://youtube278.azurewebsites.net/api/channel/${id}`)
        .then(response => response.json())
        .then(channelJSON => setChannel(channelJSON))
        .catch(error => console.error(error));
        
        
    }, [id])

    return (
        <div>
            {JSON.stringify(channel)}
        </div>
    )
}

export default ChannelInfoPage
