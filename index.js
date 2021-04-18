const fetch = require('node-fetch');
const {CHANNELS_URL, PLAYLIST_URL, VIDEO_URL, GOOGLE_API_KEY} = require("./config");

console.log('aaaaaa')
const getData = (playlisturl, pageToken) =>
    fetch(playlisturl + (pageToken ? `&pageToken=${pageToken}` : '')).then(response => response.json())

const getVideos = async (videos, listDetails) =>{
    await Promise.all(listDetails.items.map( async data =>{
        const video_id = data.snippet.resourceId.videoId;
        const videoDetails = await videoInfo(video_id);

        videos.push(videoDetails)
    }));
}


// channel details
const channelDetails = async () => {
    const channel_id = 'UCZU5ofyBsEmVuKYrijLFxrg'
    const url = `${CHANNELS_URL}id=${channel_id}&part=contentDetails,snippet,statistics&key=${GOOGLE_API_KEY}`
    const x = await getData(url);
    const content = {
    title: x.items[0].snippet.localized.title,
    uploads_id: x.items[0].contentDetails.relatedPlaylists.uploads,
    thumbnails: x.items[0].snippet.thumbnails,
    country: x.items[0].snippet.country,
    statistics: x.items[0].statistics
}
    console.log(content)

}


videos = [];
// videos list
const videosList = async (uploads_id ,videos) => {
    // const uploads_id = 'UU8butISFwT-Wl7EV0hUK0BQ'
    const url3 = `${PLAYLIST_URL}playlistId=${uploads_id}&part=snippet&maxResults=50&key=${GOOGLE_API_KEY}`
    let listDetails = await getData(url3);

    await getVideos(videos, listDetails);

    while (listDetails.nextPageToken) {
        listDetails = await getData(url3, listDetails.nextPageToken);
        await getVideos(videos, listDetails);
        console.log(videos.length)
    }


    console.log(url3)
    console.log(videos)
}



// video details
const videoInfo = async (video_id) => {
    const url2 = `${VIDEO_URL}part=snippet,statistics,contentDetails&id=${video_id}&key=${GOOGLE_API_KEY}`;
    const x = await getData(url2);
    return {
        title: x.items[0].snippet.title,
        video_id: video_id,
        thumbnails: x.items[0].snippet.thumbnails,
        statistics: x.items[0].statistics
    }
}



videosList('UU8butISFwT-Wl7EV0hUK0BQ', videos)

