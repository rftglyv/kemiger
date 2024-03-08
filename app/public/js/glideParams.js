import Glide from 'https://cdnjs.cloudflare.com/ajax/libs/Glide.js/3.6.0/glide.esm.min.js'

try {
  var testimonialsGlide = new Glide('.testimonials-glide', {
    type: 'carousel',
    animationTimingFunc: 'ease-in-out',
    animationDuration: 800,
    gap: 0,
    startAt: 0,
    perView: 1,
    autoplay: 3000,
    hoverpause: true,
  }).mount()
} catch (error) {
  console.log(error)
}

try {
  var posterGlide = new Glide('.poster-glide', {
    type: 'carousel',
    animationTimingFunc: 'ease-in-out',
    animationDuration: 800,
    gap: 0,
    startAt: 0,
    perView: 1,
    autoplay: 3000,
    hoverpause: true,
  }).mount()
} catch (error) {
  console.log(error)
}