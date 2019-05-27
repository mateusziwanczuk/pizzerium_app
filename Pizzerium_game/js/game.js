/*********************************************
                FIRST PAGE
*********************************************/

function runFirstPageOfGame() {
  document.querySelector("#aboutBox").addEventListener("click", toggleModal);
  document.querySelector("#aboutLink").addEventListener("click", toggleModal);

  function toggleModal() {
    document
      .querySelector(`#${this.dataset.hide}`)
      .classList.add("u--blur-fadeout");
    document
      .querySelector(`#${this.dataset.show}`)
      .classList.remove("u--blur-fadeout");
  }
  document.querySelector("#checkName").addEventListener("click", clear);

  function clear() {
    const menu = document.querySelector("#menu");
    menu.style.visibility = "hidden";
    const playerNameBox = document.querySelector(".player-name-box");
    playerNameBox.style.display = "none";
  }
  document.getElementById("checkName").addEventListener("click", addName);

  function addName() {
    var name = document.getElementById("playerName").value;
    localStorage.setItem("name", name);
  }

  document
    .querySelector("#exitGame")
    .addEventListener("click", () => location.reload());
  document.getElementById("checkName").addEventListener("click", countPizza);
  document.querySelector("#startGame").addEventListener("click", toggleModal);
  document.querySelector("#scoresBox").addEventListener("click", toggleModal);
  document.querySelector("#scoresLink").addEventListener("click", toggleModal);

  const playerScore = document.querySelector("#scoresList");
  let list = JSON.parse(localStorage.getItem("bestList"));

  if (!list) {
    playerScore.innerHTML = "";
  } else {
    let result = '<table style="width:60%" align:"center"> ';
    list.forEach(
      (item, index) =>
        (result +=
          "<tr><td>" +
          (index + 1) +
          ".</td><td>" +
          item.nick +
          "</td><td>" +
          item.point +
          "p.")
    ) + "</td></tr>";
    playerScore.innerHTML = result + "</table>";
  }
}

/*********************************************
				  3 2 1 PIZZA
  *********************************************/

function countPizza() {
  const $gameContainer = document.querySelector(".game-container");
  const countContainer = document.createElement("div");
  $gameContainer.prepend(countContainer);
  countContainer.classList.add("count-container-pizza");
  let timer = document.createElement("p");
  countContainer.prepend(timer);
  let counter = 4;

  let interval = setInterval(() => {
    counter--;
    timer.textContent = counter;
    if (counter <= 0) {
      clearInterval(interval);
      return (timer.textContent = "START!");
    }
  }, 1000);

  window.setTimeout(function() {
    countContainer.remove();
    // document.querySelector('.game-container').style.display = 'none';
    playGame();
  }, 5000);
}

/*********************************************
				  PIZZA MAKER
  *********************************************/
function playGame() {
  function gameOver() {
    var clearScore = document.querySelector(".score-div");
    clearScore.style.display = "none";
    var clearTime = document.querySelector(".time");
    clearTime.style.display = "none";
    var clearPizza = document.querySelector(".deliver-map");
    clearPizza !== null ? (clearPizza.style.display = "none") : clearPizza;
    var clearIngredientsBox = document.querySelector(".ingredients_box");
    clearIngredientsBox.remove();
    const $pizzaBox = document.querySelector(".pizza");
    $pizzaBox !== null ? $pizzaBox.remove() : $pizzaBox;
    window.onkeyup = null;

    const $gameContainer = document.querySelector(".game-container");
    const scores = document.createElement("div");
    scores.classList.add("scores");

    function saveResult() {
      document.querySelector(".scores").style.display = "none";

      const showScores = document.querySelector("#scoresBox");
      showScores.style.display = "block";
      showScores.style.opacity = "1";
      showScores.style.filter = "none";

      const playerScore = document.querySelector("#scoresList");
      let list = JSON.parse(localStorage.getItem("bestList"));
      if (!list) {
        playerScore.innerHTML = "";
      } else {
        let result = '<table style="width:60%" align:"center"> ';
        list.forEach(
          (item, index) =>
            (result +=
              "<tr><td>" +
              (index + 1) +
              ".</td><td>" +
              item.nick +
              "</td><td>" +
              item.point +
              "p.")
        ) + "</td></tr>";
        playerScore.innerHTML = result + "</table>";
      }
    }

    const scoresText = document.createElement("div");
    var name = localStorage.getItem("name");
    scoresText.innerText = name + " twój wynik to: " + totalScores;

    let list = JSON.parse(localStorage.getItem("bestList"));

    if (!list) {
      localStorage.setItem(
        "bestList",
        JSON.stringify([
          {
            nick: name,
            point: totalScores
          }
        ])
      );
    } else {
      if (list.length > 8) {
        if (list[8].point < totalScores) {
          list.pop();
          list = addNewResultAndSortList(list, name, totalScores);
        }
      } else if (list.length < 9) {
        list = addNewResultAndSortList(list, name, totalScores);
      }
      localStorage.setItem("bestList", JSON.stringify(list));
    }
    function addNewResultAndSortList(list, name, totalScores) {
      list.push({
        nick: name,
        point: totalScores
      });
      return list.sort((a, b) => b.point - a.point);
    }
    const addButton = document.createElement("div");
    addButton.classList.add("save__button");

    addButton.innerText = "Zapisz";
    scores.prepend(addButton);
    scores.prepend(scoresText);

    $gameContainer.prepend(scores);

    document
      .querySelector(".save__button")
      .addEventListener("click", saveResult);
  }

  // Setup timer and total seconds for playing
  const mins = 2;
  let totalSeconds = mins * 60;

  function createTimer() {
    // Create timer HTML
    const $gameContainer = document.querySelector(".game-container");
    const timer = document.createElement("div");
    timer.classList.add("time");
    timer.innerHTML = ":";
    $gameContainer.prepend(timer);
    const minutes = document.createElement("span");
    minutes.textContent = formatTimer(parseInt(totalSeconds / 60));
    timer.prepend(minutes);
    const seconds = document.createElement("span");
    seconds.textContent = formatTimer(totalSeconds % 60);
    timer.append(seconds);

    const counter = setInterval(function() {
      --totalSeconds;
      seconds.textContent = formatTimer(totalSeconds % 60);
      minutes.textContent = formatTimer(parseInt(totalSeconds / 60));
      if (totalSeconds <= 0) {
        seconds.textContent = "00";
        clearInterval(counter);
        gameOver();
      }
    }, 1000);
  }

  function formatTimer(val) {
    let valString = `${val}`;
    if (valString.length < 2) {
      return `0${valString}`;
    } else {
      return valString;
    }
  }
  createTimer();

  // create points
  let totalScores = 0;

  function createScores() {
    const $gameContainer = document.querySelector(".game-container");
    const scoresContainer = document.createElement("div");
    scoresContainer.classList.add("score-div");

    const scoresContainerText = document.createElement("span");
    scoresContainerText.innerText = "Punkty: ";
    scoresContainer.prepend(scoresContainerText);
    scoresContainer.innerHTML = scoresContainerText.innerText;

    const scoresCounter = document.createElement("span");
    scoresCounter.classList.add("score-counter");
    scoresCounter.innerText = 0;
    scoresContainer.append(scoresCounter);
    $gameContainer.prepend(scoresContainer);
    scoresContainer.appendChild(scoresCounter);
  }
  createScores();

  function subtractTime() {
    const minutes = document.querySelector(".time span:nth-child(1)");
    const seconds = document.querySelector(".time span:nth-child(2)");
    seconds.classList.add("wrong-action");
    setTimeout(() => {
      seconds.classList.remove("wrong-action");
    }, 100);
    totalSeconds--;
    seconds.textContent = formatTimer(totalSeconds % 60);
    minutes.textContent = formatTimer(parseInt(totalSeconds / 60));
  }

  // PIZZA GAME is in one big function
  const pizzaGame = function() {
    const winner = document.querySelector(".winner");
    winner ? winner.remove() : winner;

    const $gameContainer = document.querySelector(".game-container");
    const pizzaContainer = document.createElement("div");
    pizzaContainer.classList.add("pizza");
    $gameContainer.prepend(pizzaContainer);
    const box = document.createElement("div");
    box.classList.add("box");
    box.textContent = " ";
    pizzaContainer.prepend(box);

    let ingredientsBox = document.createElement("div");
    ingredientsBox.classList.add("ingredients_box");
    $gameContainer.prepend(ingredientsBox);

    const toDisplay = 20; // level of hardness (how many random element without element fo find)
    let displayIngredients = [];
    let elementsToFind = []; // array of items to find
    let allIngredients;
    const ingredients = [
      { icon: (backgroundImage = "url('img/game/cheese.png')"), id: "ser" },
      {
        icon: (backgroundImage = "url('img/game/mushroom.png')"),
        id: "pieczarki"
      },
      { icon: (backgroundImage = "url('img/game/tomato.png')"), id: "pomidor" },
      { icon: (backgroundImage = "url('img/game/chilli.png')"), id: "chilli" },
      { icon: (backgroundImage = "url('img/game/ham.png')"), id: "szynka" },
      { icon: (backgroundImage = "url('img/game/onion.png')"), id: "cebula" },
      {
        icon: (backgroundImage = "url('img/game/peppers.png')"),
        id: "papryka"
      },
      { icon: (backgroundImage = "url('img/game/rucola.png')"), id: "rukola" },
      { icon: (backgroundImage = "url('img/game/corn.png')"), id: "kukurydza" }
    ];

    function createIngredients() {
      // create elements in total as toDisplay number is
      for (let i = 1; displayIngredients.length < toDisplay - 1; i++) {
        // generate 3 random elements to find
        for (let y = 0; elementsToFind.length < 3; i++) {
          const index = Math.floor(Math.random() * ingredients.length);
          elementsToFind.push(ingredients[index].id);
          displayIngredients.push(ingredients[index]);
        }
        const index = Math.floor(Math.random() * ingredients.length);
        displayIngredients.push(ingredients[index]);
      }
      ingredients.push({
        icon: (backgroundImage = "url('img/game/killer-mushroom.png')"),
        id: "killer"
      });
      displayIngredients.push(ingredients[ingredients.length - 1]);
      ingredients.pop();
      // sort displayIngredient randomly
      displayIngredients.sort(() => 0.5 - Math.random());
      // start creating ingredients
      displayIngredients.forEach(function(ingredient, index) {
        setTimeout(function() {
          totalSeconds <= 0 && pizzaContainer !== null
            ? pizzaContainer.remove()
            : totalSeconds;
          totalSeconds <= 0 && ingredientsBox !== null
            ? ingredientsBox.remove()
            : totalSeconds;
          const ingredientElement = document.createElement("div");
          ingredientElement.classList.add("ingredient");
          ingredientElement.style.backgroundImage = ingredient.icon;
          ingredientElement.dataset.id = ingredient.id;
          ingredientElement.style.top = topLeftRandom();
          ingredientElement.style.left = topLeftRandom();
          pizzaContainer.prepend(ingredientElement);
          addFindingEvent();
        }, index * 100);
      });
    }

    function findElement() {
      const that = this;
      // find element by it's id
      const isFound = elementsToFind.some(
        element => element === that.dataset.id
      );
      // if you found item then remove it

      if (isFound) {
        // remove element from array
        const found = elementsToFind.findIndex(el => el === that.dataset.id);
        elementsToFind.splice(found, 1);
        that.style.left = `calc(${getRandomInt(44, 52)}%)`;
        that.style.top = `calc(${getRandomInt(39, 50)}%)`;
        that.style.animation = `linear`;
        that.removeEventListener("click", findElement);

        // ******************** WINNER ********************
        if (elementsToFind.length === 0) {
          updateScores();
          allIngredients.forEach(removeFindingEvent);
          setTimeout(function() {
            pizzaContainer.remove();
            deliverGame();
          }, 800);
        } else {
          updateScores();
        }
      } else if (that.dataset.id === "killer") {
        allIngredients.forEach(removeFindingEvent);
        clickKillerIngredient();
      } else {
        subtractTime();
        that.classList.add("wrong-click-animation");
        that.addEventListener("animationend", () =>
          that.classList.remove("animation")
        );
      }
    }

    function updateScores() {
      const scoresCounter = document.querySelector(".score-counter");
      totalScores++;
      scoresCounter.innerText = totalScores;
    }

    function clickKillerIngredient() {
      totalSeconds = 0;
      const $loser = document.createElement("div");
      $gameContainer.prepend($loser);
      $loser.classList.add("loser");
      $loser.innerHTML = "Muchomor sromotnikowy! <br> Twój klient nie żyje!";
      setTimeout(() => {
        const ingredientElement = document.querySelectorAll(".ingredient");
        ingredientElement.forEach(el => el.remove());
        $loser.remove();
      }, 4000);
    }

    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function topLeftRandom() {
      let random = getRandomInt(10, 85);
      for (let i = 0; random > 35 && random < 55; i++) {
        random = getRandomInt(10, 85);
      }

      return `${random}%`;
    }

    function addFindingEvent() {
      // If all elements are loaded on page, then add to every element 'click' event with function of finding correct element
      allIngredients = document.querySelectorAll(".ingredient");
      allIngredients.forEach(function(element) {
        element.addEventListener("click", findElement);
      });
    }
    //function for removing event on every displayed element
    function removeFindingEvent(element) {
      element.removeEventListener("click", findElement);
    }

    createIngredients();
    ingredientsBox.textContent = `${elementsToFind[0]}, ${elementsToFind[1]}, ${
      elementsToFind[2]
    }`;
  };

  /***********************************
			   DELIVER GAME
	  ***********************************/

  // DELIVER GAME is in one big function
  const deliverGame = function() {
    const $gameContainer = document.querySelector(".game-container");
    const deliverContainer = document.createElement("div");
    deliverContainer.classList.add("deliver-map");
    $gameContainer.prepend(deliverContainer);
    const car = document.createElement("div");
    car.classList.add("car");
    car.dataset.px = "px";
    const suffix = car.dataset.px;
    deliverContainer.prepend(car);
    let carPositionY;
    let carPositionX;
    let ingredientsBox = document.querySelector(".ingredients_box");
    ingredientsBox.style.display = "none";

    // Div for wrong way effect (red flashback) and for winner effect (full green screen with capture "winner")
    const drivingEffect = document.createElement("div");
    $gameContainer.prepend(drivingEffect);

    const totalWidth = Number(
      getComputedStyle(deliverContainer)
        .getPropertyValue("width")
        .slice(0, -2)
    );
    const totalHeight = Number(
      getComputedStyle(deliverContainer)
        .getPropertyValue("height")
        .slice(0, -2)
    );

    function getCarPosition(axis) {
      axis === "x"
        ? (carPositionX = Number(
            getComputedStyle(document.documentElement)
              .getPropertyValue(`--carPositionX`)
              .slice(0, -2)
          ))
        : (carPositionY = Number(
            getComputedStyle(document.documentElement)
              .getPropertyValue(`--carPositionY`)
              .slice(0, -2)
          ));
    }

    // Starting position and rotate of car
    let deg = 90;
    getCarPosition("y");
    getCarPosition("x");

    function winner() {
      const scoresCounter = document.querySelector(".score-counter");
      totalScores++;
      scoresCounter.innerText = totalScores;
      window.removeEventListener("keydown", addKeys);
      setTimeout(() => {
        drivingEffect.classList.add("winner");
        drivingEffect.textContent = "Brawo!";
        document.documentElement.style.setProperty(
          `--carPositionX`,
          0 + suffix
        );
        document.documentElement.style.setProperty(
          `--carPositionY`,
          0 + suffix
        );
        deliverContainer.remove();
        window.onkeyup = null;
        carPositionX = 0;
        carPositionY = 0;
        setTimeout(() => {
          pizzaGame();
        }, 500);
      }, 500);
    }

    function rideRight() {
      let cordsX = homesCords.some(home => {
        // check if car position would be the same as any home's position and would not be equal to deliver home cords
        return (
          carPositionX + 80 === home.posX &&
          carPositionY === home.posY &&
          !(
            carPositionX + 80 === deliverCords.posX &&
            carPositionY === deliverCords.posY
          )
        );
      });
      if (cordsX) {
        carPositionX;
        subtractTime();
        wrongWay();
      } else {
        car.style.transition = `top 0.5s, left 0.5s, transform 0.1s`;
        deg = 90;
        car.style.transform = `rotate(${deg}deg)`;
        getCarPosition("x");
        if (carPositionX < totalWidth) {
          carPositionX += 80;
          document.documentElement.style.setProperty(
            `--carPositionX`,
            carPositionX + suffix
          );
          if (
            carPositionY === deliverCords.posY &&
            carPositionX === deliverCords.posX
          ) {
            winner();
          }
        }
      }
    }

    function rideLeft() {
      let cordsX = homesCords.some(home => {
        return (
          carPositionX - 80 === home.posX &&
          carPositionY === home.posY &&
          !(
            carPositionX - 80 === deliverCords.posX &&
            carPositionY === deliverCords.posY
          )
        );
      });
      if (cordsX) {
        carPositionX;
        subtractTime();
        wrongWay();
      } else {
        if (deg === 0) {
          car.style.transition = `top 0.5s, left 0.5s, transform 0.1s`;
          car.style.transform = `rotate(-90deg)`;
          setTimeout(() => {
            car.style.transition = `top 0.5s, left 0.5s, transform 0s`;
            deg = 270;
            car.style.transform = `rotate(${deg}deg)`;
          }, 100);
        } else {
          car.style.transition = `top 0.5s, left 0.5s, transform 0.1s`;
          deg = 270;
          car.style.transform = `rotate(${deg}deg)`;
        }
        getCarPosition("x");
        if (carPositionX > 0) {
          carPositionX -= 80;
          document.documentElement.style.setProperty(
            `--carPositionX`,
            carPositionX + suffix
          );
          if (
            carPositionY === deliverCords.posY &&
            carPositionX === deliverCords.posX
          ) {
            winner();
          }
        }
      }
    }

    function rideDown() {
      let cordsY = homesCords.some(home => {
        return (
          carPositionX === home.posX &&
          carPositionY + 80 === home.posY &&
          !(
            carPositionX === deliverCords.posX &&
            carPositionY + 80 === deliverCords.posY
          )
        );
      });
      if (cordsY) {
        carPositionY;
        subtractTime();
        wrongWay();
      } else {
        car.style.transition = `top 0.5s, left 0.5s, transform 0.1s`;
        deg = 180;
        car.style.transform = `rotate(${deg}deg)`;
        getCarPosition("y");
        if (carPositionY + 80 < totalHeight) {
          carPositionY += 80;
          document.documentElement.style.setProperty(
            `--carPositionY`,
            carPositionY + suffix
          );
          if (
            carPositionY === deliverCords.posY &&
            carPositionX === deliverCords.posX
          ) {
            winner();
          }
        }
      }
    }

    function rideTop() {
      let cordsY = homesCords.some(home => {
        return (
          carPositionX === home.posX &&
          carPositionY - 80 === home.posY &&
          !(
            carPositionX === deliverCords.posX &&
            carPositionY - 80 === deliverCords.posY
          )
        );
      });
      if (cordsY) {
        carPositionY;
        subtractTime();
        wrongWay();
      } else {
        if (deg === 270) {
          car.style.transition = `top 0.5s, left 0.5s, transform 0.1s`;
          deg = 360;
          car.style.transform = `rotate(${deg}deg)`;
        } else if (deg === 360) {
          car.style.transition = `top 0.5s, left 0.5s, transform 0s`;
          deg = 0;
          car.style.transform = `rotate(${deg}deg)`;
        } else {
          car.style.transition = `top 0.5s, left 0.5s, transform 0.1s`;
          deg = 0;
          car.style.transform = `rotate(${deg}deg)`;
        }
        getCarPosition("y");
        if (carPositionY > 0) {
          carPositionY -= 80;
          document.documentElement.style.setProperty(
            `--carPositionY`,
            carPositionY + suffix
          );
          if (
            carPositionY === deliverCords.posY &&
            carPositionX === deliverCords.posX
          ) {
            winner();
          }
        }
      }
    }

    function addKeys(e) {
      if (e.keyCode === 39) {
        rideRight();
      } else if (e.keyCode === 40) {
        rideDown();
      } else if (e.keyCode === 37) {
        rideLeft();
      } else if (e.keyCode === 38) {
        rideTop();
      }
    }

    window.onkeyup = addKeys;

    /*********************************************
						  CREATE HOUSES
		  **********************************************/

    function createRow(startX, endX, startY) {
      for (let x = startX; x <= endX; x += 80) {
        const y = startY;
        const home = document.createElement("div");
        home.classList.add("home");
        home.style.setProperty("left", `${x}px`);
        home.style.setProperty("top", `${y}px`);
        deliverContainer.append(home);
      }
    }

    function createColumn(startY, endY, startX) {
      for (let y = startY; y <= endY; y += 80) {
        let x = startX;
        const home = document.createElement("div");
        home.classList.add("home");
        home.style.setProperty("top", `${y}px`);
        home.style.setProperty("left", `${x}px`);
        deliverContainer.append(home);
      }
    }

    createColumn(80, 560, 0);
    createRow(160, 720, 0);
    createColumn(0, 640, 1040);
    createColumn(0, 240, 800);
    createRow(160, 560, 160);
    createColumn(240, 240, 160);
    createRow(160, 320, 400);
    createRow(320, 480, 320);
    createColumn(160, 320, 640);
    createRow(720, 880, 480);
    createRow(800, 880, 400);
    createRow(480, 560, 480);
    createRow(480, 880, 640);
    createRow(880, 880, 240);
    createRow(880, 880, 80);
    createColumn(560, 640, 160);
    createRow(240, 320, 560);

    // Add to every home element class "home"
    const homes = document.querySelectorAll(".home");
    homes.forEach((home, index) => {
      if (index % 2 === 0) {
        home.style.backgroundImage = "url('img/game/bulding-top-2.png')";
      } else if (index % 3 === 0) {
        home.style.backgroundImage = "url('img/game/bulding-top-3.png')";
      }
    });
    // Create empty array for every home's cords (left, top) values
    let homesCords = [];

    // For every homes elements push object with it's index and position
    homes.forEach((home, i) => {
      homesCords.push({
        home: i,
        posY: Number(
          getComputedStyle(home)
            .getPropertyValue("top")
            .slice(0, -2)
        ),
        posX: Number(
          getComputedStyle(home)
            .getPropertyValue("left")
            .slice(0, -2)
        )
      });
    });

    function wrongWay() {
      drivingEffect.classList.add("wrong-way");
      setTimeout(() => {
        drivingEffect.classList.remove("wrong-way");
      }, 100);
    }

    // Choose house to deliver
    function deliverTo() {
      const index = Math.floor(Math.random() * homes.length);
      const deliverTop = Number(
        getComputedStyle(homes[index])
          .getPropertyValue("top")
          .slice(0, -2)
      );
      const deliverLeft = Number(
        getComputedStyle(homes[index])
          .getPropertyValue("left")
          .slice(0, -2)
      );
      const deliverDiv = document.createElement("div");
      deliverDiv.classList.add("deliver");
      deliverDiv.style.setProperty("left", `${deliverLeft}px`);
      deliverDiv.style.setProperty("top", `${deliverTop}px`);
      deliverContainer.append(deliverDiv);
      homes[index].classList.remove("deliver");
      return homesCords[index];
    }
    // Then I refer to that cords when car is driving (above in code)
    const deliverCords = deliverTo();
  };
  pizzaGame();
}

function runGameOnSubmit() {
  const $gameContainer = document.querySelector(".game-container");
  const $body = document.querySelector("body");
  const $website = document.querySelector(".website");
  $website.style.display = "none";
  $body.style.height = "0px";
  $gameContainer.style.display = "flex";
  $gameContainer.style.zIndex = "99999999";
  runFirstPageOfGame();
}

