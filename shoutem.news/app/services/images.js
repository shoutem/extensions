export function getArticleImages(article) {
  const { image, gallery } = article;
  const leadImage = image?.url;

  let allImages = [];

  if (leadImage) {
    allImages.push(leadImage);
  }

  if (gallery.length) {
    gallery.map(image => {
      allImages.push(image.url)
    });
  }

  return allImages;
}

