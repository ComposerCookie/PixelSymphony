// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    var currentTime = Date.now();

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    var INSTRUMENTS = {
        SYMPHONY_CLASSIC: "classic"
    };

    var NOTES = {
        C1: 0,
        CS1: 1,
        D1: 2,
        DS1: 3,
        E1: 4,
        F1: 5,
        FS1: 6,
        G1: 7,
        GS1: 8,
        A1: 9,
        AS1: 10,
        B1: 11,
        C2: 12,
        CS2: 13,
        D2: 14,
        DS2: 15,
        E2: 16,
        F2: 17,
        FS2: 18,
        G2: 19,
        GS2: 20,
        A2: 21,
        AS2: 22,
        B2: 23,
        C3: 24
    };

    var DURATIONS = {
        FULL: 1,
        HALF: 2,
        QUARTER: 4,
        EIGHTH: 8,
        SIXTEENTH: 16
    };

    function Note(key, octave, duration) {
        this.key = key;
        this.octave = octave;
        this.duration = durration;
    };

    function Song() {
        this.name = "";
        this.instrumentCount = 0;
        this.block = [];
        this.tempo = 250;
    };

    var Profile = {
        name: "Player1",
        currentSong: -1,
        currentStage: 3,
        currentWall: 1,
        currentFloor: 0,
        currentCurtain: 2,
        notes: 0,
        unlockedCharacter: [0, 1, 2 , 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
        unlockedScene: [0, 1, 2, 3],
        unlockedSong: [],
        team: [2, 9, 0, 1, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14]
    };

    var Shop = {
        characterShop: [new Character("Ibrahim Lancoln", "AbrahamLincoln", 0, 50), // 0
                        new Character("Borack Obarma", "BarackObama", 0, 50), // 1
                        new Character("Conductor", "Conductor", 1, 50), // 2
                        new Character("Deft Pank", "DaftPunk", 0, 50), // 3
                        new Character("Fraddie Marcary", "FreddieMercury", 0, 50), // 4
                        new Character("Jacqueline", "Jacqueline", 0, 50), // 5
                        new Character("Jeremy Rossman", "JeremyRossman", 0, 50), // 6
                        new Character("Meralyn Manroe", "MarilynMonroe", 0, 50), // 7
                        new Character("Mikheal Jockson", "MichaelJackson", 0, 50), // 8
                        new Character("Mr. Rafaree", "MrReferee", 0, 50), // 9
                        new Character("Spack", "Spock", 0, 50), // 10
                        new Character("Stonlay Kutebrick", "StanleyKubrick", 0, 50), // 11
                        new Character("Vac Fintaine", "VicFontaine", 0, 50), // 12
                        new Character("Vlodimeer Pudtin", "VladimirPutin", 0, 50), // 13
                        new Character("Rad Ronger", "RedRanger", 0, 50)], // 14

        sceneShop: [new Scenary("Wooden Floor", "floor1", 0, 50),
                    new Scenary("Wooden Wall", "wall1", 1, 50),
                    new Scenary("Red Curtain", "curtain1", 2, 50),
                    new Scenary("Wooden Stage", "stage1", 2, 50)],

        songShop: []
    };

    function Scenary(name, sprite, type, cost) {
        this.name = name;
        this.sprite = sprite;
        this.type = type;
        this.cost = cost;
    }

    function Character(name, sprite, type, cost) {
        this.name = name;
        this.sprite = sprite;
        this.type = type;
        this.cost = cost;
    }

    var menuState = {
        selectingSong: -2,

        preload: function () {
            this.load.image('btnShopBuy', 'images/gfx/guis/btnShopBuy.png');
            this.load.image('btnShopCancel', 'images/gfx/guis/btnShopCancel.png');
            this.load.image('btnShopChar_n', 'images/gfx/guis/btnShopChar_n.png');
            this.load.image('btnShopChar_p', 'images/gfx/guis/btnShopChar_p.png');
            this.load.image('btnShopSong_n', 'images/gfx/guis/btnShopSong_n.png');
            this.load.image('btnShopSong_p', 'images/gfx/guis/btnShopSong_p.png');
            this.load.image('btnShopStage_n', 'images/gfx/guis/btnShopStage_n.png');
            this.load.image('btnShopStage_p', 'images/gfx/guis/btnShopStage_p.png');
            this.load.image('btnStats_n', 'images/gfx/guis/btnStats_n.png');
            this.load.image('btnStats_p', 'images/gfx/guis/btnStats_p.png');
            this.load.image('btnStore_n', 'images/gfx/guis/btnStore_n.png');
            this.load.image('btnStore_p', 'images/gfx/guis/btnStore_p.png');
            this.load.image('shopChar', 'images/gfx/guis/shopChar.png');
            this.load.image('shopOverlay', 'images/gfx/guis/shopOverlay.png');
            this.load.image('btnExit', 'images/gfx/guis/btnExit.png');
            this.load.image('btnPerform_n', 'images/gfx/guis/btnPerform_n.png');
            this.load.image('btnPerform_p', 'images/gfx/guis/btnPerform_p.png');
            this.load.image('pickerWall', 'images/gfx/guis/pickerWall.png');
            this.load.image('songBar', 'images/gfx/guis/songBar.png');
            this.load.image('songBarSelect', 'images/gfx/guis/songBarSelect.png');

        },

        create: function () {
            this.songList = this.add.group();
            this.store = this.add.group();
            this.statsPage = this.add.group();
            this.store.charShop = this.add.group();
            this.store.sceneShop = this.add.group();
            this.store.songShop = this.add.group();
            this.store.add(this.store.charShop);
            this.store.add(this.store.sceneShop);
            this.store.add(this.store.songShop);

            this.btnPerform = this.add.button(0, 0, "btnPerform_p", this.btnPerform_pressed, this);
            this.btnStore = this.add.button(0, 21, "btnStore_n", this.btnStore_pressed, this);
            this.btnStats = this.add.button(0, 42, "btnStats_n", this.btnStats_pressed, this);
            this.btnExit = this.add.button(0, 138, "btnExit", this.btnExit_pressed, this);
            this.pickerWall = this.add.sprite(63, 0, "pickerWall");

            this.songList.list = [];
            for (var i = -1; i < 1; i++) {
                this.songList.list.push(this.add.button(65, 31 * (i + 1), "songBar", this.songSelected.bind(this, i), this));
                this.songList.list[i + 1].songIndex = i;
                this.songList.add(this.songList.list[i + 1]);
            }

            this.songList.songBarSelect = this.add.sprite(65, 0, "songBarSelect");
            this.songList.songBarSelect.visible = false;
            this.songList.selectBackground = this.add.sprite(65, 148, "shopOverlay");
            this.songList.btnConfirm = this.add.button(251, 149, "btnShopBuy", this.btnConfirm_pressed, this);
            this.songList.btnConfirm.visible = false;
            this.songList.btnCancel = this.add.button(262, 149, "btnShopCancel", this.btnCancel_pressed, this);
            this.songList.btnCancel.visible = false;
            this.songList.add(this.songList.songBarSelect);
            this.songList.add(this.songList.selectBackground);
            this.songList.add(this.songList.btnConfirm);
            this.songList.add(this.songList.btnCancel);

            this.store.btnShopChar = this.add.button(194, 142, "btnShopChar_p", this.btnShopChar_pressed, this);
            this.store.btnShopStage = this.add.button(222, 147, "btnShopStage_n", this.btnShopStage_pressed, this);
            this.store.btnShopSong = this.add.button(250, 147, "btnShopSong_n", this.btnShopSong_pressed, this);
            this.store.add(this.store.btnShopChar);
            this.store.add(this.store.btnShopStage);
            this.store.add(this.store.btnShopSong);

            this.store.charShop.background = this.add.sprite(63, 0, "shopChar");
            this.store.charShop.add(this.store.charShop.background);

            this.store.charShop.visible = true;
            this.store.sceneShop.visible = false;
            this.store.songShop.visible = false;

            this.songList.visible = true;
            this.store.visible = false;
            this.statsPage.visible = false;
        },

        songSelected: function (index) {
            this.selectingSong = index;
            this.songList.songBarSelect.y = 31 * (index + 1);
            this.songList.songBarSelect.visible = true;

            this.songList.selectBackground.visible = true;
            this.songList.btnConfirm.visible = true;
            this.songList.btnCancel.visible = true;
        },

        btnConfirm_pressed: function(){
            if (this.selectingSong > -2) {
                game.state.start("InGame");
                inGameState.initializeLevel(this.selectingSong);
            }
        },

        btnCancel_pressed: function(){
            this.songList.selectBackground.visible = false;
            this.songList.btnConfirm.visible = false;
            this.songList.btnCancel.visible = false;
        },

        btnShopChar_pressed: function(){
            this.store.btnShopChar.loadTexture("btnShopChar_p");
            this.store.btnShopStage.loadTexture("btnShopStage_n");
            this.store.btnShopSong.loadTexture("btnShopSong_n");

            this.store.btnShopChar.y = 142;
            this.store.btnShopStage.y = 147;
            this.store.btnShopSong.y = 147;

            this.store.charShop.visible = true;
            this.store.sceneShop.visible = false;
            this.store.songShop.visible = false;
        },

        btnShopStage_pressed: function(){
            this.store.btnShopChar.loadTexture("btnShopChar_n");
            this.store.btnShopStage.loadTexture("btnShopStage_p");
            this.store.btnShopSong.loadTexture("btnShopSong_n");

            this.store.btnShopChar.y = 147;
            this.store.btnShopStage.y = 142;
            this.store.btnShopSong.y = 147;

            this.store.charShop.visible = false;
            this.store.sceneShop.visible = true;
            this.store.songShop.visible = false;
        },

        btnShopSong_pressed: function(){
            this.store.btnShopChar.loadTexture("btnShopChar_n");
            this.store.btnShopStage.loadTexture("btnShopStage_n");
            this.store.btnShopSong.loadTexture("btnShopSong_p");

            this.store.btnShopChar.y = 147;
            this.store.btnShopStage.y = 147;
            this.store.btnShopSong.y = 142;

            this.store.charShop.visible = false;
            this.store.sceneShop.visible = false;
            this.store.songShop.visible = true;
        },

        btnPerform_pressed: function(){
            this.btnPerform.loadTexture("btnPerform_p");
            this.btnStore.loadTexture("btnStore_n");
            this.btnStats.loadTexture("btnStats_n");

            this.songList.visible = true;
            this.songList.songBarSelect.visible = false;
            this.songList.selectBackground.visible = false;
            this.songList.btnConfirm.visible = false;
            this.songList.btnCancel.visible = false;
            this.store.visible = false;
            this.statsPage.visible = false;
        },

        btnStore_pressed: function(){
            this.btnPerform.loadTexture("btnPerform_n");
            this.btnStore.loadTexture("btnStore_p");
            this.btnStats.loadTexture("btnStats_n");

            this.songList.visible = false;
            this.store.visible = true;
            this.statsPage.visible = false;
        },

        btnStats_pressed: function(){
            this.btnPerform.loadTexture("btnPerform_n");
            this.btnStore.loadTexture("btnStore_n");
            this.btnStats.loadTexture("btnStats_p");

            this.songList.visible = false;
            this.store.visible = false;
            this.statsPage.visible = true;
        },

        btnExit_pressed: function(){
            game.state.start("Title");
        },

        update: function () {
            //this.titleName.x++;
        }
    };

    var titleState = {
        preload: function () {
            //this.load.image('name', 'assets/name.jpg');
            this.load.image('title', 'images/gfx/guis/title.png');
            this.load.image('titleBackground', 'images/gfx/guis/titleBackground.png');
            this.load.image('titleShadow', 'images/gfx/guis/titleShadow.png');
            this.load.image('start', 'images/gfx/guis/start.png');
            this.load.image('btnFacebook', 'images/gfx/guis/btnFacebook.png');

        },

        create: function () {
            this.background = this.add.sprite(0, 0, "titleBackground");
            this.shadow = this.add.sprite(0, 15, "titleShadow");
            this.title = this.add.sprite(75, 8, "title");
            this.tapToStart = this.add.button(97, 125, "start", this.goToMenu, this);
            this.btnFacebook = this.add.button(22, 121, "btnFacebook", this.openFacebook, this);
        },

        update: function () {
            //this.titleName.x++;
        },

        goToMenu: function () {
            game.state.start("Menu");
        },

        openFacebook: function(){
            
        }
    };

    var inGameState = {
        currentState: "",
        currentAnimation: "",
        lastUpdated: Date.now(),
        tillNextFrame: 0,

        preload: function () {
            this.load.image('brokenLife', 'images/gfx/guis/brokenLife.png');
            this.load.image('btnMenu', 'images/gfx/guis/btnMenu.png');
            this.load.image('btnMenuVictory', 'images/gfx/guis/btnMenuVictory.png');
            this.load.image('btnPause', 'images/gfx/guis/btnPause.png');
            this.load.image('btnRestart', 'images/gfx/guis/btnRestart.png');
            this.load.image('btnRestartVictory', 'images/gfx/guis/btnRestartVictory.png');
            this.load.image('btnUnPause', 'images/gfx/guis/btnUnPause.png');
            this.load.image('defeatGUI', 'images/gfx/guis/defeatGUI.png');
            this.load.image('life', 'images/gfx/guis/life.png');
            this.load.image('notes', 'images/gfx/guis/notes.png');
            this.load.image('notesline', 'images/gfx/guis/notesline.png');
            this.load.image('pauseGUI', 'images/gfx/guis/pauseGUI.png');
            this.load.image('shadow', 'images/gfx/guis/shadow.png');
            this.load.image('songLines', 'images/gfx/guis/songLines.png');
            this.load.image('victoryGUI', 'images/gfx/guis/victoryGUI.png');
            this.load.image('wall1', 'images/gfx/guis/wall1.png');
            this.load.image('btnEnable_n', 'images/gfx/guis/btnEnable_n.png');
            this.load.image('btnEnable_p', 'images/gfx/guis/btnEnable_p.png');
            this.load.image('btnDisable_n', 'images/gfx/guis/btnDisable_n.png');
            this.load.image('btnDisable_p', 'images/gfx/guis/btnDisable_p.png');
            this.load.image('btnStart_n', 'images/gfx/guis/btnStart_n.png');
            this.load.image('btnStart_p', 'images/gfx/guis/btnStart_p.png');
            this.load.image('instrumentsGUI', 'images/gfx/guis/instrumentsGUI.png');
            this.load.image('instrumentBar_d', 'images/gfx/guis/instrumentBar_d.png');
            this.load.image('instrumentBar_e', 'images/gfx/guis/instrumentBar_e.png');
        },

        create: function () {
            this.floor = this.add.sprite(0, 0, Shop.sceneShop[Profile.unlockedScene[Profile.currentFloor]].sprite);
            this.wall = this.add.sprite(13, 15, Shop.sceneShop[Profile.unlockedScene[Profile.currentWall]].sprite);
            this.stage = this.add.sprite(0, 0, Shop.sceneShop[Profile.unlockedScene[Profile.currentStage]].sprite);
            this.leftCurtain = this.add.sprite(0, 4, Shop.sceneShop[Profile.unlockedScene[Profile.currentCurtain]].sprite + 'Left');
            this.rightCurtain = this.add.sprite(140, 4, Shop.sceneShop[Profile.unlockedScene[Profile.currentCurtain]].sprite + 'Right');
            this.curtain = this.add.sprite(0, 0, Shop.sceneShop[Profile.unlockedScene[Profile.currentCurtain]].sprite);

            this.pauseGUI = this.add.group();
            this.victoryGUI = this.add.group();
            this.defeatGUI = this.add.group();
            this.instrumentGUI = this.add.group();

            //this.store.btnShopChar = this.add.button(194, 142, "btnShopChar_p", this.btnShopChar_pressed, this);
            this.pauseGUI.background = this.add.sprite(79, 40, 'pauseGUI');
            this.pauseGUI.btnUnPause = this.add.button(133, 80, 'btnUnPause', this.btnUnPause_pressed, this);
            this.pauseGUI.btnRestart = this.add.button(92, 80, 'btnRestart', this.btnRestart_pressed, this);
            this.pauseGUI.btnMenu = this.add.button(171, 80, 'btnMenu', this.btnMenu_pressed, this);
            this.pauseGUI.add(this.pauseGUI.background);
            this.pauseGUI.add(this.pauseGUI.btnUnPause);
            this.pauseGUI.add(this.pauseGUI.btnRestart);
            this.pauseGUI.add(this.pauseGUI.btnMenu);
            this.pauseGUI.visible = false;

            this.victoryGUI.background = this.add.sprite(80, 32, 'victoryGUI');
            this.victoryGUI.btnRestart = this.add.button(133, 98, 'btnRestartVictory', this.btnRestart_pressed, this);
            this.victoryGUI.btnMenu = this.add.button(166, 98, 'btnMenuVictory', this.btnMenu_pressed, this);
            this.victoryGUI.add(this.victoryGUI.background);
            this.victoryGUI.add(this.victoryGUI.btnRestart);
            this.victoryGUI.add(this.victoryGUI.btnMenu);
            this.victoryGUI.visible = false;

            this.defeatGUI.background = this.add.sprite(79, 40, 'victoryGUI');
            this.defeatGUI.btnRestart = this.add.button(116, 82, 'btnRestart', this.btnRestart_pressed, this);
            this.defeatGUI.btnMenu = this.add.button(159, 82, 'btnMenu', this.btnMenu_pressed, this);
            this.defeatGUI.add(this.defeatGUI.background);
            this.defeatGUI.add(this.defeatGUI.btnRestart);
            this.defeatGUI.add(this.defeatGUI.btnMenu);
            this.defeatGUI.visible = false;

            this.instrumentGUI.background = this.add.sprite(66, 29, 'victoryGUI');
            this.instrumentGUI.btnEnable = this.add.button(130, 120, 'btnEnable_n', this.btnRestart_pressed, this);
            this.instrumentGUI.btnStart = this.add.button(171, 120, 'btnStart_n', this.btnMenu_pressed, this);
            this.instrumentGUI.enabledList = [];
            this.instrumentGUI.add(this.instrumentGUI.background);
            this.instrumentGUI.add(this.instrumentGUI.btnEnable);
            this.instrumentGUI.add(this.instrumentGUI.btnStart);

            this.btnPause = this.add.button(0, 0, 'btnPause', this.btnPause_pressed, this);
            this.btnPause.visible = false;
        },

        update: function () {
            if (Date.now() >= this.lastUpdated + this.tillNextFrame) {
                switch (this.currentAnimation) {
                    case "beginning1":
                        this.instrumentGUI.y--;
                        break;

                    case "beginning2":
                        this.leftCurtain.x--;
                        this.rightCurtain.y++;
                        break;
                }
                this.lastUpdated = Date.now();
            }

            currentTime = Date.now();
        },

        initializeLevel: function (index) {
            console.log(this);
            this.game.pauseGUI.visible = false;
            this.victoryGUI.visible = false;
            this.defeatGUI.visible = false;
            this.instrumentGUI.visible = true;
            this.btnPause.visible = false;
            if (index < 0){
                this.currentState = "Freestyle";
            } else{
                for (var i = 0; i < Shop.songShop[index].instrumentCount; i++) {

                }
            }
        },

        btnPause_pressed: function(){

        },

        btnUnPause_pressed: function(){

        },

        btnRestart_pressed: function(){

        },

        btnMenu_pressed: function(){

        },

        btnEnable_pressed: function(){
            
        },

        btnStart_pressed: function(){

        },

        playAnimation: function(type){
            switch (type) {
                case 0: // Game just started, player pick instrument, so hide instrument GUI (make sure it visible first)
                    this.pauseGUI.visible = false;
                    this.victoryGUI.visible = false;
                    this.defeatGUI.visible = false;
                    this.instrumentGUI.visible = true;
                    this.btnPause.visible = false;

                    this.instrumentGUI.x = 0;
                    this.instrumentGUI.y = 0;

                    this.currentAnimation = "beginning1";

                    break;
                case 1:
                    this.pauseGUI.visible = false;
                    this.victoryGUI.visible = false;
                    this.defeatGUI.visible = false;
                    this.instrumentGUI.visible = false;
                    this.btnPause.visible = false;

                    this.leftCurtain.x = 0;
                    this.rightCurtain.x = 140;

                    this.currentAnimation = "beginning2";

                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }


    };

    function init() {
        game.antialias = false;
        game.stage.smoothed = false;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    }

    function preload() {
        game.load.image('stage1', 'images/gfx/guis/stage1.png');
        game.load.image('floor1', 'images/gfx/guis/floor1.png');
        game.load.image('curtain1', 'images/gfx/guis/curtain1.png');
        game.load.image('curtain1Left', 'images/gfx/guis/curtain1Left.png');
        game.load.image('curtain1Right', 'images/gfx/guis/curtain1Right.png');

        game.load.image('AbrahamLincoln', 'images/gfx/sprites/AbrahamLincoln.png');
        game.load.image('AbrahamLincoln_tap', 'images/gfx/sprites/AbrahamLincoln_tap.png');
        game.load.image('BarackObama', 'images/gfx/sprites/BarackObama.png');
        game.load.image('BarackObama_tap', 'images/gfx/sprites/BarackObama_tap.png');
        game.load.image('ConductorDown', 'images/gfx/sprites/ConductorDown.png');
        game.load.image('ConductorUp', 'images/gfx/sprites/ConductorUp.png');
        game.load.image('DaftPunk', 'images/gfx/sprites/DaftPunk.png');
        game.load.image('DaftPunk_tap', 'images/gfx/sprites/DaftPunk_tap.png');
        game.load.image('FreddieMercury', 'images/gfx/sprites/FreddieMercury.png');
        game.load.image('FreddieMercury_tap', 'images/gfx/sprites/FreddieMercury_tap.png');
        game.load.image('Jacqueline', 'images/gfx/sprites/Jacqueline.png');
        game.load.image('Jacqueline_tap', 'images/gfx/sprites/Jacqueline_tap.png');
        game.load.image('JeremyRossman', 'images/gfx/sprites/JeremyRossman.png');
        game.load.image('JeremyRossman_tap', 'images/gfx/sprites/JeremyRossman_tap.png');
        game.load.image('MarilynMonroe', 'images/gfx/sprites/MarilynMonroe.png');
        game.load.image('MarilynMonroe_tap', 'images/gfx/sprites/MarilynMonroe_tap.png');
        game.load.image('MichaelJackson', 'images/gfx/sprites/MichaelJackson.png');
        game.load.image('MichaelJackson_tap', 'images/gfx/sprites/MichaelJackson_tap.png');
        game.load.image('MrRefereeDown', 'images/gfx/sprites/MrRefereeDown.png');
        game.load.image('MrRefereeUp', 'images/gfx/sprites/MrRefereeUp.png');
        game.load.image('RedRanger', 'images/gfx/sprites/RedRanger.png');
        game.load.image('RedRanger_tap', 'images/gfx/sprites/RedRanger_tap.png');
        game.load.image('Spock', 'images/gfx/sprites/Spock.png');
        game.load.image('Spock_tap', 'images/gfx/sprites/Spock_tap.png');
        game.load.image('StanleyKubrick', 'images/gfx/sprites/StanleyKubrick.png');
        game.load.image('StanleyKubrick_tap', 'images/gfx/sprites/StanleyKubrick_tap.png');
        game.load.image('VicFontaine', 'images/gfx/sprites/VicFontaine.png');
        game.load.image('VicFontaine_tap', 'images/gfx/sprites/VicFontaine_tap.png');
        game.load.image('VladimirPutin', 'images/gfx/sprites/VladimirPutin.png');
        game.load.image('VladimirPutin_tap', 'images/gfx/sprites/VladimirPutin_tap.png');

    }

    function create() {
        game.state.add("Title", titleState);
        game.state.add("Menu", menuState);
        game.state.add("InGame", inGameState);
        game.state.start("Title");
    }

    function update() {
    }

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    var game = new Phaser.Game(280, 160, Phaser.AUTO, '', {init: init, preload: preload, create: create, update: update })
} )();