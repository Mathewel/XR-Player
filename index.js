const container = document.querySelector(".container"),
    mainVideo = container.querySelector("video"),
    videoTimeline = container.querySelector(".video-timeline"),
    progressBar = container.querySelector(".progress-bar"),
    volumeBtn = container.querySelector(".volume i"),
    volumeSlider = container.querySelector(".left input"),
    currentVidTime = container.querySelector(".current-time"),
    videoDuration = container.querySelector(".video-duration"),
    skipBackward = container.querySelector(".skip-backward i"),
    skipForward = container.querySelector(".skip-forward i"),
    playPauseBtn = container.querySelector(".play-pause i"),
    speedBtn = container.querySelector(".playback-speed span"),
    speedOptions = container.querySelector(".speed-options"),
    picInPicBtn = container.querySelector(".pic-in-pic span"),
    fullscreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
    if (mainVideo.paused) return; // if video is paused return
    timer = setTimeout(() => { // remove show-controls class after 3 seconds
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls"); // add show-controls class on mousemove
    clearTimeout(timer); // clear timer 
    hideControls(); // calling hideControls
})
const formatTime = time => {
    // getting seconds, minutes, hours
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);
    // adding 0 at the beginning if the particular value is less than 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) { // if hours is 0 return minutes & seconds only else return all
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;

}
mainVideo.addEventListener("timeupdate", e => {
    let { currentTime, duration } = e.target; // getting current time & duration of the video
    let percent = (currentTime / duration) * 100;  // getting percentage of time
    progressBar.style.width = `${percent}%`; // passing percent as progress bar width
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", e => {
    videoDuration.innerText = formatTime(e.target.duration); //passing video duration as videoDuration innertext
});

videoTimeline.addEventListener("click", e => {
    let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currenTime
});

const draggableProgressBar = e => {
    let timelineWidth = videoTimeline.clientWidth; // getting videoTimeline width
    progressBar.style.width = `${e.offsetX}px`; // passing offsetx value as progressbar width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating video currenTime
    currentVidTime.innerText = formatTime(mainVideo.currentTime); // passing video current time as currentVidTime inner text
}

videoTimeline.addEventListener("mousedown", () => { // calling draggableprogress function on mousemove event
    videoTimeline.addEventListener("mousemove", draggableProgressBar);
});
container.addEventListener("mouseup", () => { // calling draggableprogress function on mousemove event
    videoTimeline.removeEventListener("mousemove", draggableProgressBar);
});

videoTimeline.addEventListener("mousemove", e => {
    const progressTime = videoTimeline.querySelector("span")
    let offsetX = e.offsetX; //getting mouseX position
    progressTime.style.left = `${offsetX}px`; // passing offsetX value as ProgreessTime left value
    let timelineWidth = videoTimeline.clientWidth // getting VideoTimeline width
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration // getting percent
    progressTime.innerText = formatTime(percent); // passing percent as Progress time Inner Text
})
volumeBtn.addEventListener("click", () => {
    if (!volumeBtn.classList.contains("fa-volume-high")) {
        mainVideo.volume = 0.5 // passing 0.5 as video volume
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    } else {
        mainVideo.volume = 0.0 // passing 0.0 as video volume, Video muted
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    volumeSlider = mainVideo.volume; // update slider value according to the vide volume 
});
volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value; //passing slide value as video volume
    if (e.target.value == 0) { // if slide value is 0, change the icon to mute icon
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    } else {
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")

    }
});

speedBtn.addEventListener("click", () => {
    speedOptions.classList.toggle("show"); // toggle show class
});
speedOptions.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () => { // adding click event on all speed option
        mainVideo.playbackRate = option.dataset.speed; // passing option dataset value as video playback value
        speedOptions.querySelector(".active").classList.remove("active"); //removing active class
        option.classList.add("active"); // adding active class on the selected option
    });
});
document.addEventListener("click", e => { // hide speed options on document click
    if (e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-outlined") {
        speedOptions.classList.remove("show");

    }
});

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture(); // changing video to picture in picture
});

fullscreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen"); // toggle fullscreen class
    if (document.fullscreenElement) { // if video is already in fullscreen mode
        fullscreenBtn.classList.replace("fa-compress", "fa-expand");
        return document.exitFullscreen(); // exit from fullscreen mode and return
    }
    fullscreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen(); // go to fullscreen mode
});
skipBackward.addEventListener("click", () => {
    mainVideo.currentTime -= 5; //subtracts 5 seconds from the current video time
});
skipForward.addEventListener("click", () => {
    mainVideo.currentTime += 5; //adds 5 seconds to the current video time
});

playPauseBtn.addEventListener("click", () => {
    // if video is paused, play the video else pause the video
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {
    playPauseBtn.classList.replace("fa-play", "fa-pause"); //if video is played, then change icon to pause
});
mainVideo.addEventListener("pause", () => {
    playPauseBtn.classList.replace("fa-pause", "fa-play"); // if video is paused, then change icon to play
});