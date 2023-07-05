window.addEventListener('DOMContentLoaded', () => {
    const box = document.querySelector('.loader_box')
    if (box) {
        box.style.opacity = '0'
        box.innerHTML = ''
        box.style.zIndex = '-1'
    }
})
window.addEventListener('load', () => {
    const box = document.querySelector('.loader_box')
    if (box) {
        box.style.opacity = '0'
        box.innerHTML = ''
        box.style.zIndex = '-1'
    }
})

let music = [], allMusics = []

fetch('/user_check')
    .then(function (music) {
        return music.json()
    })
    .then(function (jsonResponse) {
        music = jsonResponse
        for (let obj of music) {
            allMusics.push(obj['name'].toLowerCase())
        }
    })

let userType = document.querySelectorAll('.input_log p'), userTypeInput = document.querySelector('.userTypeInput'),
    userTypeDiv = document.querySelector('.input_log'), logBtn = document.querySelectorAll('.log_window'),
    logWindow = document.querySelectorAll('.box_log')


if (userType) {
    userType.forEach((p, index) => {
        p.addEventListener('click', () => {
            if (index === 0) {
                userTypeDiv.style.background = `linear-gradient(270deg, rgba(255, 255, 255, 0) 48.11%, rgba(236, 32, 41, 0.35) 100%)`
                userTypeInput.value = false
                p.style.color = '#EC2029'
                userType[1].style.color = '#000'
            } else {
                userTypeDiv.style.background = `linear-gradient(90deg, rgba(255, 255, 255, 0) 48.11%, rgba(236, 32, 41, 0.35) 100%)`
                userTypeInput.value = '1'
                p.style.color = '#EC2029'
                userType[0].style.color = '#000'
            }
        })
    })
}
if (logBtn) {
    logBtn.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (index === 0) {
                logWindow[1].style.display = 'flex'
                logWindow[0].style.display = 'none'
            } else {
                logWindow[0].style.display = 'flex'
                logWindow[1].style.display = 'none'
            }
        })
    })
}

let userFuncLink = document.querySelectorAll('.function_link p'), userFuncWindow = document.querySelectorAll('.func'),
    dateNow = new Date().toJSON().slice(0, 10), addFuncWindow = document.querySelector('.add_func'),
    typeFunc = document.querySelectorAll('.album_or_playlist p'), backBtn, nextBtn, listValue = {
        'photo': '', 'img': '', 'name': '', 'date': '', 'bio': '', 'listMusic': [], 'photo_for': '', 'type_list': false
    }

let addTrack = document.querySelector('.absolute_btn_add_song'),
    addTrackWindow = document.querySelector('.add_track_window'),
    formAddTrack = document.querySelector('.add_track_window p')

const listAlbum = [`<div class="album_or_playlist">
                    <p>Playlist</p>
    </div>`, `<div class="add_inputs">
        <div class="add_input_box">
            Photo
            <input type="text" id="file_input_value">
        </div>
        <div class="add_input_box">
            Name
            <input type="text" id="name">
        </div>
        <div class="add_input_box">
            Date
            <input type="date" id="date">
        </div>
        <div class="btn_row">
            <div class="prev_btn">
                Back
            </div>
            <div class="next_btn add_list">
                Next
            </div>
        </div>
    </div>`, `<div class="add_tracks">
                                <div class="search_input">
                        <input type="search" placeholder="Search music..." id="search_input">
                        <i class="fa-solid fa-magnifying-glass" title="Search" id="search_btn"></i>
                    </div>
                    <div class="search_result">
                        
                    </div>
                    <div class="btn_row">
                        <div class="prev_btn">
                            Back
                        </div>
                        <div class="next_btn">
                            Next
                        </div>
                    </div>
                    </div>`, `<div class="result_creat">
        <div class="search_music_box">
            <div class="track_info">
                
            </div>
            <img src="" alt="" style="width: 80px;height: 80px;border-radius: 50%;" class="user_now_img">
        </div>
        <div class="list_tracks">
          
        </div>
        <div class="btn_row">
            <div class="prev_btn">
                Back
            </div>
            <div class="next_btn">
                <button style="width: inherit;height: inherit;background: transparent; color: inherit;font-size: inherit">Creat</button>
            </div>
        </div>
    </div>`],
    listPlaylist = [`<div class="album_or_playlist">
                <p>Playlist</p>
        </div>`, `<div class="add_inputs">
            <div class="add_input_box">
            Photo
            <input type="text" id="file_input_value">
        </div>
        <div class="add_input_box">
            Name
            <input type="text" id="name">
        </div>
        <div class="add_input_box">
            Bio
            <input type="text" id="bio">
        </div>
        <div class="btn_row">
            <div class="prev_btn">
                Back
            </div>
            <div class="next_btn add_list">
                Next
            </div>
        </div>
        </div>`, `<div class="add_tracks">
                                <div class="search_input">
                        <input type="search" placeholder="Search music..." id="search_input">
                        <i class="fa-solid fa-magnifying-glass" title="Search" id="search_btn"></i>
                    </div>
                    <div class="search_result">
                        
                    </div>
                    <div class="btn_row">
                        <div class="prev_btn">
                            Back
                        </div>
                        <div class="next_btn">
                            Next
                        </div>
                    </div>
                    </div>`, `<div class="result_creat">
            <div class="search_music_box">
                <div class="track_info">
                
                </div>
                <img class="user_now_img" src="" alt="" style="width: 80px;height: 80px;border-radius: 50%;">
            </div>
            <div class="list_tracks">          
                
            </div>
            <div class="btn_row">
                <div class="prev_btn">
                    Back
                </div>
                <div class="next_btn">
                    <button style="width: inherit;height: inherit;background: transparent; color: inherit;font-size: inherit">Creat</button>
                </div>
            </div>
        </div>`]

let checkArtist = document.querySelector('artist')

if (checkArtist) {
    listAlbum[0] = listPlaylist[0] = `<div class="album_or_playlist">
                <p>Album</p>
                <div class="absolute_btn_add_song">
                    Track
                </div>
                <p>Playlist</p>
        </div>`
}

if (addFuncWindow) {
    let number = 1, listF = 0, fileBtn = document.getElementById('photo')
    fileBtn.style.display = 'none'

    let btnPostImg = document.querySelector('.none_btn_post_img')

    function animateWindow(list, numberF) {
        if (!list) {
            list = listF
        }
        if (number === 1) fileBtn.style.display = 'flex'
        else fileBtn.style.display = 'none'
        addFuncWindow.innerHTML = list[numberF]
        listF = list
        typeFunc = document.querySelectorAll('.album_or_playlist p')
        addTrack = document.querySelector('.absolute_btn_add_song')
        addTrackWindow = document.querySelector('.add_track_window')
        formAddTrack = document.querySelector('.add_track_window p')
        backBtn = document.querySelector('.prev_btn')
        nextBtn = document.querySelector('.next_btn')
        pSelect()
        addInputValue()
        deleteTrack()
        if (number === 2) {
            searchMusicForAdd()
        }
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                number -= 1
                animateWindow(false, number)
            })

            nextBtn.addEventListener('click', () => {
                number += 1
                if (number === 4) {
                    nextBtn.style.userSelect = 'none'
                    fetchCheck()
                    number = 3
                }
                animateWindow(false, number)
            })
        }
    }

    function fetchCheck() {
        fetch('/user_add', {
            method: 'POST',
            body: JSON.stringify({
                'listValue': listValue
            }), headers: {
                'Content-type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json()
            })
            .then(function (log) {
                if (log) location.reload()

            })
    }

    function lestFetch() {
        let fileForList = document.getElementById('photo').files[0]
        const data = new FormData()
        data.append('file', fileForList)
        data.append('filename', fileForList.name)
        fetch('/add_photo', {
            method: 'POST',
            body: data
        })
    }

    function dataValue() {
        let dateInput = document.querySelector('input[type="date"]')
        if (dateInput) {
            dateInput.value = dateNow
        }
    }

    function addInputValue() {
        let name = document.getElementById('name'), date = document.getElementById('date'),
            bio = document.getElementById('bio'), nameInputFile = document.getElementById('file_input_value')
        dataValue()
        if (nameInputFile) {
            if (listValue['img']) {
                nameInputFile.value = listValue['img']
                name.value = listValue['name']
                if (date) {
                    date.value = listValue['date']
                } else bio.value = listValue['bio']
            } else {
                fileBtn.addEventListener("change", () => {
                    let fileForList = document.getElementById('photo').files[0]
                    lestFetch()
                    listValue['img'] = fileForList.name
                    nameInputFile.value = fileForList.name
                })
            }
        }
        let add_listBtn = document.querySelector('.add_list')
        if (add_listBtn) {
            add_listBtn.addEventListener('click', () => {
                if (!name.value || !listValue['img']) {
                    number = 0
                    alert('Fill all correct !')
                } else {
                    if (name) {
                        const reader = new FileReader()

                        let file = document.getElementById('photo').files[0]
                        reader.onload = async (event) => {
                            listValue['photo'] = event.target.result
                        }
                        reader.readAsDataURL(file)
                        if (date) {
                            listValue['name'] = name.value
                            listValue['date'] = date.value
                        } else {
                            listValue['name'] = name.value
                            listValue['date'] = dateNow
                            listValue['bio'] = bio.value
                        }
                    }
                }
            })
        }
    }

    function searchMusicForAdd() {

        if (listValue['listMusic'].length <= 0 && number === 3) {
            number = 1
            alert('Please add music !')
        }

        let searchInput = document.getElementById('search_input'),
            searchBtn = document.getElementById('search_btn'),
            searchRusult = document.querySelector('.search_result'), total

        searchBtn.addEventListener('click', () => {
            let lowerValue = searchInput.value
            if (listValue['bio']) {
                total = allMusics.indexOf(lowerValue.toLowerCase())
            } else {
                total = allMusics.indexOf(lowerValue.toLowerCase())
            }
            if (total !== -1) {
                let total_id = music[total]
                total_id = total_id['id']
                if (listValue['listMusic'].indexOf(total_id) !== -1) {
                    searchRusult.innerHTML = `<div class="search_music_box">
                <div class="track_info">
                    <img src="${music[total].photo}" alt="">
                        <div class="track_name">
                        <p>${music[total].name}</p>
                        <text>${music[total].author}</text>
                    </div>
                </div>
                <i class="fa-solid fa-xmark" id="delete_music_btn" onclick="deleteTrackFunc()" style="font-size: 50px"></i>
            </div>`
                } else {
                    searchRusult.innerHTML = `<div class="search_music_box">
                <div class="track_info">
                    <img src="${music[total].photo}" alt="">
                    <div class="track_name">
                        <p>${music[total].name}</p>
                        <text>${music[total].author}</text>
                    </div>
                </div>
                <i class="fa-solid fa-plus" id="add_music_btn" onclick="addTrackFunc()" style="font-size: 50px"></i>
            </div>`
                }
            } else {
                searchRusult.innerHTML = '<h2>No result</h2>'
            }
        })
    }

    function addTrackFunc() {
        let musicId = document.querySelector('.track_name p'),
            musicIdAuthor = document.querySelector('.track_name text'),
            forClear = document.querySelector('.search_result'), idMusicForAdd,
            searchInput = document.getElementById('search_input')

        idMusicForAdd = music.find(track => track.name === musicId.innerHTML)
        //  && track.author === musicIdAuthor.innerHTML
        listValue['listMusic'].push(idMusicForAdd.id)
        forClear.innerHTML = ''
        searchInput.value = ''
    }

    function deleteTrackFunc() {
        let musicId = document.querySelector('.track_name p'), forClear = document.querySelector('.search_result'),
            idMusicForAdd, index, searchInput = document.getElementById('search_input')

        idMusicForAdd = music.find(track => track.name === musicId.innerHTML)
        index = listValue['listMusic'].indexOf(idMusicForAdd.id)
        listValue['listMusic'].splice(index, 1)
        forClear.innerHTML = ''
        searchInput.value = ''
    }


    function delete_track(index) {
        index = listValue['listMusic'].indexOf(index)
        listValue['listMusic'].splice(index, 1)
        deleteTrack()
    }

    function deleteTrack() {
        let trackInfo = document.querySelector('.track_info'),
            listTracksHtml = document.querySelector('.list_tracks')

        if (trackInfo && listTracksHtml) {
            let user_now_img = document.querySelector('.user_now_img'),
                user_now_img_real = document.querySelector('.user_now img')

            user_now_img.src = user_now_img_real.src

            trackInfo.innerHTML = `
        <img src="${listValue['photo']}" alt="">
        <div class="track_name">
            <p>${listValue['name']}</p>
            <text>${listValue['date']} <text style="font-size: 36px; color: black">•</text>  ${listValue['listMusic'].length} tracks </text>
        </div>`
            listTracksHtml.innerHTML = ''
            for (let index of listValue['listMusic']) {
                let find = music.find(track => track.id === index)
                listTracksHtml.innerHTML += `
            <div class="track_info_small">
                <div class="list_track_name_small">
                    <img src="${find.photo}" alt="">
                    <div class="list_track_name">
                        <p>${find.name}</p>
                        <text style="font-size: 20px">${find.author}</text>
                    </div>
                </div>
                <i class="fa-solid fa-xmark" onclick="delete_track(${index})"></i>
            </div>`
            }
        }
    }

    userFuncLink.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            userFuncWindow.forEach(w => {
                w.style.display = 'none'
            })
            userFuncWindow[index].style.display = 'flex'
            userFuncLink.forEach(p => {
                p.classList.remove('function_link_p')
            })
            btn.classList.add('function_link_p')
        })
    })

    function pSelect() {
        typeFunc.forEach(p => {
            p.addEventListener('click', () => {
                number = 1
                if (p.innerHTML === 'Album') {
                    animateWindow(listAlbum, number)
                    dataValue()
                    listValue['type_list'] = true
                } else if (p.innerHTML === 'Playlist') {
                    animateWindow(listPlaylist, number)
                    listValue['type_list'] = false
                }
            })
        })
        if (addTrack) {
            addTrack.addEventListener('click', () => {
                addTrackWindow.style.display = 'flex'
            })
            formAddTrack.addEventListener('click', () => {
                addTrackWindow.style.display = 'none'
            })
        }
    }

    let inputGeneral = document.getElementById('general_photo'),
        inputNameGeneral = document.getElementById('general_photo_name')
    inputGeneral.addEventListener("change", () => {
        let fileForList = document.getElementById('general_photo').files[0]
        listValue['img'] = fileForList.name
        inputNameGeneral.value = fileForList.name
    })

    pSelect()

    let addTrackInput = document.querySelector('.add_track_input'),
        addTrackInputFile = document.getElementById('add_track')
    addTrackInputFile.addEventListener('change', () => {
        let input = document.getElementById('add_track').files[0]
        addTrackInput.value = input.name
    })

    let addTrackPhoto = document.querySelector('.add_track_input_photo'),
        addTrackPhotoName = document.getElementById('add_track_photo')
    addTrackPhotoName.addEventListener('change', () => {
        let input = document.getElementById('add_track_photo').files[0]
        addTrackPhoto.value = input.name
    })

    let f_duration = 0;
    document.getElementById('audio').addEventListener('canplaythrough', function (e) {
        f_duration = Math.round(e.currentTarget.duration)
        let f_duration_m = `${f_duration / 60}`
        let f_duration_s = f_duration % 60
        if (f_duration_s < 10) f_duration_s = `${f_duration_s}0`
        let mmm = f_duration_m.slice(0, f_duration_m.indexOf('.'))
        f_duration = `${mmm}:${f_duration_s}`
        document.getElementById('f_du').value = f_duration;
        URL.revokeObjectURL(obUrl)
    })

    let obUrl;
    document.getElementById('add_track').addEventListener('change', function (e) {
        let file = e.currentTarget.files[0];
        if (file.name.match(/\.(mp3)$/i)) {
            obUrl = URL.createObjectURL(file);
            document.getElementById('audio').setAttribute('src', obUrl);
        }
    })
}

let navbar = document.querySelector('.header_nav'), scrollBar = document.querySelector('.header_info')

if (navbar) {
    scrollBar.onscroll = function () {
        scrollNavbar()
    }
}

function scrollNavbar() {
    if (scrollBar.scrollTop > 300 || scrollBar.scrollTop > 300) {
        document.querySelector('.header_nav').style.opacity = '100%';
    } else if (scrollBar.scrollTop < 300 || scrollBar.scrollTop < 300) {
        document.querySelector('.header_nav').style.opacity = '0';
    }
}

let musicNumber = document.querySelectorAll('.music_number p')
if (musicNumber) {
    musicNumber.forEach((number, index) => {
        number.innerHTML = `${index + 1}`
    })
}

let addSongDiv = document.querySelectorAll('.add_song_div')

if (addSongDiv) {
    addSongDiv.forEach(box => {
        if (box.innerHTML.indexOf('a') === -1) {
            box.innerHTML = `<a href="/user" style="border: none">Add Playlist</a>`
            box.style.height = '50px'
        }
    })
}
