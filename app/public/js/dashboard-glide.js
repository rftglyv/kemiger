import Glide from 'https://cdnjs.cloudflare.com/ajax/libs/Glide.js/3.6.0/glide.esm.min.js'

try {
    var dashboardGlide = new Glide('.dashboard-swiper-glide', {
        type: 'carousel',
        startAt: 0,
        perView: 1,
        autoplay: 1000,
        hoverpause: true,
    })

    const targetNode = document.getElementById("addSwiperForm");
    // Options for the observer (which mutations to observe)
    const config = { attributes: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type === "attributes") {
                if (document.getElementById('addSwiperForm').getAttribute('is-updating') == 'false') {
                    dashboardGlide.mount()
                } else {
                    dashboardGlide.destroy()
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
} catch (error) {
    console.log(error)
}