let navBtn = document.querySelectorAll("a.btn-nav");

navBtn.forEach((nav) => {
  nav.addEventListener(
    "mouseover",
    () => {
      nav.classList.add("btn-primary");
    },
    true
  );
});

navBtn.forEach((nav) => {
  nav.addEventListener(
    "mouseout",
    () => {
      nav.classList.remove("btn-primary");
    },
    false
  );
});
