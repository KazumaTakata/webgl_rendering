function InitEnv(canvasId, urls, callback) {
  window.images = {}
  let counter = 0
  for (let i = 0; i < urls.length; i++) {
    let image = new Image()
    let url = urls[i]
    window.images[url] = image
    image.src = url
    image.onload = function() {
      counter++
      if (counter == urls.length) {
        callback(canvasId)
      }
    }
  }
}

export { InitEnv }
