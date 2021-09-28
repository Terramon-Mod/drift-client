/// Force http
if (location.protocol !== "http:") {
  location.protocol = "http:";
}

var targetFPS = 60, delta, delta2, currentTime, oldTime = 0, gameState = 0, gameOver = !1, newsocket, socket, port;
Number.prototype.round = function (a) {
    return +this.toFixed(a)
}
    ;
CanvasRenderingContext2D.prototype.roundRect = function (a, b, c, d, e) {
    c < 2 * e && (e = c / 2);
    d < 2 * e && (e = d / 2);
    this.beginPath();
    this.moveTo(a + e, b);
    this.arcTo(a + c, b, a + c, b + d, e);
    this.arcTo(a + c, b + d, a, b + d, e);
    this.arcTo(a, b + d, a, b, e);
    this.arcTo(a, b, a + c, b, e);
    this.closePath();
    return this
}
    ;
var MathPI = Math.PI
    , MathCOS = Math.cos
    , MathSIN = Math.sin
    , MathABS = Math.abs
    , MathPOW = Math.pow
    , MathSQRT = Math.sqrt
    , MathMIN = Math.min
    , MathMAX = Math.max
    , MathATAN2 = Math.atan2
    , mainCanvas = document.getElementById("mainCanvas")
    , mainContext = mainCanvas.getContext("2d")
    , gameTitle = document.getElementById("gameTitle")
    , instructionsText = document.getElementById("instructionsText")
    , gameUiContainer = document.getElementById("gameUiContainer")
    , userInfoContainer = document.getElementById("userInfoContainer")
    , loadingContainer = document.getElementById("loadingContainer")
    , enterGameButton = document.getElementById("enterGameButton")
    , userNameInput = document.getElementById("userNameInput")
    , menuContainer = document.getElementById("menuContainer")
    , darkener = document.getElementById("darkener")
    , linksContainer = document.getElementById("linksContainer")
    , infoContainerM = document.getElementById("infoContainerM")
    , leaderboardList = document.getElementById("leaderboardList")
    , boostDisplay = document.getElementById("boostDisplay")
    , lapsDisplay = document.getElementById("lapsDisplay")
    , upgradesList = document.getElementById("upgradesList")
    , upgradesInfo = document.getElementById("upgradesInfo")
    , upgradesHeaders = document.getElementById("upgradesHeaders")
    , className = document.getElementById("className")
    , classDescription = document.getElementById("classDescription")
    , classDiff = document.getElementById("classDiff")
    , endBoardContainer = document.getElementById("endBoardContainer")
    , endBoardTable = document.getElementById("endBoardTable")
    , endBoardTimer = document.getElementById("endBoardTimer")
    , useAbilityContainer = document.getElementById("useAbilityContainer")
    , useAbilityName = document.getElementById("useAbilityName")
    , followText = document.getElementById("followText")
    , lobbyKey = document.getElementById("lobbyKey")
    , lobbyKeyText = document.getElementById("lobbyKeyText")
    , classIcon = document.getElementById("classIcon")
    , chatbox = document.getElementById("chatbox");
chatbox.style.display = "block";
var chatInput = document.getElementById("chatInput")
    , chatList = document.getElementById("chatList")
    , modeSelector = document.getElementById("modeSelector")
    , modeListView = document.getElementById("modeListView")
    , instructionsIndex = 0
    , instructionsSpeed = 5500
    , insturctionsCountdown = 0
    , instructionsList = "Private server by Calamity".split(";")
    , instructionsIndex = UTILS.randInt(0, instructionsList.length - 1)
    , randomLoadingTexts = "starting engines...;prepare to drive...;engaging flux capacitors...;pumping gas...;buckle up buckeroo...;playing eurobeat...".split(";");
function addChatItem(a, b, c) {
    var d = document.createElement("li");
    c ? (d.className = "sysMsg",
        d.innerHTML = b) : d.innerHTML = "[" + a + "] <span class='grayMsg'>" + b + "</span>";
    for (; 120 < chatList.clientHeight;)
        chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(d)
}
var hasStorage = "undefined" !== typeof Storage;
if (hasStorage) {
    var cid = localStorage.getItem("sckt");
    cid || (cid = UTILS.getUniqueID(),
        localStorage.setItem("sckt", cid))
}
var partyKey = null, player = null, modeIndex = 0, modeList, gameObjects = [], map = null, currentMode = null, target = [0, 0, 0, 0], viewMult = 1, maxScreenWidth = 1920, maxScreenHeight = 1080, originalScreenWidth = maxScreenWidth, originalScreenHeight = maxScreenHeight, screenWidth, screenHeight;
function getURLParam(a, b) {
    b || (b = location.href);
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var c = (new RegExp("[\\?&]" + a + "=([^&#]*)")).exec(b);
    return null == c ? null : c[1]
}
var lobbyURLIP = getURLParam("l"), lobbyRoomID;
if (lobbyURLIP) {
    var tmpL = lobbyURLIP.split("-")
        , lobbyURLIP = tmpL[0];
    lobbyRoomID = tmpL[1]
}
window.onload = function () {
    enterGameButton.onclick = function () {
        enterGame()
    };
    console.log(lobbyURLIP);
    $.getJSON("http://35.85.34.29:9001/getIp", {}, function (a) {
        port = a.port;
	a.hostname = "35.85.34.29"
        newsocket || (newsocket = new WebSocket(`${a.protocol}://${a.hostname}:${a.port}`), setupNewSocket())
    })
}
    ;
mainCanvas.addEventListener("mousemove", gameInput, !1);
mainCanvas.addEventListener("mousedown", mouseDown, !1);
mainCanvas.addEventListener("mouseup", mouseUp, !1);
var mouseX, mouseY, forceTarget = !0;
function gameInput(a) {
    a.preventDefault();
    a.stopPropagation();
    mouseX = a.clientX;
    mouseY = a.clientY;
    sendTarget(forceTarget);
    forceTarget = !1
}
function mouseDown(a) {
    a.preventDefault();
    a.stopPropagation();
    3 !== a.which && 2 !== a.button && (target[2] = 1,
        sendTarget(!0));
    document.activeElement.blur();
    mainCanvas.focus()
}
function mouseUp(a) {
    a.preventDefault();
    a.stopPropagation();
    3 === a.which || 2 === a.button ? socket.emit("3") : (target[2] = 0,
        sendTarget(!0))
}
window.onkeyup = function (a) {
    a = a.keyCode ? a.keyCode : a.which;
    newsocket && (userNameInput === document.activeElement ? 13 == a && (userNameInput.blur(),
        enterGame()) : chatInput === document.activeElement ? 13 == a && (chatInput.blur(),
            mainCanvas.focus(),
            sendChat(chatInput.value),
            chatInput.value = "") : player && !player.dead && (67 == a && (chatbox.style.display = "block" == chatbox.style.display ? "none" : "block"),
                13 == a ? chatInput.focus() : 49 <= a && 55 >= a ? socket.emit("2", a - 49) : 32 == a ? socket.emit("3") : 81 == a && (target[3] = target[3] ? 0 : 1,
                    sendTarget(!0))))
}
    ;
function setupSocket() {
    socket.on("connect_error", function () {
        lobbyURLIP ? kickPlayer("Connection failed. Please check your lobby ID.") : kickPlayer("Connection failed. Please check your internet connection.")
    });
    socket.on("disconnect", function (a) {
        kickPlayer("Disconnected.");
        console.log("Send this to the dev: " + a)
    });
    socket.on("error", function (a) {
        kickPlayer("Disconnected. The server may have updated.");
        console.log("Send this to the dev: " + a)
    });
    socket.on("kick", function (a) {
        kickPlayer(a)
    });
    socket.on("v", function (a, b, c) {
        viewMult != c && (viewMult = c,
            maxScreenWidth = a * c,
            maxScreenHeight = b * c,
            resize())
    });
    socket.on("mds", function (a, b) {
        modeList = a;
        modeSelector.innerHTML = a[b].name + "  <i style='vertical-align: middle;' class='material-icons'>&#xE5C5;</i>";
        modeIndex = b
    });
    socket.on("c", function (a, b, c) {
        addChatItem(a, b, c)
    });
    socket.on("gd", function (a, b) {
        map = a;
        currentMode = b;
        document.getElementById("notifDisplay").style.display = currentMode.recTime ? "inline-block" : "none";
        document.getElementById("modeVotes0").innerHTML = "(0)"
    });
    socket.on("spawn", function (a, b) {
        objectExists(a) ? updateOrPushObject(a) : gameObjects.push(a);
        b && (player = a,
            gameState = 1,
            toggleMenuUI(!1),
            toggleGameUI(!0),
            mainCanvas.focus())
    });
    socket.on("cv", function (a, b) {
        document.getElementById("modeVotes" + a).innerHTML = "(" + b + ")"
    });
    socket.on("lk", function (a) {
        partyKey = a
    });
    socket.on("d", function (a) {
        a = getPlayerIndexById(a);
        null != a && gameObjects.splice(a, 1)
    });
    socket.on("0", getLeaderboardData);
    socket.on("1", updateObjectData);
    socket.on("2", function (a, b) {
        screenShake(a, b)
    });
    socket.on("3", function (a, b, c, d) {
        var e = getPlayerIndex(a);
        null != e && (gameObjects[e].health = b,
            c && (gameObjects[e].maxHealth = c),
            0 >= gameObjects[e].health && gameObjects[e].visible && (gameObjects[e].dead = !0,
                gameObjects[e].deathScaleMult = 1,
                gameObjects[e].deathAlpha = 1),
            d && (gameObjects[e].hitFlash = d));
        player && a == player.sid && (player.health = b,
            player.dead = 0 >= b,
            player.dead && (hideMainMenuText(),
                leaveGame()))
    });
    socket.on("4", updateFuelDisplay);
    socket.on("ts", function (a, b) {
        player && player.team == b && (lapsDisplay.innerHTML = currentMode.objName + " " + a + "/" + currentMode.pointsToWin)
    });
    socket.on("5", function (a, b, c) {
        null != a && (lapsDisplay.innerHTML = currentMode.objName + " " + a + "/" + currentMode.pointsToWin,
            currentMode.recTime && addLapInfo(a, 0),
            1 < a && currentMode.scrText && showNotification(currentMode.scrText));
        upgradesList.innerHTML = "";
        upgradesHeaders.innerHTML = "";
        upgradesInfo.style.display = "none";
        if (0 < b) {
            for (var d = a = "", e = 0; e < c.length; ++e) {
                var d = d + ("<div class='upgradeIndx'>" + (e + 1) + "</div>")
                    , f = "";
                c[e].cost && (f += "(" + c[e].cost + ") ");
                f = 1 == c[e].type ? f + "<span class='yellow'>use item</span>" : c[e].lvl < c[e].max ? f + ("lvl " + c[e].lvl) : "max level";
                a += "<div class='upgradeItem'><div class='upgradeTxt'>" + c[e].name + "</div><div class='upgradeNum'>" + f + "</div></div>"
            }
            upgradesList.innerHTML = a;
            upgradesHeaders.innerHTML = d;
            upgradesInfo.innerHTML = "points available (" + b + ")";
            upgradesInfo.style.display = "inline-block";
            $("#upgradesInfo").animate({
                "font-size": "24px"
            }, 100).animate({
                "font-size": "19px"
            }, 100)
        }
    });
    socket.on("a", function (a) {
        a ? (useAbilityContainer.style.display = "inline-block",
            useAbilityName.innerHTML = a.name,
            a.cd ? ($("#abilityCooldown").css("height", "75px"),
                $("#abilityCooldown").animate({
                    height: "0%"
                }, a.cd)) : $("#abilityCooldown").css("height", "0")) : useAbilityContainer.style.display = "none"
    });
    socket.on("6", updateLapInfo);
    socket.on("7", function (a, b, c) {
        a = getPlayerIndex(a);
        null != a && (gameObjects[a][b] = c)
    });
    socket.on("8", function (a) {
        gameOver = !0;
        bestTime = null;
        initBest = !1;
        toggleGameUI(!1);
        toggleMenuUI(!1);
        darkener.style.display = "block";
        showEndBoard(a)
    });
    socket.on("9", function (a) {
        endBoardTimer.innerHTML = "Next game " + a
    });
    socket.on("n", function (a) {
        showNotification(a)
    });
}
var updateObjectData = function (a, b) {
    if (a)
        a.visible = !0,
            updateOrPushObject(a),
            delete a;
    else if (b) {
        for (var c = 0; c < gameObjects.length; ++c)
            gameObjects[c].visible || (gameObjects[c].forcePos = 1),
                gameObjects[c].visible = !1;
        for (c = 0; c < b.length;) {
            var d = getPlayerIndex(b[c]);
            null != d && (gameObjects[d].x = b[c + 1],
                gameObjects[d].y = b[c + 2],
                gameObjects[d].dir = b[c + 3] || gameObjects[d].dir,
                gameObjects[d].visible = !0);
            c += 4
        }
        delete b
    }
}
    , getLeaderboardData = function (a) {
        for (var b = "", c = 1, d = 0; d < a.length;)
            b += "<div class='leaderboardItem'><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[d] == player.sid ? "leaderYou" : "leader " + a[d + 1]) + "'>" + a[d + 2] + "</div><div class='leaderboardLapsNum'>" + a[d + 3] + "</div></div>",
                d += 4,
                c++;
        leaderboardList.innerHTML = b;
        delete a
    }
    , updateFuelDisplay = function (a) {
        boostDisplay.innerHTML = a + " Boost"
    }
    , classIndex = 0;
hasStorage && (classIndex = parseInt(localStorage.getItem("clssI")) || 0);
var playerClasses = [{
    name: "Racer",
    diff: "Speed <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0\u25a0</span>"
}, {
    name: "Bully",
    diff: "Speed <span class='greyMenuText'>\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0</span>"
}, {
    name: "Flash",
    diff: "Speed <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0\u25a0\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0</span>"
}, {
    name: "Hazard",
    diff: "Speed <span class='greyMenuText'>\u25a0\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0</span>"
}, {
    name: "Buster",
    diff: "Speed <span class='greyMenuText'>\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0</span></br>Special <span class='greyMenuText'>Cannon</span>"
}, {
    name: "Ambulamp",
    diff: "Speed <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Special <span class='greyMenuText'>Healing Orb</span>"
}, {
    name: "Piercer",
    diff: "Speed <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0</span></br>Special <span class='greyMenuText'>Force Push</span>"
}, {
    name: "Sludger",
    diff: "Speed <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0\u25a0\u25a0</span></br>Special <span class='greyMenuText'>Sludge</span>"
}, {
    name: "Deprived",
    diff: "Speed <span class='greyMenuText'>\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0</span>"
}]
    , unlockedSecret0 = !1;
hasStorage && localStorage.getItem("scrt0") && unlockSecret(0);
function unlockSecret(a) {
    a || unlockedSecret0 || (unlockedSecret0 = 1,
        followText.innerHTML = "Thank you for playing",
        playerClasses.push({
            name: "Star",
            diff: "Speed <span class='greyMenuText'>\u25a0\u25a0</span></br>Defense <span class='greyMenuText'>\u25a0\u25a0</span></br>Damage <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Handling <span class='greyMenuText'>\u25a0\u25a0\u25a0</span></br>Special <span class='greyMenuText'>Star Power</span>"
        }),
        hasStorage && localStorage.setItem("scrt0", 1))
}
function changeClass(a) {
    classIndex += a;
    classIndex >= playerClasses.length ? classIndex = 0 : 0 > classIndex && (classIndex = playerClasses.length - 1);
    classIcon.src = classIcons[classIndex];
    className.innerHTML = playerClasses[classIndex].name;
    classDiff.innerHTML = playerClasses[classIndex].diff;
    hasStorage && localStorage.setItem("clssI", classIndex)
}
function loadPartyKey() {
    partyKey && (window.history.pushState("", "Driftin.io", "/?l=" + partyKey),
        lobbyKeyText.innerHTML = "send the url above to a friend",
        lobbyKey.className = "deadLink")
}
function castVote(a) {
    socket.emit("cv", a)
}
function leaveGame() {
    gameState = 0;
    initBest = !1;
    notifDisplay && notifDisplay.html("");
    $("#abilityCooldown").css("height", "100%");
    toggleGameUI(!1);
    toggleMenuUI(!0);
    endBoardContainer.style.display = "none"
}
var maxFlashAlpha = .3
    , playerCanvas = document.createElement("canvas")
    , playerCanvasScale = 150;
playerCanvas.width = playerCanvas.height = playerCanvasScale;
var playerContext = playerCanvas.getContext("2d");
playerContext.translate(playerCanvas.width / 2, playerCanvas.height / 2);
playerContext.lineJoin = "round";
var updateGameLoop = function (a) {
    if (player) {
        updateScreenShake();
        for (var b, c = 0; c < gameObjects.length; ++c)
            if (b = gameObjects[c],
                b.visible && !b.dead)
                if (b.forcePos || void 0 == b.localX || void 0 == b.localY)
                    b.localX = b.x,
                        b.localY = b.y,
                        b.forcePos = 0;
                else {
                    var d = b.x - b.localX;
                    b.localX += d * a * .01;
                    d = b.y - b.localY;
                    b.localY += d * a * .01
                }
        b = gameObjects[getPlayerIndex(player.sid)];
        var e, f;
        b && (e = b.localX,
            f = b.localY);
        d = (e || 0) - maxScreenWidth / 2 - screenSkX;
        f = (f || 0) - maxScreenHeight / 2 - screenSkY;
        map && currentMode && (mainContext.lineWidth = 2 * map.tracksidePadding,
            mainContext.fillStyle = map.wallColor,
            mainContext.strokeStyle = "#ea6363",
            mainContext.lineJoin = "miter",
            mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight),
            mainContext.fillStyle = map.backgroundColor,
            "square" == map.shape ? (mainContext.fillRect(-map.widthH - d, -map.heightH - f, map.width, map.height),
                mainContext.strokeRect(-map.widthH - d + map.tracksidePadding, -map.heightH - f + map.tracksidePadding, map.width - 2 * map.tracksidePadding, map.height - 2 * map.tracksidePadding),
                map.trackWidth && (mainContext.fillStyle = "#ea6363",
                    mainContext.fillRect(-map.innerWidthH - d - 2 * map.tracksidePadding, -map.innerHeightH - f - 2 * map.tracksidePadding, map.innerWidth + 4 * map.tracksidePadding, map.innerHeight + 4 * map.tracksidePadding),
                    mainContext.fillStyle = map.wallColor,
                    mainContext.fillRect(-map.innerWidthH - d, -map.innerHeightH - f, map.innerWidth, map.innerHeight)),
                mainContext.strokeStyle = "#fff",
                mainContext.setLineDash([100, 100]),
                mainContext.strokeRect(-map.widthH - d + map.tracksidePadding, -map.heightH - f + map.tracksidePadding, map.width - 2 * map.tracksidePadding, map.height - 2 * map.tracksidePadding),
                map.trackWidth && mainContext.strokeRect(-map.innerWidthH - d - map.tracksidePadding, -map.innerHeightH - f - map.tracksidePadding, map.innerWidth + 2 * map.tracksidePadding, map.innerHeight + 2 * map.tracksidePadding),
                mainContext.setLineDash([])) : "circle" == map.shape && (mainContext.beginPath(),
                    mainContext.arc(-d, -f, map.heightH, 0, 2 * Math.PI),
                    mainContext.closePath(),
                    mainContext.fill(),
                    mainContext.beginPath(),
                    mainContext.arc(-d, -f, map.heightH - map.tracksidePadding, 0, 2 * Math.PI),
                    mainContext.closePath(),
                    mainContext.stroke(),
                    map.trackWidth && (mainContext.fillStyle = "#ea6363",
                        mainContext.beginPath(),
                        mainContext.arc(-d, -f, map.innerWidthH + 2 * map.tracksidePadding, 0, 2 * Math.PI),
                        mainContext.closePath(),
                        mainContext.fill(),
                        mainContext.fillStyle = map.wallColor,
                        mainContext.beginPath(),
                        mainContext.arc(-d, -f, map.innerWidthH, 0, 2 * Math.PI),
                        mainContext.closePath(),
                        mainContext.fill()),
                    mainContext.strokeStyle = "#fff",
                    mainContext.setLineDash([100, 100]),
                    mainContext.beginPath(),
                    mainContext.arc(-d, -f, map.innerWidthH + map.tracksidePadding, 0, 2 * Math.PI),
                    mainContext.closePath(),
                    mainContext.stroke(),
                    mainContext.beginPath(),
                    mainContext.arc(-d, -f, map.heightH - map.tracksidePadding, 0, 2 * Math.PI),
                    mainContext.closePath(),
                    mainContext.stroke(),
                    mainContext.setLineDash([])),
            mainContext.fillStyle = map.lineColor,
            mainContext.strokeStyle = map.lineColor,
            map.startLine && mainContext.fillRect(-(map.startLineWidth / 2) - d, map.height / 2 - map.trackWidth - f + 2 * map.tracksidePadding, map.startLineWidth, map.trackWidth - 4 * map.tracksidePadding));
        for (c = 0; c < gameObjects.length; ++c)
            if (b = gameObjects[c],
                b.visible && !b.dead || b.deathAlpha) {
                e = b.localX - d;
                var h = b.localY - f, g = 0, k;
                b.deathAlpha && b.dead ? (b.deathScaleMult += a / 50,
                    g = b.deathScaleMult,
                    b.deathAlpha -= a / 300,
                    0 >= b.deathAlpha && (b.deathAlpha = 0),
                    k = b.deathAlpha) : k = 1;
                var m = b.squeeze || 1, g = g + 2.25 * b.scale, l;
                playerContext.lineWidth = 11;
                playerContext.clearRect(-(playerCanvasScale / 2), -(playerCanvasScale / 2), playerCanvasScale, playerCanvasScale);
                b.isPlayer ? (renderPlayer(playerContext, g, m, b.classIndex, b.special),
                    l = 1 == b.classIndex ? g / 2 : 2 == b.classIndex ? g / 1.8 : 3 == b.classIndex ? g / 1.9 : 4 == b.classIndex ? g / 1.8 : 5 == b.classIndex ? g / 1.9 : 6 == b.classIndex ? g / 1.7 : 7 == b.classIndex ? g / 1.9 : 8 == b.classIndex ? g / 2.1 : 9 == b.classIndex ? g / 1.9 : g / 1.8) : (1 == b.colorIndex ? (playerContext.fillStyle = "#68d65a",
                        playerContext.strokeStyle = "#7bfa6a") : 2 == b.colorIndex ? (playerContext.fillStyle = "#a95ad6",
                            playerContext.strokeStyle = "#c26afa") : (playerContext.fillStyle = "#615959",
                                playerContext.strokeStyle = "#706767"),
                        playerContext.beginPath(),
                        playerContext.arc(0, 0, g / 2, 0, 2 * MathPI, !1),
                        playerContext.fill(),
                        playerContext.stroke());
                !gameOver && 0 < b.spawnProt && (void 0 == b.flashAlpha && (b.flashAlpha = maxFlashAlpha,
                    b.flashInc = 5E-4),
                    b.flashAlpha += b.flashInc * a,
                    b.flashAlpha > maxFlashAlpha ? (b.flashAlpha = maxFlashAlpha,
                        b.flashInc *= -1) : 0 >= b.flashAlpha && (b.flashAlpha = 0,
                            b.flashInc *= -1),
                    playerContext.globalCompositeOperation = "source-atop",
                    playerContext.fillStyle = "rgba(255, 255, 255, " + b.flashAlpha + ")",
                    playerContext.fillRect(-playerCanvas.width / 2, -playerCanvas.height / 2, playerCanvas.width, playerCanvas.height),
                    playerContext.globalCompositeOperation = "source-over");
                !gameOver && 0 < b.hitFlash && (b.hitFlash -= .001 * a,
                    0 >= b.hitFlash && (b.hitFlash = 0),
                    playerContext.globalCompositeOperation = "source-atop",
                    playerContext.fillStyle = "rgba(255, 255, 255, " + b.hitFlash + ")",
                    playerContext.fillRect(-playerCanvas.width / 2, -playerCanvas.height / 2, playerCanvas.width, playerCanvas.height),
                    playerContext.globalCompositeOperation = "source-over");
                mainContext.save();
                mainContext.globalAlpha = k;
                mainContext.translate(e, h);
                mainContext.rotate((b.sid != player.sid || player.turnSpeed ? b.dir : target[0]) + MathPI / 2);
                mainContext.drawImage(playerCanvas, -(playerCanvasScale / 2), -(playerCanvasScale / 2));
                mainContext.restore();
                b.isPlayer && b.name && !gameOver && (mainContext.font = "36px regularF",
                    mainContext.textAlign = "center",
                    mainContext.strokeStyle = "#5f5f5f",
                    mainContext.lineWidth = 6,
                    380 > mainContext.measureText(b.name).width && (mainContext.strokeText(b.name, e, h - l - 25),
                        mainContext.fillStyle = "#ffffff",
                        mainContext.fillText(b.name, e, h - l - 25)));
                !gameOver && b.isPlayer && (k = b.health / b.maxHealth,
                    m = 80 * k,
                    g = 80 / 9,
                    mainContext.fillStyle = "#5f5f5f",
                    mainContext.roundRect(e - 40 - 3, h + l + 25 - 3, 86, g + 6, 6).fill(),
                    mainContext.fillStyle = .35 < k ? "#78d545" : "#d55d45",
                    mainContext.roundRect(e - m / 2, h + l + 25, m, g, 6).fill())
            }
        updateAnimTexts(a);
        delete b
    }
};
function renderPlayer(a, b, c, d, e, f) {
    if (1 == d)
        a.fillStyle = "#5a68d6",
            a.strokeStyle = "#6a74fa",
            f && (b /= 1.5),
            a.beginPath(),
            a.arc(0, 0, b / 2, 0, 2 * MathPI, !1),
            a.fill(),
            a.stroke();
    else if (2 == d)
        f && (b /= 2,
            c = .8),
            a.fillStyle = "#a95ad6",
            a.strokeStyle = "#c26afa",
            a.lineWidth *= 2,
            a.beginPath(),
            a.moveTo(0, -2 * b / 3),
            a.lineTo(-b / 2 * c, b / 3),
            a.lineTo(b / 2 * c, b / 3),
            a.lineTo(0, -2 * b / 3),
            a.closePath(),
            a.stroke(),
            a.fill();
    else if (3 == d) {
        f && (b /= 1.3);
        a.fillStyle = "#3b3838";
        a.strokeStyle = "#4f4c4c";
        c = 8;
        f = MathPI / 2 * 3;
        d = b / 2;
        e = MathPI / c;
        a.beginPath();
        a.moveTo(0, -d);
        for (b = 0; b < c; b++)
            a.lineTo(MathCOS(f) * d, MathSIN(f) * d),
                f += e,
                a.lineTo(.8 * MathCOS(f) * d, .8 * MathSIN(f) * d),
                f += e;
        a.lineTo(0, -d);
        a.closePath();
        a.fill();
        a.stroke()
    } else if (4 == d)
        f && (b /= 2),
            a.fillStyle = "#757575",
            a.strokeStyle = "#888888",
            a.beginPath(),
            a.moveTo(-b / 4, -b / 1.5),
            a.lineTo(b / 4, -b / 1.5),
            a.lineTo(b / 2, b / 2.5),
            a.lineTo(-b / 2, b / 2.5),
            a.closePath(),
            a.fill(),
            a.stroke();
    else if (5 == d)
        d = 80,
            f && (b /= 2,
                c = .8,
                a.lineWidth *= 1.6,
                d = 70),
            a.fillStyle = "#e0e0e0",
            a.strokeStyle = "#f5f5f5",
            a.fillRect(-b * c / 2, -b / 2, b * c, b),
            a.strokeRect(-b * c / 2, -b / 2, b * c, b),
            a.font = d + "px regularF",
            a.textBaseline = "middle",
            a.textAlign = "center",
            a.fillStyle = "#fa6a6a",
            a.fillText("+", 0, 0);
    else if (6 == d)
        f && (b /= 2,
            c = .8),
            a.fillStyle = "#e89c42",
            a.strokeStyle = "#ffab48",
            a.lineWidth *= 2,
            a.beginPath(),
            a.moveTo(0, -2 * b / 3),
            a.lineTo(-b / 2 * c, b / 3),
            a.lineTo(0, b / 5),
            a.lineTo(b / 2 * c, b / 3),
            a.lineTo(0, -2 * b / 3),
            a.closePath(),
            a.stroke(),
            a.fill();
    else if (7 == d) {
        f && (b /= 2);
        a.fillStyle = "#68d65a";
        a.strokeStyle = "#7bfa6a";
        c = 6;
        e = -Math.PI / c - Math.PI / 2;
        f = b / 1.3;
        d = f / 1.5;
        a.beginPath();
        a.moveTo(d * Math.cos(e), d * Math.sin(e));
        for (b = 0; b <= c; b++) {
            e = 2 * b * Math.PI / c - Math.PI / 2;
            var h = (2 * b + 1) * Math.PI / c - Math.PI / 2;
            a.quadraticCurveTo(f * Math.cos(e), f * Math.sin(e), d * Math.cos(h), d * Math.sin(h))
        }
        a.fill();
        a.stroke();
        a.closePath()
    } else if (8 == d) {
        f && (b /= 1.4);
        a.fillStyle = "#ad8a36";
        a.strokeStyle = "#cba240";
        c = b / 2;
        f = 2 * Math.PI / 6;
        a.beginPath();
        a.moveTo(c, 0);
        for (b = 1; 6 > b; b++)
            a.lineTo(c * Math.cos(f * b), c * Math.sin(f * b));
        a.closePath();
        a.fill();
        a.stroke()
    } else if (9 == d) {
        f && (b /= 1.3);
        a.fillStyle = e ? "#000" : "#f7ed3e";
        a.strokeStyle = e ? "#fff" : "#ffff66";
        c = e ? 4 : 5;
        f = MathPI / 2 * 3;
        d = b / 2;
        e = MathPI / c;
        a.beginPath();
        a.moveTo(0, -d);
        for (b = 0; b < c; b++)
            a.lineTo(MathCOS(f) * d, MathSIN(f) * d),
                f += e,
                a.lineTo(.5 * MathCOS(f) * d, .5 * MathSIN(f) * d),
                f += e;
        a.lineTo(0, -d);
        a.closePath();
        a.fill();
        a.stroke()
    } else
        f && (b /= 2),
            a.fillStyle = "#d65a5a",
            a.strokeStyle = "#fa6a6a",
            a.lineWidth *= 2,
            a.beginPath(),
            a.moveTo(0, -2 * b / 3),
            a.lineTo(-b / 2 * c, b / 3),
            a.lineTo(b / 2 * c, b / 3),
            a.lineTo(0, -2 * b / 3),
            a.closePath(),
            a.stroke(),
            a.fill()
}
for (var classIconScale = 100, classIcons = [], i = 0; 10 > i; ++i) {
    var tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = tmpCanvas.height = classIconScale;
    var tmpContext = tmpCanvas.getContext("2d");
    tmpContext.lineWidth = 11;
    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
    tmpContext.lineJoin = "round";
    renderPlayer(tmpContext, classIconScale, 1, i, 0, !0);
    classIcons.push(tmpCanvas.toDataURL())
}
changeClass(0);
$("#classSelector").bind("contextmenu", function (a) {
    changeClass(-1);
    return !1
});
function updateMenuLoop(a) {
    1 != gameState && (insturctionsCountdown -= a,
        0 >= insturctionsCountdown && (insturctionsCountdown = instructionsSpeed,
            instructionsText.innerHTML = instructionsList[instructionsIndex],
            instructionsIndex++,
            instructionsIndex >= instructionsList.length && (instructionsIndex = 0)))
}
var maxNotifs = 2
    , bestTime = null
    , initBest = !1
    , lastTime = 0
    , notifDisplay = $("#notifDisplay");
function addLapInfo(a, b) {
    if (!initBest) {
        initBest = !0;
        var c = $("<div/>").addClass("notificationWrapper")
            , d = $("<span/>").addClass("notificationText").html("Best <span class='greyMenuText'>" + UTILS.getTimeString(bestTime || b) + "</span>");
        d.attr("id", "lapInfoBest");
        d.appendTo(c);
        c.appendTo(notifDisplay)
    } else if (!bestTime || lastTime < bestTime)
        bestTime = lastTime,
            $("#lapInfoBest").html("Best <span class='greyMenuText'>" + UTILS.getTimeString(bestTime) + "</span>");
    var e = notifDisplay.children().length
        , c = $("<div/>").addClass("notificationWrapper")
        , d = $("<span/>").addClass("notificationText").html("Lap " + a + " <span class='greyMenuText'>" + UTILS.getTimeString(b) + "</span>");
    e >= maxNotifs && notifDisplay.children().eq(1).remove();
    d.attr("id", "lapInfo" + a);
    d.appendTo(c);
    c.appendTo(notifDisplay);
    c.animate({
        "font-size": "28px"
    }, 100).animate({
        "font-size": "20px"
    }, 100)
}
function updateLapInfo(a, b) {
    currentMode.recTime && ($("#lapInfo" + a).html("Lap " + a + " <span class='greyMenuText'>" + UTILS.getTimeString(b) + "</span>"),
        bestTime || $("#lapInfoBest").html("Best <span class='greyMenuText'>" + UTILS.getTimeString(b) + "</span>"),
        lastTime = b)
}
for (var animTexts = [], animTextIndex = 0, i = 0; 20 > i; ++i)
    animTexts.push(new animText);
function updateAnimTexts(a) {
    mainContext.textAlign = "center";
    mainContext.strokeStyle = "#5f5f5f";
    mainContext.fillStyle = "#ffffff";
    mainContext.lineWidth = 7;
    for (var b = 0; b < animTexts.length; ++b)
        animTexts[b].update(a);
    mainContext.globalAlpha = 1
}
function animText() {
    this.fadeSpeed = this.fadeDelay = this.scalePlus = this.maxScale = this.minScale = this.scale = this.alpha = this.y = this.x = 0;
    this.text = "";
    this.active = !1;
    this.update = function (a) {
        this.active && (this.scale += this.scalePlus * a,
            this.scale >= this.maxScale ? (this.scalePlus *= -1,
                this.scale = this.maxScale) : this.scale <= this.minScale && (this.scalePlus = 0,
                    this.scale = this.minScale),
            this.fadeDelay -= a,
            0 >= this.fadeDelay && (this.alpha -= this.fadeSpeed * a,
                0 >= this.alpha && (this.alpha = 0,
                    this.active = !1)),
            this.active && (mainContext.globalAlpha = this.alpha,
                mainContext.font = this.scale * viewMult + "px regularF",
                mainContext.strokeText(this.text, this.x, this.y),
                mainContext.fillText(this.text, this.x, this.y)))
    }
        ;
    this.show = function (a, b, c, d, e, f) {
        this.x = a;
        this.y = b;
        this.minScale = this.scale = d;
        this.maxScale = 1.35 * d;
        this.scalePlus = f;
        this.text = c || "";
        this.alpha = 1;
        this.fadeDelay = e || 0;
        this.fadeSpeed = .003;
        this.active = !0
    }
}
function showAnimText(a, b, c, d, e, f, h) {
    if (!gameOver) {
        var g = animTexts[animTextIndex];
        g.show(a, b, c, d, e, h);
        g.type = f;
        animTextIndex++;
        animTextIndex >= animTexts.length && (animTextIndex = 0)
    }
}
function showNotification(a) {
    for (var b = 0; b < animTexts.length; ++b)
        "notif" == animTexts[b].type && (animTexts[b].active = !1);
    showAnimText(maxScreenWidth / 2, maxScreenHeight / 1.3, a, 46, 1E3, "notif", .19)
}
function showBigNotification(a) {
    for (var b = 0; b < animTexts.length; ++b)
        "bNotif" == animTexts[b].type && (animTexts[b].active = !1);
    showAnimText(maxScreenWidth / 2, maxScreenHeight / 3, a, 130, 1E3, "bNotif", .26)
}
var screenSkX = 0
    , screenShackeScale = 0
    , screenSkY = 0
    , screenSkRed = .5
    , screenSkDir = 0;
function screenShake(a, b) {
    screenShackeScale < a && (screenShackeScale = a,
        screenSkDir = b)
}
function updateScreenShake(a) {
    0 < screenShackeScale && (screenSkX = screenShackeScale * MathCOS(screenSkDir),
        screenSkY = screenShackeScale * MathSIN(screenSkDir),
        screenShackeScale *= screenSkRed,
        .1 >= screenShackeScale && (screenShackeScale = 0))
}
var kickReason = null;
function kickPlayer(a) {
    leaveGame();
    kickReason || (kickReason = a);
    showMainMenuText(kickReason);
    newsocket.close()
    window.history.pushState("", "Driftin.io", "/")
}
function updateOrPushObject(a) {
    var b = getPlayerIndex(a.sid);
    null != b ? gameObjects[b] = a : gameObjects.push(a)
}
function objectExists(a) {
    for (var b = 0; b < gameObjects.length; ++b)
        if (gameObjects[b].sid == a.sid)
            return !0;
    return !1
}
function getPlayerIndex(a) {
    for (var b = 0; b < gameObjects.length; ++b)
        if (gameObjects[b].sid == a)
            return b;
    return null
}
function getPlayerIndexById(a) {
    for (var b = 0; b < gameObjects.length; ++b)
        if (gameObjects[b].id == a)
            return b;
    return null
}
function showMainMenuText(a) {
    userInfoContainer.style.display = "none";
    loadingContainer.style.display = "block";
    loadingContainer.innerHTML = a
}
function hideMainMenuText() {
    userInfoContainer.style.display = "block";
    loadingContainer.style.display = "none"
}
function toggleGameUI(a) {
    gameUiContainer.style.display = a ? "block" : "none"
}
function toggleMenuUI(a) {
    a ? (menuContainer.style.display = "flex",
        darkener.style.display = "block",
        linksContainer.style.display = "block",
        infoContainerM.style.display = "block",
        endBoardContainer.style.display = "none",
        userNameInput.focus(),
        target[2] = 0) : (menuContainer.style.display = "none",
            darkener.style.display = "none",
            linksContainer.style.display = "none",
            infoContainerM.style.display = "none")
}
var tmpPlayer;
function showEndBoard(a) {
    endBoardContainer.style.display = "flex";
    endBoardTable.innerHTML = "";
    var b;
    if (currentMode.recTime) {
        b = "<tr><th>Player</th><th>Best Time</th><th>Total Time</th><th>Kills</th><th>Deaths</th><th>" + currentMode.objName + "</th></tr>";
        for (var c = 0; c < a.length; ++c)
            tmpPlayer = a[c],
                b += "<tr><td style=" + (player && tmpPlayer.id == player.id ? "color:#fff" : "") + "><img src='" + classIcons[tmpPlayer.classIndex] + "' style='width:20px;height:20px;display:inline-block;vertical-align:middle;'> " + tmpPlayer.name + "</td><td>" + tmpPlayer.bestTime + "</td><td>" + tmpPlayer.totalTime + "</td><td>" + tmpPlayer.kills + "</td><td>" + tmpPlayer.deaths + "</td><td>" + tmpPlayer.score + "</td></tr>"
    }
    endBoardTable.innerHTML = b
}
function showModeList() {
    if (modeList)
        if ("block" == modeListView.style.display)
            modeListView.style.display = "none";
        else {
            for (var a = "", b = 0; b < modeList.length; ++b)
                a += "<div onclick='changeMode(" + b + ")' class='modeListItem'>" + modeList[b].name + "</div>";
            modeListView.style.display = "block";
            modeListView.innerHTML = a
        }
}
function changeMode(a) {
    modeList && modeList[a] && a !== modeIndex && (modeListView.style.display = "none",
        modeSelector.innerHTML = modeList[a].name + "<i style='vertical-align: middle;' class='material-icons'>&#xE5C5;</i>",
        window.location.href = modeList[a].url)
}
window.addEventListener("resize", resize);
function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    var a = MathMAX(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
    mainCanvas.width = screenWidth;
    mainCanvas.height = screenHeight;
    mainContext.setTransform(a, 0, 0, a, (screenWidth - maxScreenWidth * a) / 2, (screenHeight - maxScreenHeight * a) / 2)
}
resize();
var targetFPS = 60
    , then = Date.now();
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a, b) {
        window.setTimeout(a, 1E3 / targetFPS)
    }
}();
function callUpdate() {
    requestAnimFrame(callUpdate);
    currentTime = Date.now();
    var a = currentTime - then;
    a > 1E3 / targetFPS && (then = currentTime - a % (1E3 / targetFPS),
        updateGameLoop(a),
        updateMenuLoop(a))
}
callUpdate();

// WebSocket 

const PacketSignature = {
    MODES: 0,
    LOBBY: 1,
    RESPAWN: 2,
    MAP: 3,
    VIEWPORT: 4,
    SPAWN: 5,
    FUEL: 6,
    UPGRADES: 7,
    TARGET: 8,
    UPDATELAP: 9,
    CHAT: 10,
    LEADERBOARD: 11,
    UPDATEPROPERTY: 12,
    SYNCUPDATE: 13,
    SYNCINITIAL: 14,
    KICK: 15,
}

const { Reader, Writer } = window.Binlingo

function setupNewSocket() {
    newsocket.binaryType = "arraybuffer"

    newsocket.addEventListener('open', function (event) {

    });

    newsocket.addEventListener('close', function (event) {
        kickPlayer("Disconnected.");
    });

    newsocket.addEventListener('message', function (event) {
        const reader = new Reader(event.data)
        var sig = reader.readUInt8()
        switch (sig) {
            case PacketSignature.MODES:
                var modes = []
                var modesLength = reader.readUInt8()
                for (let i = 0; i < modesLength; ++i) {
                    modes.push({ name: reader.readZTStringUTF8(), url: reader.readZTStringUTF8() })
                }
                var currentIndex = reader.readUInt8()
                modeList = modes;
                modeSelector.innerHTML = modes[currentIndex].name + "  <i style='vertical-align: middle;' class='material-icons'>&#xE5C5;</i>";
                modeIndex = currentIndex
                break;
            case PacketSignature.LOBBY:
                partyKey = reader.readZTStringUTF8()
                break;
            case PacketSignature.MAP:
                map = {
                    backgroundColor: reader.readZTStringUTF8(),
                    cornerRadius: reader.readInt16(),
                    height: reader.readInt16(),
                    heightH: reader.readInt16(),
                    innerHeight: reader.readInt16(),
                    innerHeightH: reader.readInt16(),
                    innerWidth: reader.readInt16(),
                    innerWidthH: reader.readInt16(),
                    lineColor: reader.readZTStringUTF8(),
                    shape: reader.readZTStringUTF8(),
                    startLine: !!reader.readUInt8(),
                    startLineWidth: reader.readInt16(),
                    trackWidth: reader.readInt16(),
                    trackWidthH: reader.readInt16(),
                    tracksidePadding: reader.readInt16(),
                    wallColor: reader.readZTStringUTF8(),
                    width: reader.readInt16(),
                    widthH: reader.readInt16()
                }
                currentMode = {
                    mapHeight: reader.readInt16(),
                    mapWidth: reader.readInt16(),
                    name: reader.readZTStringUTF8(),
                    objName: reader.readZTStringUTF8(),
                    pointsToWin: reader.readInt16(),
                    recTime: !!reader.readUInt8(),
                    scrText: reader.readZTStringUTF8(),
                    startLine: !!reader.readUInt8(),
                    teams: null,
                    trackWidth: reader.readInt16(),
                    votes: reader.readInt16()
                }
                document.getElementById("notifDisplay").style.display = currentMode.recTime ? "inline-block" : "none";
                document.getElementById("modeVotes0").innerHTML = "(0)"
                break;
            case PacketSignature.VIEWPORT:
                var width = reader.readInt16()
                var height = reader.readInt16()
                var multiplier = Math.round(reader.readFloat() * 10) / 10
                if (viewMult != multiplier) {
                    viewMult = multiplier
                    maxScreenWidth = width * multiplier
                    maxScreenHeight = height * multiplier
                    resize()
                }
                break;
            case PacketSignature.SPAWN:
                var newObject = {
                    id: reader.readZTStringUTF8(),
                    sid: reader.readUInt8(),
                    name: reader.readZTStringUCS2(),
                    team: reader.readUInt8(),
                    special: !!reader.readUInt8(),
                    isPlayer: !!reader.readUInt8(),
                    classIndex: reader.readUInt8(),
                    shape: reader.readZTStringUTF8(),
                    squeeze: reader.readFloat(),
                    maxHealth: reader.readFloat(),
                    health: reader.readFloat(),
                    spawnProt: reader.readUInt8(),
                    turnSpeed: reader.readUInt8(),
                    dead: !!reader.readUInt8(),
                    laps: reader.readUInt8(),
                    x: reader.readFloat(),
                    y: reader.readFloat(),
                    dir: reader.readFloat(),
                    scale: reader.readFloat()
                }
                var isPlayerFlag = !!reader.readUInt8()
                if (objectExists(newObject)) {
                    updateOrPushObject(newObject)
                } else {
                    gameObjects.push(newObject)
                }
                if (isPlayerFlag) {
                    player = newObject
                    gameState = 1
                    toggleMenuUI(false)
                    toggleGameUI(true)
                    mainCanvas.focus()
                }
                break;
            case PacketSignature.FUEL:
                boostDisplay.innerHTML = reader.readUInt8() + " Boost"
                break;
            case PacketSignature.UPGRADES:
                var a = reader.readUInt8()
                var b = reader.readInt16()
                var c = []
                var upgradesLength = reader.readUInt8()
                for (let i = 0; i < upgradesLength; ++i) {
                    c.push({
                        name: reader.readZTStringUTF8(),
                        lvl: reader.readUInt8(),
                        max: reader.readUInt8(),
                        type: reader.readUInt8()
                    })
                }
                null != a && (lapsDisplay.innerHTML = currentMode.objName + " " + a + "/" + currentMode.pointsToWin,
                    currentMode.recTime && addLapInfo(a, 0),
                    1 < a && currentMode.scrText && showNotification(currentMode.scrText));
                upgradesList.innerHTML = "";
                upgradesHeaders.innerHTML = "";
                upgradesInfo.style.display = "none";
                if (0 < b) {
                    for (var d = a = "", e = 0; e < c.length; ++e) {
                        var d = d + ("<div class='upgradeIndx'>" + (e + 1) + "</div>")
                            , f = "";
                        c[e].cost && (f += "(" + c[e].cost + ") ");
                        f = 1 == c[e].type ? f + "<span class='yellow'>use item</span>" : c[e].lvl < c[e].max ? f + ("lvl " + c[e].lvl) : "max level";
                        a += "<div class='upgradeItem'><div class='upgradeTxt'>" + c[e].name + "</div><div class='upgradeNum'>" + f + "</div></div>"
                    }
                    upgradesList.innerHTML = a;
                    upgradesHeaders.innerHTML = d;
                    upgradesInfo.innerHTML = "points available (" + b + ")";
                    upgradesInfo.style.display = "inline-block";
                    $("#upgradesInfo").animate({
                        "font-size": "24px"
                    }, 100).animate({
                        "font-size": "19px"
                    }, 100)
                }
                break;
            case PacketSignature.UPDATELAP:
                var currentLap = reader.readUInt8()
                var progression = reader.readInt32()
                updateLapInfo(currentLap, progression)
                break;
            case PacketSignature.CHAT:
                addChatItem(reader.readZTStringUCS2(), reader.readZTStringUCS2(), !!reader.readUInt8())
                break;
            case PacketSignature.LEADERBOARD:
                var newLeaderboardData = []
                var displayCount = reader.readUInt8()
                for (i = 0; i < displayCount; i++) {
                    newLeaderboardData.push(reader.readUInt8())
                    newLeaderboardData.push("")
                    newLeaderboardData.push(reader.readZTStringUCS2())
                    newLeaderboardData.push(reader.readUInt8())
                }
                console.log(newLeaderboardData)
                getLeaderboardData(newLeaderboardData)
                break;
            case PacketSignature.UPDATEPROPERTY:
                var sid = reader.readUInt8()
                var property = reader.readZTStringUTF8()
                var newValue = reader.readUInt8()
                sid = getPlayerIndex(sid);
                null != sid && (gameObjects[sid][property] = newValue)
                break;
            case PacketSignature.SYNCINITIAL:
                var newObject = {
                    id: reader.readZTStringUTF8(),
                    sid: reader.readUInt8(),
                    name: reader.readZTStringUCS2(),
                    team: reader.readUInt8(),
                    special: !!reader.readUInt8(),
                    isPlayer: !!reader.readUInt8(),
                    classIndex: reader.readUInt8(),
                    shape: reader.readZTStringUTF8(),
                    squeeze: reader.readFloat(),
                    maxHealth: reader.readFloat(),
                    health: reader.readFloat(),
                    spawnProt: reader.readUInt8(),
                    turnSpeed: reader.readUInt8(),
                    dead: !!reader.readUInt8(),
                    laps: reader.readUInt8(),
                    x: reader.readFloat(),
                    y: reader.readFloat(),
                    dir: reader.readFloat(),
                    scale: reader.readFloat(),
                    visible: false,
                }
                updateOrPushObject(newObject)
                delete newObject;
                break;
            case PacketSignature.SYNCUPDATE:
                var b = []
                var updateCount = reader.readUInt8()
                for (let i = 0; i < updateCount; ++i) {
                    b.push(reader.readUInt8())
                    b.push(reader.readFloat())
                    b.push(reader.readFloat())
                    b.push(reader.readFloat())
                }
                for (var c = 0; c < gameObjects.length; ++c)
                    gameObjects[c].visible || (gameObjects[c].forcePos = 1),
                        gameObjects[c].visible = !1;
                for (c = 0; c < b.length;) {
                    var d = getPlayerIndex(b[c]);
                    null != d && (gameObjects[d].x = b[c + 1],
                        gameObjects[d].y = b[c + 2],
                        gameObjects[d].dir = b[c + 3] || gameObjects[d].dir,
                        gameObjects[d].visible = !0);
                    c += 4
                }
                delete b
                break;
            case PacketSignature.KICK:
                kickPlayer(reader.readZTStringUTF8())
                break;
        }
    });
}

function enterGame() {
    if (newsocket) {
        gameOver = false
        showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)])
        const writer = new Writer()
        writer.writeUInt8(PacketSignature.RESPAWN)
        writer.writeZTStringUCS2(userNameInput.value)
        writer.writeUInt8(classIndex)
        newsocket.send(writer.finalize())
        mainCanvas.focus()
    }
}

var sendFrequency = 1000 / 24, lastSent = 0;
function sendTarget(a) {
    var b = currentTime;
    !gameOver && player && !player.dead && (a || b - lastSent > sendFrequency) && (target[1] = MathSQRT(MathPOW(mouseY - screenHeight / 2, 2) + MathPOW(mouseX - screenWidth / 2, 2)),
        target[1] *= MathMIN(maxScreenWidth / screenWidth, maxScreenHeight / screenHeight),
        target[0] = MathATAN2(mouseY - screenHeight / 2, mouseX - screenWidth / 2),
        target[0] = target[0].round(2),
        target[1] = target[1].round(2),
        lastSent = b)
    const writer = new Writer()
    writer.writeUInt8(PacketSignature.TARGET)
    writer.writeFloat(target[0])
    writer.writeFloat(target[1])
    writer.writeUInt8(target[2])
    writer.writeUInt8(target[3])
    if (newsocket.readyState === WebSocket.OPEN) newsocket.send(writer.finalize())
}

function sendChat(msg) {
    const writer = new Writer()
    writer.writeUInt8(PacketSignature.CHAT)
    writer.writeZTStringUCS2(msg)
    if (newsocket.readyState === WebSocket.OPEN) newsocket.send(writer.finalize())
}
