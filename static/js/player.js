let songListValue = document.querySelectorAll('.song_id_for_play'),
    songListId = [], songList = [], number = 0, musics = [], width = 0, handler = 0, valume = 1
fetch('/user_check')
    .then(function (music) {
        return music.json()
    })
    .then(function (jsonResponse) {
        musics = jsonResponse
        if (songListValue) {
            songListValue.forEach(song => {
                songListId.push(parseInt(song.innerHTML))
            })
            for (let song_id of songListId) {
                songList.push(musics.find(track => track['id'] === `${song_id}`))
            }
        }
    })

const playerName = document.querySelector('.player_name text'),
    playerImg = document.querySelector('.player_author img'),
    playerAuthor = document.querySelector('.player_name p'),
    shuffle = document.querySelector('.fa-shuffle'),
    prev = document.querySelector('.fa-backward-step'),
    playPause = document.querySelector('.fa-circle-play'),
    next = document.querySelector('.fa-forward-step'),
    repeat = document.querySelector('.fa-repeat'),
    timePlay = document.querySelector('.start_time'),
    timeEnd = document.querySelector('.end_time'),
    range = document.querySelector('.input_range input'),
    rangeColor = document.querySelector('.range'),
    valumeBtn = document.querySelector('.fa-volume-high'),
    valummeRange = document.querySelector('.volume_range input'),
    valumeRangeColor = document.querySelector('.rangeV'),
    liBtn = document.querySelectorAll('li'),
    likeBox = document.querySelector('.heart_player'),
    allHeart = document.querySelectorAll('li .heart')

let audio = document.querySelector('audio')
if (liBtn) {
    liBtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            playTarck(index)
        })
    })
}

function playTarck(index) {
    number = index
    chackShuffle()
    checkRepeat()
    let trackNow = songList[number]
    if (trackNow) {
        audio.src = trackNow['url']
        playerImg.src = trackNow['photo']
        playerAuthor.innerHTML = trackNow['author']
        playerName.innerHTML = trackNow['name']
        timeEnd.innerHTML = trackNow['duration']
        checkLike(trackNow['id'])
        width = 0
        range.value = 0
        audio.onloadedmetadata = function () {
            range.max = audio.duration
        }
        animatePlay(trackNow['id'])
        playPause.className = 'fa-regular fa-circle-pause primary'
        clearInterval(handler)
        audio = document.querySelector('audio')
        audio.play()
    } else {
        playPause.className = 'fa-regular fa-circle-play'
        audio = document.querySelector('audio')
        audio.pause()
        audio.currentTime = 0
    }
}

function checkLike(trackId) {
    trackId = parseInt(trackId)
    songListValue.forEach((songID, index) => {
        if (parseInt(songID.innerHTML) === trackId) {
            if (allHeart[index].innerHTML.indexOf('fa-solid') !== -1) {
                likeBox.innerHTML = `
                    <a href="/dislike_song/${trackId}"><i class="fa-solid fa-heart" style="margin-right: 10px;"></i></a>
                `
            } else {
                likeBox.innerHTML = `
                    <a href="/love_song/${trackId}"><i class="fa-regular fa-heart" style="margin-right: 10px;"></i></a>
                `
            }
        }
    })
}

function animatePlay(track_id) {
    let box = document.querySelectorAll('.box_loading'),
        bigBox = document.querySelectorAll('.box_loading_big'),
        songLi = document.querySelectorAll('.song_id_for_play')

    box.forEach((box, index) => {
        box.innerHTML = ''
        bigBox[index].style.background = 'transparent'
    })
    songLi.forEach((li, index) => {
        if (li.innerHTML === track_id) {
            bigBox[index].style.background = '#fff'
            box[index].innerHTML = `<div class="loading">
                    <div class="load"></div>
                    <div class="load"></div>
                    <div class="load"></div>
                    <div class="load"></div>
                </div>`
        }
    })
}

function rangeMath() {
    let minute = `${audio.currentTime / 60}`
    let sec = `${audio.currentTime % 60}`
    let mmm = minute.slice(0, minute.indexOf('.'))
    let sss = sec.slice(0, sec.indexOf('.'))
    if (sss.length === 1) sss = `0${sss}`
    if (audio.currentTime > 0.1) {
        timePlay.innerHTML = `${mmm}:${sss}`
        rangeColor.style.width = `${width}%`
        width = 10 / audio.duration + width
    }
    if (isNaN(width)) width = 0
}

function checkRepeat() {
    let checkI = document.querySelector('.fa-repeat')
    if (checkI) {
        if (checkI.className === 'fa-solid fa-repeat primary') {
            if (number > music.length - 1) {
                number = 0
            }
            if (number < 0) {
                number = music.length - 1
            }
        }
    }
}

function chackShuffle() {
    let shuffle = document.querySelector('.fa-shuffle')
    let numberCheck = number
    if (shuffle.className === 'fa-solid fa-shuffle primary') {
        number = Math.floor(Math.random() * songList.length);
        if (number === numberCheck) {
            number = 0
        }
    }
}

let checkPrev = 0
if (next) {
    next.addEventListener('click', () => {
        number++
        playTarck(number)
    })
    prev.addEventListener('click', () => {
        if (audio.currentTime > 5) {
            checkPrev++
            if (!(checkPrev > 0)) {
                number--
                checkPrev = -1
            }
        } else number--
        playTarck(number)
    })
}

audio.addEventListener('ended', () => {
    number++
    let checkI2 = document.querySelector('.fa-arrow-rotate-right')
    if (checkI2) number--
    width = 0
    playTarck(number)
})

playPause.addEventListener('click', () => {
    audio = document.querySelector('audio')
    if (playPause.className === 'fa-regular fa-circle-pause primary') {
        playPause.className = 'fa-regular fa-circle-play'
        audio.pause()
    } else {
        playPause.className = 'fa-regular fa-circle-pause primary'
        audio.play()
    }
})

repeat.addEventListener('click', () => {
    if (repeat.className === 'fa-solid fa-repeat') {
        repeat.classList.add('primary')
    } else if (repeat.className === 'fa-solid fa-repeat primary') {
        repeat.className = 'fa-solid fa-arrow-rotate-right primary'
    } else if (repeat.className === 'fa-solid fa-arrow-rotate-right primary') {
        repeat.className = 'fa-solid fa-repeat'
    }
})

shuffle.addEventListener('click', () => {
    if (shuffle.className === 'fa-solid fa-shuffle') {
        shuffle.classList.add('primary')
    } else if (shuffle.className === 'fa-solid fa-shuffle primary') {
        shuffle.classList.remove('primary')
    }
})

valumeBtn.addEventListener('click', () => {
    audio = document.querySelector('audio')
    if (valumeBtn.className === 'fa-solid fa-volume-high') {
        valumeBtn.className = 'fa-solid fa-volume-xmark'
        audio.volume = 0
    } else {
        valumeBtn.className = 'fa-solid fa-volume-high'
        audio.volume = valume
    }
})

audio.addEventListener('play', () => {
    handler = setInterval(rangeMath, 100)
    playPause.className = 'fa-regular fa-circle-pause primary'
    range.max = audio.duration
    let load = document.querySelectorAll('.load')
    load.forEach(load => {
        load.style.animationPlayState = 'running'
    })
})

audio.addEventListener('pause', () => {
    clearInterval(handler)
    let load = document.querySelectorAll('.load')
    load.forEach(load => {
        load.style.animationPlayState = 'paused'
    })
})

range.addEventListener('input', () => {
    audio.play()
    audio.currentTime = range.value
    width = (audio.currentTime * 100) / audio.duration
})

valummeRange.addEventListener('input', () => {
    audio = document.querySelector('audio')
    valumeRangeColor.style.width = `${valummeRange.value}px`
    audio.volume = valume = valummeRange.value / 120
})


