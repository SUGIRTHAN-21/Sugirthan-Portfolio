document.addEventListener('DOMContentLoaded', function() {
    const typingText = document.getElementById('typing-text');
    const roleText = 'Aspiring Junior AI/ML Engineer';
    let charIndex = 0;

    function typeRole() {
        if (charIndex < roleText.length) {
            typingText.textContent += roleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeRole, 100);
        }
    }

    setTimeout(typeRole, 500);

    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', function() {
            navMenu.classList.remove('show-menu');
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show-menu');
        });
    });

    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu');
        }
    });

    const sections = document.querySelectorAll('section[id]');

    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(function(section) {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector('.nav__link[href="#' + sectionId + '"]');

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    }

    window.addEventListener('scroll', scrollActive);

    const header = document.getElementById('header');

    function scrollHeader() {
        if (window.scrollY >= 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
    }

    window.addEventListener('scroll', scrollHeader);

    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    const skillBars = document.querySelectorAll('.skill__progress');

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const percentage = entry.target.getAttribute('data-percentage');
                entry.target.style.setProperty('--percentage', percentage + '%');
                entry.target.classList.add('animate');
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(function(bar) {
        skillObserver.observe(bar);
    });

    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    function showToast(message, type) {
        toastMessage.textContent = message;
        toast.className = 'toast show ' + type;

        setTimeout(function() {
            toast.classList.remove('show');
        }, 4000);
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name) {
                showToast('Please enter your name', 'error');
                return;
            }

            if (!email) {
                showToast('Please enter your email', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }

            if (!message) {
                showToast('Please enter your message', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('.form__btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(function(response) {
                return response.json().then(function(data) {
                    return { ok: response.ok, data: data };
                });
            })
            .then(function(result) {
                if (result.ok) {
                    showToast(result.data.message, 'success');
                    contactForm.reset();
                } else {
                    showToast(result.data.message || 'Something went wrong', 'error');
                }
            })
            .catch(function(error) {
                showToast('Failed to send message. Please try again.', 'error');
            })
            .finally(function() {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }

document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Only handle internal anchor links, not mailto: or tel: links
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
            e.preventDefault();
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

    const certificateModal = document.getElementById('certificate-modal');
    const modalImage = document.getElementById('modal-certificate-image');
    const modalClose = document.querySelector('.certificate-modal__close');
    const modalOverlay = document.querySelector('.certificate-modal__overlay');

    function openCertificateModal(imageSrc) {
        modalImage.src = '/static/images/' + imageSrc;
        certificateModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCertificateModal() {
        certificateModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(function() {
            modalImage.src = '';
        }, 300);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeCertificateModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeCertificateModal);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && certificateModal.classList.contains('active')) {
            closeCertificateModal();
        }
    });

    const internshipCertButtons = document.querySelectorAll('.view-internship-cert');
    internshipCertButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const imageFile = this.getAttribute('data-image');
            if (imageFile) {
                openCertificateModal(imageFile);
            }
        });
    });

    const achievementCertButtons = document.querySelectorAll('.view-achievement-cert');
    achievementCertButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const imageFile = this.getAttribute('data-image');
            if (imageFile) {
                openCertificateModal(imageFile);
            }
        });
    });
});