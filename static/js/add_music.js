let playlist_id = document.querySelector('.id_playlist'), all_music, songName = [],
    addTrackBtn_for_playlist = document.querySelector('.add_tarck_for_playlist_btn'),
    xMark_btn = document.querySelector('.modal_window_for_add_playlist .fa-xmark'),
    modalWindowForAddMusic = document.querySelector('.modal_window_for_add_playlist')

if (playlist_id) {
    const playlist = {
        'id': `${playlist_id.innerHTML}`,
        'track_id': []
    }
    fetch('/get_playlist_song', {
        method: 'POST',
        body: JSON.stringify({
            'playlist_id': `${playlist_id.innerHTML}`
        }), headers: {
            'Content-type': 'application/json'
        }
    })
        .then(function (music) {
            return music.json()
        })
        .then(function (jsonResponse) {
            all_music = jsonResponse
            for (let track of all_music) {
                songName.push(track['name'].toLowerCase())
            }
        })

    addTrackBtn_for_playlist.addEventListener('click', () => {
        modalWindowForAddMusic.style.display = 'flex'
    })
    xMark_btn.addEventListener('click', () => {
        modalWindowForAddMusic.style.display = 'none'
    })

    let serachValue = document.getElementById('search_input'),
        btnSearch = document.querySelector('.fa-magnifying-glass')

    btnSearch.addEventListener('click', () => {
        searchTrack(serachValue.value)
    })
    let button = document.querySelector('.btn_for_add_music')
    button.addEventListener('click', () => {
        setTimeout(reloadFunc, 1000)
        fetch('/playlist_add_treck', {
            method: 'POST',
            body: JSON.stringify({
                'playlist': playlist
            }), headers: {
                'Content-type': 'application/json'
            }
        })
    })

    function reloadFunc() {
        location.reload()
    }

    function searchTrack(value) {
        if (value) {
            value.toLowerCase()
            let total = songName.indexOf(songName.find(song => song === value)),
                outputValue = document.querySelector('.search_result')
            if (total != -1) {
                let total_id = all_music[total]
                total_id = total_id['id']
                if (playlist['track_id'].indexOf(total_id) !== -1) {
                    outputValue.innerHTML = `
                    <div class="search_music_box">
                    <div class="track_info">
                        <img src="${all_music[total].photo}" alt="">
                            <div class="track_name">
                            <p>${all_music[total].name}</p>
                            <text>${all_music[total].author}</text>
                        </div>
                    </div>
                    <i class="fa-solid fa-xmark" id="delete_music_btn" onclick="deleteTrackFunc_forAddPlaylist()" 
                    style="opacity: 1;font-size: 50px;
                            width: 55px;
                            height: 55px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: black;
                            font-weight: 400;
                    "></i>
                </div>
                `
                } else {
                    outputValue.innerHTML = `<div class="search_music_box">
                    <div class="track_info">
                        <img src="${all_music[total].photo}" alt="">
                        <div class="track_name">
                            <p>${all_music[total].name}</p>
                            <text>${all_music[total].author}</text>
                        </div>
                    </div>
                    <i class="fa-solid fa-plus" id="add_music_btn" onclick="addTrackFunc_forAddPlaylist()" style="font-size: 50px; opacity: 1;"></i>
                </div>`
                }
            } else {
                outputValue.innerHTML = `<h1>No result</h1>`
            }
        }
    }

    function deleteTrackFunc_forAddPlaylist() {
        let name_song = document.querySelector('.search_music_box .track_name p'),
            check_name = all_music.find(name => name.name === name_song),
            forClear = document.querySelector('.search_result'),
            searchInput = document.getElementById('search_input')
        playlist['track_id'].splice(check_name.id, 1)
        forClear.innerHTML = ''
        searchInput.value = ''
    }

    function addTrackFunc_forAddPlaylist() {
        let name_song = document.querySelector('.search_music_box .track_name p'),
            check_name = all_music.find(name => name.name === name_song.innerHTML),
            forClear = document.querySelector('.search_result'),
            searchInput = document.getElementById('search_input')
        playlist['track_id'].push(check_name['id'])
        forClear.innerHTML = ''
        searchInput.value = ''
    }
}
