
// đặt biến
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');


const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom:false,
    isRepeat:false,

    songs: [
        {
            name: 'đứa nào làm em buồn',
            singer: 'Phúc Du & Hoàng Dũng',
            path : './assets/music/song1.m4a',
            image: './assets/img/song1.png'
        },
        {
            name: 'Anh không thề gì đâu anh làm',
            singer: 'Phúc Du',
            path : './assets/music/song2.m4a',
            image: './assets/img/song2.png'
        },
        {
            name: 'J Cole nói',
            singer: 'Bray',
            path : './assets/music/song3.m4a',
            image: './assets/img/song3.png'
        },
        {
            name: 'U là trời',
            singer: 'Gill',
            path : './assets/music/song4.m4a',
            image: './assets/img/song4.png'
        },
        {
            name: 'Hoàn hảo',
            singer: 'Bray',
            path : './assets/music/song5.m4a',
            image: './assets/img/song5.png'
        },
        {
            name: 'Querry',
            singer: 'QNT, Trung Trần & MCK',
            path : './assets/music/song6.m4a',
            image: './assets/img/song6.png'
        }
    ],
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const cdWidth = cd.offsetWidth;

        // xử lí quay cd
        const cdAnimate = cdThumb.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations:Infinity
        })
        cdAnimate.pause();

        // Xử lí phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lí button play
        playBtn.onclick = function(){
            if (app.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }
        // play song
        audio.onplay = function(){
            app.isPlaying = true;
            player.classList.add('playing');
            cdAnimate.play();
        }
        // pause song
        audio.onpause = function(){
            app.isPlaying = false;
            player.classList.remove('playing');
            cdAnimate.pause();
        }
        // xử lí thanh chạy bài hát
        audio.ontimeupdate = function(){       
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent;
            }          
        }
        // seek song
        progress.oninput = function(e){
            const seekTime = audio.duration * e.target.value / 100 ;
            audio.currentTime = seekTime;
        }
        // next song
        nextBtn.onclick = function(){
            if (app.isRandom){
                app.randomSong();
            }else{
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        // prev song
        prevBtn.onclick = function(){
            if (app.isRandom){
                app.randomSong();
            }else{
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
            // nên remove không nên render trong trường hợp nhiều bài

        }
        // random song
        randomBtn.onclick = function(){
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active',app.isRandom);
            // nên dùng 1 mảng lưu id những bài đã hát để ko bị trùn lặp khi phát ngẫu nhiên
        }
        // when song end
        audio.onended = function(){
            if (app.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // repeat when song end
        repeatBtn.onclick = function(){
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle('active',app.isRepeat);
        }
        // click vào playlist
        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                //khi click vào song
                if (songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }

        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        let crrRandom;
        do{
            crrRandom = Math.floor(Math.random() * this.songs.length);
        } while (crrRandom === this.currentIndex);
        this.currentIndex = crrRandom;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'center'
            })
        }, 300);
    },  
    start: function(){
        // Địng nghĩa các thuộc tính cho object
        this.defineProperties();
        // Lắng nghe các sự kiện
        this.handleEvents();
        // Load bài hát đầu tiên vào UI
        this.loadCurrentSong();
        // Render playlist
        this.render();
    }
}

app.start();