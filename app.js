const photos = [
  'https://picsum.photos/id/1015/200/200',
  'https://picsum.photos/id/1016/200/200',
  'https://picsum.photos/id/1021/200/200',
  'https://picsum.photos/id/1025/200/200'
];

const gallery = document.getElementById('photo-gallery');

photos.forEach(src => {
  const img = document.createElement('img');
  img.src = src;
  img.alt = 'Photo';
  gallery.appendChild(img);
});