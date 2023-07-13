document.addEventListener("DOMContentLoaded", function () {
  var helloElement = document.createElement("p");
  helloElement.textContent = "hello";
  document.body.appendChild(helloElement);
  console.log(helloElement);
});
