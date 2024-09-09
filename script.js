let distanceX = 0;
let isAnimated = false;
const DISTANCE_LIMIT = 70;
const d = document;

console.log("Inspiration", "https://www.javascript100.dev/01-tinder-swipe");

d.addEventListener("mousedown", dragStart);
d.addEventListener("touchstart", dragStart, { passive: true });

function dragStart(event) {
  if (isAnimated) return;
  const currentCard = event.target.closest(".card");
  if (!currentCard) return;
  const startX = event.pageX ?? event.touches[0].pageX;

  d.addEventListener("mousemove", onMoveCard);
  d.addEventListener("mouseup", onEndDragCard);
  d.addEventListener("touchmove", onMoveCard, { passive: true });
  d.addEventListener("touchend", onEndDragCard, { passive: true });

  function onMoveCard(event) {
    const currentX = event.pageX ?? event.touches[0].pageX;
    distanceX = currentX - startX;
    if (distanceX === 0) return;
    isAnimated = true;
    let degree = distanceX / 13;

    currentCard.style.transform = `translateX(${distanceX}px)
    rotate(${degree}deg)`;

    const opacity = Math.abs(distanceX) / 100;
    const goRight = distanceX > 0;
    const choiceEl = goRight
      ? currentCard.querySelector(".choice.like")
      : currentCard.querySelector(".choice.nope");
    choiceEl.style.opacity = opacity;
  }

  function onEndDragCard(event) {
    d.removeEventListener("mousemove", onMoveCard);
    d.removeEventListener("mouseup", onEndDragCard);
    d.removeEventListener("touchmove", onMoveCard);
    d.removeEventListener("touchend", onEndDragCard);

    let tookDecision = Math.abs(distanceX) >= DISTANCE_LIMIT;

    if (tookDecision) {
      let goRight = distanceX > 0;
      currentCard.classList.add(goRight ? "go-right" : "go-left");
      d.addEventListener("transitionend", () => {
        currentCard.remove();
      });
    } else {
      currentCard.classList.add("reset");
      currentCard.classList.remove("go-right", "go-left");
    }

    d.addEventListener("transitionend", () => {
      currentCard.removeAttribute("style");
      currentCard.classList.remove("reset");
      distanceX = 0;
      isAnimated = false;
    });

    d.querySelectorAll(".choice").forEach((el) => (el.style.opacity = 0));
  }
}
