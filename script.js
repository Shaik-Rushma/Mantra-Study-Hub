const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.main-nav');
const form = document.getElementById('contactForm');
const formResponse = document.getElementById('formResponse');
const requestList = document.getElementById('requestList');
const expandableCards = document.querySelectorAll('.expandable-card');

const STORAGE_KEY = 'mantraStudyRequests';

function toggleMenu() {
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }
}

function loadSavedRequests() {
  if (!requestList) return;
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) {
    requestList.innerHTML = '<p class="empty-state">No saved requests yet.</p>';
    return;
  }

  try {
    const requests = JSON.parse(savedData);
    if (!Array.isArray(requests) || requests.length === 0) {
      requestList.innerHTML = '<p class="empty-state">No saved requests yet.</p>';
      return;
    }

    requestList.innerHTML = requests
      .slice(-5)
      .reverse()
      .map((request) => {
        return `
          <div class="request-card">
            <div class="request-meta">
              <strong>${request.name}</strong>
              <span>${request.packageLabel}</span>
            </div>
            <div class="request-details">
              <p><strong>Email:</strong> ${request.email}</p>
              <p><strong>Message:</strong> ${request.message || 'No extra message provided.'}</p>
              <p class="request-time">Submitted: ${new Date(request.submittedAt).toLocaleString()}</p>
            </div>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('Unable to load saved requests', error);
    requestList.innerHTML = '<p class="empty-state">Unable to load saved requests.</p>';
  }
}

function saveRequest(formData) {
  const existing = localStorage.getItem(STORAGE_KEY);
  const savedRequests = existing ? JSON.parse(existing) : [];
  savedRequests.push(formData);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRequests));
}

function handleFormSubmit() {
  if (!form || !formResponse) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const packageValue = form.package.value;
    const message = form.message.value.trim();
    const packageLabel = form.package.options[form.package.selectedIndex].text;

    if (!name || !email || !packageValue) {
      formResponse.textContent = 'Please fill in all required fields.';
      formResponse.style.color = '#dc2626';
      return;
    }

    const requestData = {
      name,
      email,
      package: packageValue,
      packageLabel,
      message,
      submittedAt: new Date().toISOString(),
    };

    saveRequest(requestData);
    loadSavedRequests();

    formResponse.textContent = 'Thank you! Your request has been saved locally.';
    formResponse.style.color = '#16a34a';
    form.reset();
  });
}

function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.main-nav a');
  const currentPage = window.location.pathname.split('/').pop();
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active-link');
    }
  });
}

function initExpandableCourses() {
  expandableCards.forEach((card) => {
    const button = card.querySelector('.expand-btn');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');

      expandableCards.forEach((item) => item.classList.remove('open'));
      expandableCards.forEach((item) => {
        const btn = item.querySelector('.expand-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        card.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

toggleMenu();
handleFormSubmit();
loadSavedRequests();
highlightActiveLink();
initExpandableCourses();
