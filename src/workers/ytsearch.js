import ytdl from "ytdl-core";
import dotenv from "dotenv";

dotenv.config();

// Gratidão eterna para santo gtp por esses regexs

const youtubeSongRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|ytscreeningroom\?.+\bvi?=|embed\/|v\/|e\/|.+\?vi?=)([\w-]{11}))(?:[^\s]*)$/;
const youtubeMobileRegex =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?youtu\.be\/([^"&?/ ]{11})/gi;

const youtubePlaylistRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/(?:playlist\?|embed\/|v\/|watch\?v=|watch\?.+&v=|ytscreeningroom\?.+\bvi?=|embed\/|v\/|e\/|.+\?vi?=)([\w-]+))(?:[^\s]*)$/;

async function searchTracksByQuery(query, message) {
  const apikey = process.env.YOUTUBE_KEY;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&fields=items(id(videoId),snippet(title))&q=${encodeURIComponent(
    query
  )}&key=${apikey}`;

  let track;

  await fetch(searchUrl)
    .then((res) => res.json())
    .then(async (json) => {
      const videoId = json.items[0].id.videoId;
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apikey}&fields=items(contentDetails(duration))`;

      await fetch(url)
        .then((res) => res.json())
        .then((video) => {
          json.items[0].requestedBy = message.authorId
          json.items[0].duration = video.items[0].contentDetails.duration;
          track = json.items[0];

          console.log(
            `Title: ${json.items[0].snippet.title} id: ${json.items[0].id.videoId} duracao: ${json.items[0].duration}`
          );
        });

      console.log(`https://www.youtube.com/watch?v=${videoId}`);
      process.send({track, message, typeResquest: "track"});
    })
    .catch((err) => console.log(err));
}

async function searchTracksByURL(urlTrack, message, typeResquest) {
  let err = false
  let result = await ytdl.getBasicInfo(urlTrack).catch((error) => {
    console.log(error);
    err = true
    return err;
  });
  if(err){
    return
  }
  let track = {
    id: {
      videoId: "",
    },
    snippet: {
      title: "",
      author: ""
    },
    duration: "",
    requestedBy: message.authorId
  };

  track.snippet.title = result.videoDetails.title;
  track.id.videoId = result.videoDetails.videoId;
  track.duration = result.videoDetails.lengthSeconds;
  process.send({track, message, typeResquest});
}

async function fetchPlaylist(urlPlaylist, next = null, message) {
  const apikey = "AIzaSyCE7GMkU5DQWgNjx3YPw2bE_CjSJ-VjPDw";
  const regex = /list=([^&]+)/;
  const match = urlPlaylist.match(regex);
  const playlistId = match && match[1];

  let url = "";

  if (next) {
    url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&part=contentDetails&playlistId=${playlistId}&fields=items(contentDetails(videoId)),nextPageToken,prevPageToken,pageInfo&maxResults=25&pageToken=${next}`;
  } else {
    url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apikey}&part=contentDetails&playlistId=${playlistId}&fields=items(contentDetails(videoId)),nextPageToken,prevPageToken,pageInfo&maxResults=25`;
  }

  return await fetch(url)
    .then((res) => res.json())
    .then(async (json) => {
      if (json.error != undefined) {
        return 0;
      }
      json.items.forEach((element) => {
        searchTracksByURL(
          `https://www.youtube.com/watch?v=${element.contentDetails.videoId}`,
          message, "playlist"
        );
      });
      if (json.nextPageToken != undefined) {
        return json.nextPageToken;
      }
      return null;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getPlaylist(urlPlaylist, message) {
  let next = "";
  while (next != null) {
    next = await fetchPlaylist(urlPlaylist, next, message);
    if (next == 0) {
      return true;
    }
  }
}

process.on("message", async (data) => {
  const {query, message, args} = data
  if (youtubeSongRegex.test(args[0])) {
    console.log("url search");
    await searchTracksByURL(args[0], message, "track");
  } else if (youtubeMobileRegex.test(args[0])) {
    console.log("url search mobile");
    await searchTracksByURL(args[0], message, "track");
  } else if (youtubePlaylistRegex.test(args[0])) {
    await getPlaylist(args[0], message);
  } else {
    console.log("string search");
    await searchTracksByQuery(query, message);
  }
});
