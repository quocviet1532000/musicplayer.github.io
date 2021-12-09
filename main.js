const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const volumesider = $('.volumesider');
const volumeBtn = $('.volumeBtn');
const volumeRange = $('.volume'); 
const volumeValue = $('.value');


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isMute: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
    {
      name: "Paris In The Rain",
      singer: "Lauv",
      path: "./assets/songs/song 1.mp3",
      image: "./assets/imgs/1.jpg"
    },
    {
      name: "See You Again",
      singer: "Charlie Puth & Wiz Khalifa",
      path: "./assets/songs/song 2.mp3",
      image: "./assets/imgs/2.jpg"
        
    },
    {
      name: "SomeThing Just Like This",
      singer: "The Chainsmokers",
      path: "./assets/songs/song 3.mp3",
      image: "./assets/imgs/3.jpg"
    },
    {
      name: "Muộn Rồi Mà Sao Còn",
      singer: "Sơn Tùng M-TP",
      path: "./assets/songs/song 4.mp3",
      image: "./assets/imgs/4.jpg"
    },
    {
      name: "Watting For Love",
      singer: "Avicii",
      path: "./assets/songs/song 5.mp3",
      image: "./assets/imgs/5.jpg"
    },
    {
      name: "Sugar",
      singer: "Marron 5",
      path: "./assets/songs/song 6.mp3",
      image: "./assets/imgs/6.jpg"
    },
    {
      name: "I Like Me Better",
      singer: "Lauv",
      path: "./assets/songs/song 7.mp3",
      image: "./assets/imgs/7.jpg"
    },
    {
      name: "Alone",
      singer: "Marshmello",
      path: "./assets/songs/song 8.mp3",
      image: "./assets/imgs/8.jpg"
    },
    {
      name: "Light It Up",
      singer: "Robin Hustin",
      path: "./assets/songs/song 9.mp3",
      image: "./assets/imgs/9.jpg"
    },
    {
      name: "Symphony",
      singer: "Clean Bandit",
      path: "./assets/songs/song 10.mp3",
      image: "./assets/imgs/10.jpg"
    }
  ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="icon-love far fa-heart"></i>
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>         
            `
        })

        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong' , {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents : function () {
        const cdWidth = cd.offsetWidth
        const _this = this

        //Xu li CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}

        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        //Xu li phong to / thu nho CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
      
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xu li khi click Playlist
        playBtn.onclick = function () {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }

        //Khi bai hat duoc play 
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi bai hat bi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        //Xu li khi tua bai hat
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            audio.play()
        }

        //Khi next bai hat
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

         //Khi prev bai hat
         prevBtn.onclick = function () {
             if (_this.isRandom) {
                 _this.playRandomSong()
             } else {
                 _this.prevSong()
             }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //Khi bat / tat random
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('.isRandom' , _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        //Xu li lap lai bai hat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('.isRepeat' , _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)    
        }

        //Xu li next bai hat khi ket thuc bai hat (audio ended)
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        //Lang nghe hanh vi Click vao Playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //Xu li click vao Song  
                if (songNode) {                  
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }

        //Xu li khi bat / tat volume
        volumeBtn.onclick = function(e){
            _this.isMute =! _this.isMute;
            _this.setVolume();
            _this.setConfig('isMute', _this.isMute);
        }

        //Xu li khi tang giam volume
        volumeRange.oninput = function(){
            volumeValue.textContent = volumeRange.value;
            audio.volume = volumeRange.value / 100;
            _this.setConfig('volumeValue', _this.volumeRange.value);
          }

    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRandom = this.config.isRepeat
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },  

    scrollToActiveSong: function () {
        setTimeout(() => {
          if (this.currentIndex <= 3) {
            $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'end',
            });
          } else {
            $('.song.active').scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
        }, 300);
      },


    setVolume: function(){
        if (this.isMute) {
        audio.muted = false;
        volumesider.classList.remove('active');
        } else {
        audio.muted = true;
        volumesider.classList.add('active');
    }
    },
    

    



    start: function () {
        //Gan cau hinh tu config vao ung dung
        this.loadConfig()

        //Dinh nghia cac thuoc tinh cho object
        this.defineProperties()

        //Lang nghe / xu li cac su kien (DOM Events)
        this.handleEvents()

        //Tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong()

        // Render Playlist
        this.render()

        //Hien thi trang thai ban dau cua button repeat & random
        // randomBtn.classList.toggle('active', this.isRandom)
        // repeatBtn.classList.toggle('active', this.isRepeat)  
        volumeBtn.classList.toggle('active', this.isMute);  
    }
}

app.start()
