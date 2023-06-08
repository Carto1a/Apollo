import ytdl from "ytdl-core";
import dotenv from "dotenv";

dotenv.config();

const youtubeSongRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|ytscreeningroom\?.+\bvi?=|embed\/|v\/|e\/|.+\?vi?=)([\w-]{11}))(?:[^\s]*)$/;
const youtubeMobileRegex =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?youtu\.be\/([^"&?/ ]{11})/gi;

async function searchTracksByQuery(query) {
  const apikey = process.env.YOUTUBE_KEY;
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&fields=items(id(videoId),snippet(title))&q=${encodeURIComponent(
    query
  )}&key=${apikey}`;

  let track;

  await fetch(searchUrl, guildId)
    .then((res) => res.json())
    .then(async (json) => {
      const videoId = json.items[0].id.videoId;
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apikey}&fields=items(contentDetails(duration))`;

      await fetch(url)
        .then((res) => res.json())
        .then((video) => {
          json.items[0].duration = video.items[0].contentDetails.duration;
          track = json.items[0];

          console.log(
            `Title: ${json.items[0].snippet.title} id: ${json.items[0].id.videoId} duracao: ${json.items[0].duration}`
          );
        });

      console.log(`https://www.youtube.com/watch?v=${videoId}`);
      process.send([track, guildId]);
    })
    .catch((err) => console.log(err));
}

async function searchTracksByURL(urlTrack, guildId) {
  // const apikey    = process.env.YOUTUBE_KEY;
  // let track;
  // const idRegex = /([A-Za-z0-9]+(_[A-Za-z0-9]+)+)|(?:[=])([A-Za-z0-9]+\3)/g;

  // // const videoId = urlTrack.match(idRegex);
  // const videoId = urlTrack.replace(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)/, "");
  // const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apikey}&fields=items(contentDetails(duration))`;

  // await fetch(url)
  //   .then(res => res.json())
  //   .then(video => {
  //     json.items[0].snippet.title = video.items[0].snippet.title;
  //     json.items[0].id.videoId = video.items[0].id;
  //     json.items[0].duration = video.items[0].contentDetails.duration;
  //     track = json.items[0];

  //     console.log(`Title: ${json.items[0].snippet.title} id: ${json.items[0].id.videoId} duracao: ${json.items[0].duration}`);
  //   }).catch(err => console.log(err));

  //   console.log(`https://www.youtube.com/watch?v=${videoId}`);
  //   queue.push(track);

  let result = await ytdl.getBasicInfo(urlTrack);
  let track = {
    id: {
      videoId: "",
    },
    snippet: {
      title: "",
    },
    duration: "",
  };

  track.snippet.title = result.videoDetails.title;
  track.id.videoId = result.videoDetails.videoId;
  track.duration = result.videoDetails.lengthSeconds;

  process.send([track, guildId]);
}

process.on("message", async (query) => {
  if (youtubeSongRegex.test(query[0])) {
    console.log("url search");
    await searchTracksByURL(query[0], query[1]);
  } else if (youtubeMobileRegex.test(query[0])) {
    console.log("url search mobile");
    await searchTracksByURL(query[0], query[1]);
  } else {
    console.log("string search");
    await searchTracksByQuery(query[0], query[1]);
  }
});
