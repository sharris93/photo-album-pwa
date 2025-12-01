const photos = [
  'https://picsum.photos/id/1015/400/400',
  'https://picsum.photos/id/1016/400/400',
  'https://picsum.photos/id/1021/400/400',
  'https://picsum.photos/id/1025/400/400'
];

const gallery = document.getElementById('gallery');
let currentIndex = 0;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let dragging = false;

// Create img elements
photos.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  gallery.appendChild(img);
});

// Touch / drag events
gallery.addEventListener('touchstart', touchStart);
gallery.addEventListener('touchmove', touchMove);
gallery.addEventListener('touchend', touchEnd);

function touchStart(e) {
  startX = e.touches[0].clientX;
  dragging = true;
}

function touchMove(e) {
  if (!dragging) return;
  const currentX = e.touches[0].clientX;
  const diff = currentX - startX;
  currentTranslate = prevTranslate + diff;
  gallery.style.transform = `translateX(${currentTranslate}px)`;
}

function touchEnd() {
  dragging = false;
  const threshold = gallery.offsetWidth / 4;
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -threshold && currentIndex < photos.length - 1) currentIndex++;
  if (movedBy > threshold && currentIndex > 0) currentIndex--;

  setPositionByIndex();
}

function setPositionByIndex() {
  currentTranslate = -currentIndex * gallery.offsetWidth;
  prevTranslate = currentTranslate;
  gallery.style.transform = `translateX(${currentTranslate}px)`;
}

// Resize support
window.addEventListener('resize', setPositionByIndex);