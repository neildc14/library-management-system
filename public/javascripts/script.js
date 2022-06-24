let navBtn = document.querySelectorAll("a.btn-nav");
let input = document.getElementById("name");
let error = document.getElementById("error");

navBtn.forEach((nav) => {
  nav.addEventListener("mouseover", () => {
    nav.classList.add("btn-primary");
  });
});

navBtn.forEach((nav) => {
  nav.addEventListener("mouseout", () => {
    nav.classList.remove("btn-primary");
  });
});

input.addEventListener("keydown", () => {
  error.remove();
});
