let card_holder = document.querySelector('.card__holder')
let currFolder;
let isMuted

let progressBar = document.querySelector('.progressBar')
let vol = document.querySelector('#volume')
let img = document.querySelector('.timeAndvol div img');
let playSong = document.querySelector('.playSong')
let previousSong = document.querySelector('.previousSong')
let nextSong = document.querySelector('.nextSong')
let currentSong = new Audio();
let songs;


let albumns = [];
async function fetchAlbumns() {
    let a = await fetch(`/songs/`)
    let response = await a.text()
    let createDiv = document.createElement('div')
    createDiv.innerHTML = response
    let anchors = createDiv.querySelectorAll('ul li a')
    anchors.forEach(anchor => {
        if (anchor.href.includes('/songs')) {
            let val = anchor.href.split('/songs/')[1]
            albumns.push(val)
        }
        // albumns.push(anchor.href.includes('/songs/'))
    })

    displayAlbumns(albumns)
    currFolder = albumns[0]
    console.log(currFolder);

    fetchSongs([albumns[0]]);

}

async function displayAlbumns(albumns) {
    try {
        // Function to fetch album data and return promise
        const fetchAlbumData = async (albumn) => {
            let response = await fetch(`/songs/${albumn}/info.json`);
            return await response.json();
        };

        // Array to hold promises for each album fetch operation
        const fetchPromises = albumns.map(async albumn => {
            let data = await fetchAlbumData(albumn);
            return `
                <div data-folder="${albumn}" class="card">
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15"
                            color="#000000" fill="#000">
                            <path
                                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="https://i.scdn.co/image/ab67616d00001e026404721c1943d5069f0805f3" alt="music banner">
                    <h3>${data.name}</h3>
                    <p>${data.description}</p>
                </div>
            `;
        });

        // Resolve all fetch promises
        const albumCards = await Promise.all(fetchPromises);

        // Append all HTML at once to improve performance
        card_holder.innerHTML = albumCards.join('');
        let cards = card_holder.querySelectorAll('.card');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove 'cardPlaying' class from all cards except the clicked one
                cards.forEach(otherCard => {
                    if (otherCard !== card) {
                        otherCard.classList.remove('cardPlaying');
                    }
                });

                // Toggle 'cardPlaying' class on the clicked card
                card.classList.toggle('cardPlaying');
                // console.log('Clicked on album:', card.getAttribute('data-folder'));
                currFolder = card.getAttribute('data-folder');
                fetchSongs(currFolder);
            });
        });


    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}







async function fetchSongs(el) {
    let a = await fetch(`/songs/${el}`)
    let response = await a.text()
    // console.log(response);

    let createDiv = document.createElement('div')
    createDiv.innerHTML = response
    let anchors = createDiv.querySelectorAll('ul li a')
    songs = []
    anchors.forEach(anchor => {
        if (anchor.href.endsWith('mp3')) {
            let val = anchor.href.split('/songs/')[1]
            songs.push(val.split('/')[1].replaceAll('%20', ' '));

        }
        // albumns.push(anchor.href.includes('/songs/'))
    })
    console.log(songs);
    displaySongs(songs);

}

function displaySongs(songs) {
    let songUL = document.querySelector('.songList ul')
    songUL.innerHTML = '';
    // Showing albums
    for (const song of songs) {
        songUL.innerHTML += `
        <li>
        <img class="invert" src="./img/music.svg" alt="">
            <div class="info" style='word-break: break-all;'>
                ${song.replaceAll('%20', ' ')}
            </div>
            <div class="playnow flex items-center">
                <p>Play Now</p>
                <img class="invert" src="./img/play.svg" alt="">
            </div>
        </li>
    `
    }


    document.querySelectorAll('.songList ul li').forEach((e) => {
        e.addEventListener('click', () => {
            document.querySelector('.left').style.left = '-5000%';
            playMusic(e.querySelector('.info').textContent.trim())
        })
    })
}

// Event Listener on the currentsong
currentSong.addEventListener('timeupdate', () => {
    // console.log(currentSong.duration, currentSong.currentTime);

    progressBar.max = currentSong.duration;
    progressBar.value = currentSong.currentTime

    document.querySelector('.duration').innerHTML = `${secondstoMinutes(currentSong.currentTime)} : ${secondstoMinutes(currentSong.duration)}`
    if (currentSong.currentTime === currentSong.duration) {
        playSong.src = playSong.src.replace('pause.svg', 'play.svg')
    }
})

// Updating track with user Interaction
progressBar.addEventListener('input', () => {
    currentSong.currentTime = progressBar.value
})

// Play button event listener
playSong.addEventListener('click', () => {
    if (currentSong.paused) {
        currentSong.play();
        playSong.src = playSong.src.replace('play.svg', 'pause.svg')
    } else {
        currentSong.pause();
        playSong.src = playSong.src.replace('pause.svg', 'play.svg')
    }

    // Checking whether music vol is 0 
    isMuted = currentSong.volume === 0 ? true : false
})

// volume event listener
vol.addEventListener('input', () => {
    currentSong.volume = vol.value / 100
    if (currentSong.volume === 0) {
        img.src = img.src.replace('volume.svg', 'mute.svg');
        console.log('0');

    }
})

img.addEventListener('click', () => {
    currentSong.volume = isMuted ? 0.5 : 0; // Set volume based on isMuted
    vol.value = currentSong.volume * 100; // Update volume slider

    // Update image source based on mute state
    img.src = isMuted ? img.src.replace('mute.svg', 'volume.svg') : img.src.replace('volume.svg', 'mute.svg');

    // Update isMuted state
    isMuted = !isMuted;
})



// Add Event listener to previous song
previousSong.addEventListener('click', () => {
    // let currentSong_Index = songs.indexOf((currentSong.src).split('/songs/')[1].replaceAll('%20', ' '));
    let currentSong_Index = ((currentSong.src).split(`/${currFolder}/`)[1].replaceAll('%20', ' '));
    let index = songs.indexOf(currentSong_Index);

    if ((index - 1) >= 0) {
        console.log(songs[index - 1]);
        playMusic(songs[index - 1])
    }
})

nextSong.addEventListener("click", () => {
    let currentSong_Index = ((currentSong.src).split(`/${currFolder}/`)[1].replaceAll('%20', ' '));
    let index = songs.indexOf(currentSong_Index);
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})

// nextSong.addEventListener('click', () => {
//     let currentSong_Index = songs.indexOf((currentSong.src).split('/songs/')[1].replaceAll('%20', ' '));
//     console.log(currentSong_Index);

//     if (currentSong_Index + 1 <= songs.length - 1) {
//         playMusic(songs[currentSong_Index + 1])
//     }
// })

const playMusic = (music) => {
    // console.log(music, currFolder);
    currentSong.src = `/songs/${currFolder}/${music}`
    playSong.src = playSong.src.replace('play.svg', 'pause.svg')
    document.querySelector('.songName').textContent = music
    currentSong.play()
    console.log(songs);
}

function main() {
    fetchAlbumns()
}

main()