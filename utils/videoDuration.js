import axios from "axios";
import moment from "moment";
import { getVideoDurationInSeconds } from "get-video-duration";
import fs from "fs";
import ExtractPdf from "pdf-extraction";

export function convertSecondsToDuration(seconds) {
  let videoDuration = {
    totalSeconds: seconds,
  };

  let durationInDecimal = seconds / 60;

  if (durationInDecimal > 60) {
    let durationInHrs = durationInDecimal / 60;
    let totalHrs = parseInt(durationInHrs);

    let durationInMins = (durationInHrs - totalHrs) * 60;
    let totalMins = parseInt(durationInMins);

    let totalSec = Math.floor((durationInMins - totalMins) * 60);

    videoDuration.inWords = `${totalHrs}:${totalMins}:${totalSec} hrs`;
  } else {
    let totalMins = parseInt(durationInDecimal);
    let totalSec = Math.floor((durationInDecimal - totalMins) * 60);

    videoDuration.inWords =
      totalMins > 0 ? `${totalMins}:${totalSec} Mins` : `${totalSec} Sec`;
  }
  return videoDuration;
}

export const youtubeDuration = async (youtubeId) => {
  try {
    const {
      data: { items },
    } = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${youtubeId}&part=contentDetails&key=${process.env.YOUTUBE_API_KEY}`
    );

    let sec = moment.duration(items[0].contentDetails.duration).asSeconds();
    return convertSecondsToDuration(sec);
  } catch (error) {
    console.log("error: Youtube video duration -", error.message);
  }
};

export const vimeoDuration = async (vimeoId) => {
  try {
    let {
      data: { duration },
    } = await axios.get(
      `https://api.vimeo.com/videos/${vimeoId}?fields=duration`,
      {
        headers: {
          authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
          "cache-control": "no-cache",
        },
      }
    );
    return convertSecondsToDuration(duration);
  } catch (error) {
    console.log("error: Vimeo video duration -", error.message);
  }
};

export const customVideoDuration = async (filePath) => {
  try {
    const duration = await getVideoDurationInSeconds(filePath);

    return convertSecondsToDuration(duration);
  } catch (error) {
    console.log("error: Custom video duration -", error.message);
  }
};

export const pdfReadDuration = async (filename) => {
  try {
    let dataBuffer = fs.readFileSync(
      `./public/uploads/topics/topic-assets/${filename}`
    );
    let { text } = await ExtractPdf(dataBuffer);
    let duration = (text.split(" ").length / 200) * 60;
    return convertSecondsToDuration(duration);
  } catch (error) {
    console.log(error);
  }
};

export const contentReadDuration = (content) => {
  content = content.replace(/(<([^>]+)>)/gi, "");
  let duration = (content.split(" ").length / 200) * 60;
  return convertSecondsToDuration(duration);
};
