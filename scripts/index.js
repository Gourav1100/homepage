let buttonTimeOutList = [];
let buttonTimeClassMap = {};
let searchBtnTimeoutHandler = -1;
function getDate() {
  const date = new Date();
  // prettier-ignore
  const monthList = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ];
  return `${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`} - ${
    monthList[date.getMonth()]
  } - ${date.getFullYear()}`;
}
function getTime() {
  const time = new Date();
  let hour = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
  hour = hour >= 10 ? hour : `0${hour}`;
  let minutes =
    time.getMinutes() >= 10 ? time.getMinutes() : `0${time.getMinutes()}`;
  let ampm = time.getHours() >= 12 ? "PM" : "AM";
  return `${hour} : ${minutes} ${ampm}`;
}
async function updateDateTime() {
  document.getElementsByClassName("date-container")[0].innerHTML = getDate();
  document.getElementsByClassName("time-container")[0].innerHTML = getTime();
  let time = new Date();
  let prevTimeOut = setTimeout(() => {
    updateDateTime();
    clearTimeout(prevTimeOut);
  }, (60 - time.getSeconds()) * 1000);
}
function loadConfig() {
  const config = localStorage.getItem("config");
  if (config) {
    return JSON.parse(config);
  }
  let initializationObject = {
    links: [],
    username: "User",
    wallpaper: "https://i.imgur.com/lSbtiRw.jpg",
  };
  localStorage.setItem("config", JSON.stringify(initializationObject));
  return initializationObject;
}
function handleusernameupdate() {
  const newUsername = document.getElementsByClassName("username-input-field")[0]
    .value;
  toggleUsername();
  document.getElementsByClassName("username")[0].innerHTML = newUsername;
  const config = JSON.parse(localStorage.getItem("config"));
  config.username = newUsername;
  localStorage.setItem("config", JSON.stringify(config));
}
function enableButton(targetClassName, content) {
  while (buttonTimeOutList.length != 0) {
    clearTimeout(buttonTimeOutList[0]);
    if (buttonTimeClassMap[buttonTimeOutList[0]] != targetClassName) {
      document.getElementsByClassName(
        buttonTimeClassMap[buttonTimeOutList[0]]
      )[0].children[1].style.padding = "0px";
      document.getElementsByClassName(
        buttonTimeClassMap[buttonTimeOutList[0]]
      )[0].children[1].innerHTML = "";
      document.getElementsByClassName(
        buttonTimeClassMap[buttonTimeOutList[0]]
      )[0].children[1].style.width = "0px";
    }
    delete buttonTimeClassMap[buttonTimeClassMap[buttonTimeOutList[0]]];
    delete buttonTimeClassMap[buttonTimeOutList[0]];
    buttonTimeOutList.shift();
  }
  document.getElementsByClassName(
    targetClassName
  )[0].children[1].style.padding = "0px 10px";
  document.getElementsByClassName(targetClassName)[0].children[1].style.width =
    "fit-content";
  document.getElementsByClassName(targetClassName)[0].children[1].innerHTML =
    content;
}
function disableButton(targetClassName) {
  if (!Object.keys(buttonTimeClassMap).find((key) => key == targetClassName)) {
    let timeout = setTimeout(() => {
      var index = buttonTimeOutList.indexOf(timeout);
      if (index > -1) {
        buttonTimeOutList.splice(index, 1);
        delete buttonTimeClassMap[targetClassName];
        delete buttonTimeClassMap[timeout];
        document.getElementsByClassName(
          targetClassName
        )[0].children[1].style.padding = "0px";
        document.getElementsByClassName(
          targetClassName
        )[0].children[1].innerHTML = "";
        document.getElementsByClassName(
          targetClassName
        )[0].children[1].style.width = "0px";
      }
    }, 250);
    buttonTimeClassMap[targetClassName] = true;
    buttonTimeClassMap[timeout] = targetClassName;
    buttonTimeOutList.push(timeout);
  }
}
function toggleUsername() {
  const usernameUpdateField = document.getElementsByClassName(
    "username-update-field"
  )[0];
  const usernameContainer =
    document.getElementsByClassName("username-container")[0];
  document.getElementsByClassName("username-input-field")[0].value = "";
  if (usernameUpdateField.style.visibility == "hidden") {
    usernameUpdateField.style.visibility = "visible";
    usernameUpdateField.style.display = "flex";
    usernameContainer.style.visibility = "hidden";
    usernameContainer.style.display = "none";
  } else if (usernameUpdateField.style.visibility == "visible") {
    usernameUpdateField.style.visibility = "hidden";
    usernameUpdateField.style.display = "none";
    usernameContainer.style.visibility = "visible";
    usernameContainer.style.display = "flex";
  } else {
    usernameUpdateField.style.visibility = "visible";
    usernameUpdateField.style.display = "flex";
    usernameContainer.style.visibility = "hidden";
    usernameContainer.style.display = "none";
  }
}
function changeWallpaperHandler() {
  let image = document.createElement("input");
  image.type = "file";
  image.accept = "image/*";
  image.multiple = false;
  image.onchange = () => {
    var reader = new FileReader();
    reader.onload = function (event) {
      let config = loadConfig();
      config.wallpaper = event.target.result;
      localStorage.setItem("config", JSON.stringify(config));
      let body = document.getElementsByTagName("body")[0];
      body.style.background = `url(${config.wallpaper})`;
      body.style.backgroundPosition = "center";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundSize = "cover";
    };
    reader.readAsDataURL(image.files[0]);
  };
  image.click();
}
function updateSearchBtn(width) {
  if (searchBtnTimeoutHandler != -1) {
    clearTimeout(searchBtnTimeoutHandler);
  }
  if (
    parseInt(width) <
    parseInt(document.getElementsByClassName("search-btn")[0].style.width)
  ) {
    document.getElementsByClassName("search-btn")[0].style.opacity = "0.1";
    document
      .getElementsByClassName("search-btn")[0]
      .addEventListener("mouseover", () => {
        document.getElementsByClassName("search-btn")[0].style.opacity = "1";
      });
    document
      .getElementsByClassName("search-btn")[0]
      .addEventListener("mouseleave", () => {
        document.getElementsByClassName("search-btn")[0].style.opacity = "0.1";
      });
    searchBtnTimeoutHandler = setTimeout(() => {
      document.getElementsByClassName("search-btn")[0].style.width = width;
    }, 1000);
  } else {
    document.getElementsByClassName("search-btn")[0].style.opacity = "1";
    document.getElementsByClassName("search-btn")[0].style.width = width;
  }
}
function addLinkDialogOpen() {
  document.getElementById("dialog-1").open = true;
  document.getElementById("dialog-container-1").style.display = "flex";
}
function closeDialog() {
  document.getElementById("dialog-1").open = false;
  document.getElementById("dialog-form").title.value = "";
  document.getElementById("dialog-form").url.value = "";
  document.getElementById("dialog-container-1").style.display = "none";
}
function saveLink() {
  let saveObject = {
    title: document.getElementById("dialog-form").title.value,
    url: document.getElementById("dialog-form").url.value,
  };
  if (!saveObject.title) {
    return alert("Please enter a valid title.");
  }
  try {
    const source = new URL(saveObject.url).origin;
    saveObject.favicon = `${source}/favicon.ico`;
  } catch (error) {
    console.error("Error:", error);
    return alert("Please provide a valid url.");
  }
  let config = loadConfig();
  config.links.push(saveObject);
  localStorage.setItem("config", JSON.stringify(config));
  closeDialog();
  setHomePage();
}
function handleFormSubmit() {
  let redirectUrl = document.getElementsByClassName("searchbar-container")[0].q
    .value;
  if (redirectUrl.length == 0) {
    return;
  }
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  if (!pattern.test(redirectUrl)) {
    let form = document.createElement("form");
    let q = document.createElement("input");
    q.name = "q";
    q.value = redirectUrl;
    form.method = "get";
    form.action = "https://www.google.com/search";
    form.id = "delete-me-0";
    form.appendChild(q);
    document.body.appendChild(form);
    form.submit();
  } else {
    window.location.href =
      redirectUrl.startsWith("https://") || redirectUrl.startsWith("http://")
        ? redirectUrl
        : `https://${redirectUrl}`;
  }
}
function setHomePage() {
  let config = loadConfig();
  setTimeout(updateDateTime, 0);
  if (!config.username || !config.wallpaper) {
    localStorage.clear();
    config = loadConfig();
  }
  document.getElementsByClassName("username")[0].innerHTML = config.username;
  const body = document.getElementsByTagName("body")[0];
  body.style.background = `url(${config.wallpaper})`;
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundSize = "cover";
  // setup links
  function getButton(index) {
    let spanBtn = document.createElement("div");
    spanBtn.classList.add("nav-btn");
    spanBtn.style.display = "flex";
    spanBtn.style.flexDirection = "column";
    spanBtn.style.justifyContent = "flex-end";
    spanBtn.style.position = "relative";
    spanBtn.style.textAlign = "center";
    let deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.classList.add("material-icons");
    deleteBtn.innerText = "delete_forever";
    deleteBtn.style.fontSize = "20px";
    deleteBtn.style.display = "flex";
    deleteBtn.style.flexDirection = "column";
    deleteBtn.style.justifyContent = "center";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.top = "-6px";
    deleteBtn.style.right = "-6px";
    deleteBtn.style.height = "25px";
    deleteBtn.style.width = "25px";
    deleteBtn.style.background = "white";
    deleteBtn.style.borderRadius = "50%";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.zIndex = "100";
    deleteBtn.style.color = "black";
    deleteBtn.addEventListener("click", () => {
      let config = loadConfig();
      config.links.splice(index, 1);
      localStorage.setItem("config", JSON.stringify(config));
      setHomePage();
    });
    spanBtn.appendChild(deleteBtn);
    let imageContainerChild = document.createElement("div");
    imageContainerChild.style.width = "100%";
    imageContainerChild.style.display = "flex";
    imageContainerChild.style.justifyContent = "center";
    imageContainerChild.style.paddingBottom = "5px";
    let imageChild = document.createElement("img");
    imageChild.style.width = "auto";
    imageChild.style.maxWidth = "64px";
    imageChild.style.minWidth = "48px";
    imageChild.style.height = "auto";
    imageChild.src = config.links[index].favicon;
    imageContainerChild.appendChild(imageChild);
    let titleChild = document.createElement("div");
    titleChild.style.width = "80px";
    titleChild.style.display = "inline-block";
    titleChild.style.overflow = "hidden";
    titleChild.style.whiteSpace = "nowrap";
    titleChild.style.textOverflow = "ellipsis";
    titleChild.style.marginBottom = "10px";
    titleChild.innerText = config.links[index].title;
    spanBtn.appendChild(imageContainerChild);
    spanBtn.appendChild(titleChild);
    spanBtn.addEventListener("click", (event) => {
      [...event.target.classList].indexOf("delete-btn") == -1
        ? (window.location.href = config.links[index].url)
        : null;
    });
    return spanBtn;
  }
  let lastChild =
    document.getElementById("links-container").children[
      document.getElementById("links-container").children.length - 1
    ];
  [...document.getElementById("links-container").children].forEach((child) =>
    document.getElementById("links-container").removeChild(child)
  );
  config.links.forEach((link, index) => {
    document.getElementById("links-container").appendChild(getButton(index));
  });
  document.getElementById("links-container").appendChild(lastChild);
}
setHomePage();
window.onpageshow = () => {
  document.getElementsByClassName("searchbar")[0].value = "";
  document.getElementsByClassName("searchbar")[0].blur();
  document.getElementById("delete-me-0")
    ? document.body.removeChild(document.getElementById("delete-me-0"))
    : null;
};
document
  .getElementsByClassName("btn-0")[0]
  .addEventListener("mouseover", () =>
    enableButton("btn-0", "Change Wallpaper")
  );
document
  .getElementsByClassName("btn-0")[0]
  .addEventListener("mouseleave", () => disableButton("btn-0"));
document
  .getElementsByClassName("btn-0")[0]
  .addEventListener("click", () => changeWallpaperHandler());
document
  .getElementsByClassName("btn-1")[0]
  .addEventListener("mouseover", () =>
    enableButton("btn-1", "Change Search Engine")
  );
document
  .getElementsByClassName("btn-1")[0]
  .addEventListener("mouseleave", () => disableButton("btn-1"));
document
  .getElementsByClassName("username-update-field")[0]
  .addEventListener("submit", () => {
    event.preventDefault();
    handleusernameupdate();
  });
document
  .getElementsByClassName("searchbar-container")[0]
  .addEventListener("submit", () => {
    event.preventDefault();
    handleFormSubmit();
  });
document.getElementById("dialog-form").addEventListener("submit", () => {
  event.preventDefault();
  saveLink();
});
document
  .getElementsByClassName("username-update-icon")[0]
  .addEventListener("click", () => toggleUsername());
document
  .getElementsByClassName("username-update-icon-change")[0]
  .addEventListener("click", () => handleusernameupdate());
document
  .getElementsByClassName("username-update-icon-change")[0]
  .addEventListener("click", () => toggleUsername());
document
  .getElementsByClassName("add-btn")[0]
  .addEventListener("click", () => addLinkDialogOpen());
document
  .getElementById("close-dialog-btn-x")
  .addEventListener("click", () => closeDialog());
document
  .getElementById("save-dialog-btn")
  .addEventListener("click", () => saveLink());
document
  .getElementById("close-dialog-btn")
  .addEventListener("click", () => closeDialog());
document
  .getElementById("searchbar-input")
  .addEventListener("focus", () => updateSearchBtn("144px"));
document
  .getElementById("searchbar-input")
  .addEventListener("focusout", () => updateSearchBtn("60px"));
