const urls = [
  'https://res.cloudinary.com/ddpvjld2m/image/upload/v1773407619/looklikestitches/temp/d4zf8xsdaybxedw8qt5h.jpg',
  'https://res.cloudinary.com/ddpvjld2m/image/upload/f_auto,q_auto:best/v1773407619/looklikestitches/temp/abc.png',
  'https://res.cloudinary.com/ddpvjld2m/image/upload/v1773407619/looklikestitches/temp/test_image',
];

urls.forEach(url => {
  const publicIdMatch = url.match(/(looklikestitches\/(?:temp|products)\/[^.]+)/);
  const publicId = publicIdMatch ? publicIdMatch[1] : null;
  console.log({ url, publicId });
});
