const navLinks = document.querySelectorAll('.navbar-nav .nav-item .nav-link'),
href = window.location.href;

if (href.includes('products')) {
    navLinks[0].classList.add('active');
}else if (href.includes('aboutus')) {
    navLinks[1].classList.add('active');
}else if (href.includes('contact')) {
    navLinks[2].classList.add('active');
}