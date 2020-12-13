import { FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { useStyles } from '../../Forms/Register/styles';

function BarChart({stats}) {
    const ByViews = (a , b) => a.views - b.views ;
    const classes = useStyles();
    let twoDayVids=stats.topVideosInTwoDays.sort(ByViews).slice(0,10)
    let AllTimeVids= stats.topVideosAllTime.sort(ByViews).slice(0,10)
    let twoDayLabels = twoDayVids.map(video=> video.title.slice(0,18))
    let AllTimeLabels = AllTimeVids.map(video=> video.title.slice(0,18))
    const [selectedRange, setselectedRange] = useState(0);
    const [labels, setlabels] = useState(AllTimeLabels)
    const [views, setviews] = useState(AllTimeVids.map(video => video.viewsCount))
    const [data, setdata] = useState({
        labels:labels,
        datasets:[
            {
                label: "Top 10 videos of all time",
                data: views
            }
        ],
        fillColor:['rgba(255, 21, 84, 0.5)','rgba(255, 173, 84, 0.5)','rgba(89, 173, 196, 0.5)','rgba(89, 173, 19, 0.5)','rgba(53, 76, 187, 0.6)','rgba(0, 0, 0, 0.6)','rgba(50, 32, 52, 0.6)','rgba(50, 32, 52, 0.6)', "rgba(50, 32, 52, 0.6)", "rgba(50, 32, 52, 0.6)"],
        strokeColor:['rgba(255, 21, 84, 0.5)','rgba(255, 173, 84, 0.5)','rgba(89, 173, 196, 0.5)','rgba(89, 173, 19, 0.5)','rgba(53, 76, 187, 0.6)','rgba(0, 0, 0, 0.6)','rgba(50, 32, 52, 0.6)','rgba(50, 32, 52, 0.6)', "rgba(50, 32, 52, 0.6)", "rgba(50, 32, 52, 0.6)"],
    })


    const handleDataChange = (event) => {
        console.log(event.target.value);
        setselectedRange(event.target.value)
        if (selectedRange) {
            setlabels(AllTimeLabels)
            setviews(AllTimeVids.map(video => video.viewsCount))
            setdata({
                labels:labels,
                datasets:[
                    {
                        label: "Top 10 videos of all time",
                        data: views
                    }
                ],
                fillColor:['rgba(255, 21, 84, 0.5)','rgba(255, 173, 84, 0.5)','rgba(89, 173, 196, 0.5)','rgba(89, 173, 19, 0.5)','rgba(53, 76, 187, 0.6)','rgba(0, 0, 0, 0.6)','rgba(50, 32, 52, 0.6)','rgba(50, 32, 52, 0.6)', "rgba(50, 32, 52, 0.6)", "rgba(50, 32, 52, 0.6)"],
                strokeColor:['rgba(255, 21, 84, 0.5)','rgba(255, 173, 84, 0.5)','rgba(89, 173, 196, 0.5)','rgba(89, 173, 19, 0.5)','rgba(53, 76, 187, 0.6)','rgba(0, 0, 0, 0.6)','rgba(50, 32, 52, 0.6)','rgba(50, 32, 52, 0.6)', "rgba(50, 32, 52, 0.6)", "rgba(50, 32, 52, 0.6)"],
            })
        }
        else{
            setlabels(twoDayLabels)
            setviews(twoDayVids.map(video => video.viewsCount))
            setdata({
                labels:labels,
                datasets:[
                    {
                        label: "Top 10 videos in the last 2 days",
                        data: views
                    }
                ],
                fillColor:['rgba(255, 21, 84, 0.5)','rgba(255, 173, 84, 0.5)','rgba(89, 173, 196, 0.5)','rgba(89, 173, 19, 0.5)','rgba(53, 76, 187, 0.6)','rgba(0, 0, 0, 0.6)','rgba(50, 32, 52, 0.6)','rgba(50, 32, 52, 0.6)', "rgba(50, 32, 52, 0.6)", "rgba(50, 32, 52, 0.6)"],
                strokeColor:['rgba(255, 21, 84, 0.5)','rgba(255, 173, 84, 0.5)','rgba(89, 173, 196, 0.5)','rgba(89, 173, 19, 0.5)','rgba(53, 76, 187, 0.6)','rgba(0, 0, 0, 0.6)','rgba(50, 32, 52, 0.6)','rgba(50, 32, 52, 0.6)', "rgba(50, 32, 52, 0.6)", "rgba(50, 32, 52, 0.6)"],
            })
        }
    }
    

    

    return (
        <Grid container xs={12}>

            <Grid item style={{float: "right"}}>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Time</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedRange}
                onChange={handleDataChange}
                >
                <MenuItem value={0}>All Time</MenuItem>
                <MenuItem value={1}>2 days</MenuItem>
                </Select>
            </FormControl>
            </Grid>

            <Bar data={data} />
        </Grid>
    )
}

export default BarChart
