import { Avatar, Badge, Chip, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useStyles } from '../../Forms/Register/styles';
import BarChart from './BarChart';
import {Helmet} from "react-helmet";

function ChannelStats() {
    const currentUser = JSON.parse(window.localStorage.getItem("CurrentUser"));
    const [channel, setchannel] = useState(currentUser?.channel)
    const [stats, setstats] = useState(null)
    const classes = useStyles();

    const loadChannelAndStats = async() => {
        if (currentUser) {
            let response= await Axios.get(`https://youtube278.azurewebsites.net/api/Channel/${channel.id}`);
            setchannel(response.data);
            let {data} = await Axios.post(`https://youtube278.azurewebsites.net/api/channel/stats?id=${channel.id}`, {
                    "userId": currentUser.id,
                    "userSecret": currentUser.secret
            });
            setstats(data);
            
        }
    }
    

    useEffect(() => {
        loadChannelAndStats()
    }, [])

  if (currentUser == null) {
    return (
      <div>
        <h2>Channel Stats</h2>
        <h2>You are not logged in</h2>
      </div>
    )
  }    

  return (
        stats ? (<div className="channelInfo">
        <div className="channelInfo__interactive">
      <Helmet>
          <meta charSet="utf-8" />
          <title>WeTube - Channel Stats</title>
          <link rel="canonical" href="http://example.com" />
      </Helmet>
    <Avatar
      className="channelInfo__userAvatar" 
      src={`https://youtube278.azurewebsites.net/api/channel/image-stream/${channel.id}`}
    />
    <div className="channelInfo__interactiveInfo">
      <div className="channelInfo__interactiveInfoLeft">
        <h4>{channel.name}</h4>
        <h2>{channel.description}</h2>
        <p>{channel.subscribers?.length} subscribers</p>
      </div>
      
      <Grid container xs={12}>

        <Grid item style={{marginLeft: "200px"}} >
        <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Last Month Views</TableCell>
            <TableCell align="right">Total Views</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
              <TableCell align="right">{stats.lastMonthViews}</TableCell>
              <TableCell align="right">{stats.totalViews}</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
        </Grid>
      </Grid>      
      </div>
      
    </div>
    <BarChart stats={stats} />
    </div>) : (<> 
    <Grid container alignContent="center" justify="center" spacing={0} direction="column" style={{minHeight: '100vh'}}>
      <Grid item>
        <CircularProgress variant="indeterminate" />Loading
      </Grid>
    </Grid> </>  )

    )
}


export default ChannelStats
