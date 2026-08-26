/* ==========================================================================
   UTAMU Innovation Club - Application Logic
   CLEAN SLATE VERSION — ZERO DUMMY DATA — READY FOR REAL CLUBS & LINKS
   ========================================================================== */

const STORAGE_KEY = 'uic_real_communities_v1';
const ADMIN_PASSWORD = 'Admin@utamu';
const AUTH_SESSION_KEY = 'uic_admin_auth';

// Accent color choices
const ACCENT_COLORS = [
  { name: 'Teal', hex: '#0d9488', bg: '#ccfbf1' },
  { name: 'Gold', hex: '#d97706', bg: '#fef3c7' },
  { name: 'Red', hex: '#e11d48', bg: '#ffe4e6' },
  { name: 'Blue', hex: '#031847', bg: '#dbeafe' },
  { name: 'Emerald', hex: '#059669', bg: '#d1fae5' },
  { name: 'Orange', hex: '#ea580c', bg: '#ffedd5' },
  { name: 'Pink', hex: '#db2777', bg: '#fce7f3' },
  { name: 'Navy', hex: '#0a192f', bg: '#f1f5f9' }
];

// Clean slate: No dummy clubs
let clubs = [];
let selectedIconImage = '';
let selectedColorHex = '#0d9488';
let selectedColorBg = '#ccfbf1';

// DOM Elements
const clubsGrid = document.getElementById('clubsGrid');
const openManageBtn = document.getElementById('openManageBtn');
const closeManageBtn = document.getElementById('closeManageBtn');
const manageModal = document.getElementById('manageModal');
const tabAddBtn = document.getElementById('tabAddBtn');
const tabListBtn = document.getElementById('tabListBtn');
const tabAddContent = document.getElementById('tabAddContent');
const tabListContent = document.getElementById('tabListContent');
const tabCount = document.getElementById('tabCount');
const addClubForm = document.getElementById('addClubForm');
const iconPreview = document.getElementById('iconPreview');
const iconFileInput = document.getElementById('iconFileInput');
const iconUrlInput = document.getElementById('iconUrlInput');
const colorSelectorRow = document.getElementById('colorSelectorRow');
const adminClubsList = document.getElementById('adminClubsList');
const toastMsg = document.getElementById('toastMsg');
const toastText = document.getElementById('toastText');
const passwordModal = document.getElementById('passwordModal');
const passwordForm = document.getElementById('passwordForm');
const passwordInput = document.getElementById('adminPassword');
const passwordError = document.getElementById('passwordError');
const closePasswordBtn = document.getElementById('closePasswordBtn');

// Load Data from LocalStorage
function loadClubs() {
  // Clear any legacy dummy data keys
  localStorage.removeItem('uic_custom_clubs_v2');
  localStorage.removeItem('uic_light_clubs_v1');
  localStorage.removeItem('utamu_clubs');

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      clubs = JSON.parse(stored);
    } catch (e) {
      clubs = [];
    }
  } else {
    clubs = [];
    saveClubs();
  }
}

function saveClubs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clubs));
}

// Update club count in admin tab
function updateClubCounter() {
  if (tabCount) {
    tabCount.textContent = clubs.length;
  }
}

// Render Club Cards (Light Mode)
function renderClubs() {
  if (!clubsGrid) return;

  if (clubs.length === 0) {
    clubsGrid.innerHTML = `
      <div style="text-align: center; padding: 48px 24px; background: #ffffff; border-radius: 18px; border: 2px dashed #cbd5e1; box-shadow: var(--shadow-sm);">
        <div style="width: 52px; height: 52px; margin: 0 auto 12px; background: var(--uic-teal-light); color: var(--uic-teal); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <h3 style="color: var(--uic-navy); margin-bottom: 6px; font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800;">No Communities Added Yet</h3>
        <p style="color: var(--text-secondary); font-size: 0.92rem; max-width: 400px; margin: 0 auto 18px;">Ready to add your real clubs and WhatsApp group links!</p>
        <button type="button" onclick="openModal()" class="form-submit-btn" style="display: inline-block; width: auto; padding: 10px 24px; margin-top: 0;">
          + Add Your First Club
        </button>
      </div>
    `;
    updateClubCounter();
    return;
  }

  clubsGrid.innerHTML = clubs.map(club => {
    const accentColor = club.color || '#0d9488';
    const bgColor = club.bgColor || '#f1f5f9';
    const iconHtml = club.iconImage
      ? `<img src="${escapeHtml(club.iconImage)}" alt="${escapeHtml(club.name)} icon" class="club-icon-img">`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;

    return `
      <div class="club-card" style="--card-accent: ${accentColor}; --icon-bg: ${bgColor};" data-id="${club.id}">
        <!-- Left Colored Accent Stripe -->
        <div class="club-accent-stripe"></div>

        <!-- Club Info & Icon -->
        <div class="club-left">
          <div class="club-icon-box">
            ${iconHtml}
          </div>
          <div class="club-details">
            <h3 class="club-name">${escapeHtml(club.name)}</h3>
            <p class="club-desc">
              <span class="club-dot"></span>
              ${escapeHtml(club.desc || 'WhatsApp Community · Free to join')}
            </p>
          </div>
        </div>

        <!-- Green WhatsApp Join Button -->
        <a href="${escapeHtml(club.link)}" target="_blank" rel="noopener noreferrer" class="join-btn" onclick="event.stopPropagation();">
          <svg viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Join
        </a>
      </div>
    `;
  }).join('');

  updateClubCounter();
  renderAdminClubsList();
}

// Render Admin Existing Clubs Tab
function renderAdminClubsList() {
  if (!adminClubsList) return;

  if (clubs.length === 0) {
    adminClubsList.innerHTML = `<p style="color: #64748b; font-size: 0.88rem; padding: 12px 0;">No clubs added yet.</p>`;
    return;
  }

  adminClubsList.innerHTML = clubs.map(club => {
    const thumbHtml = club.iconImage
      ? `<img src="${escapeHtml(club.iconImage)}" alt="" class="admin-club-thumb">`
      : '';
    return `
      <div class="admin-club-row">
        <div class="admin-club-info">
          <div class="admin-club-name">${thumbHtml}${escapeHtml(club.name)}</div>
          <div class="admin-club-link">${escapeHtml(club.link)}</div>
        </div>
        <button type="button" class="admin-club-delete" onclick="removeClub('${club.id}')">
          Delete
        </button>
      </div>
    `;
  }).join('');
}

// Delete Club Action
window.removeClub = function (clubId) {
  const target = clubs.find(c => c.id === clubId);
  if (!target) return;

  if (confirm(`Are you sure you want to delete "${target.name}"?`)) {
    clubs = clubs.filter(c => c.id !== clubId);
    saveClubs();
    renderClubs();
    showToast(`Deleted "${target.name}"`);
  }
};

// Image Icon Handling
function updateIconPreview() {
  if (!iconPreview) return;
  if (selectedIconImage) {
    iconPreview.innerHTML = `<img src="${selectedIconImage}" alt="Selected icon">`;
    iconPreview.classList.add('has-image');
  } else {
    iconPreview.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <span>No image selected</span>`;
    iconPreview.classList.remove('has-image');
  }
}

if (iconFileInput) {
  iconFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      selectedIconImage = ev.target.result;
      if (iconUrlInput) iconUrlInput.value = '';
      updateIconPreview();
    };
    reader.readAsDataURL(file);
  });
}

if (iconUrlInput) {
  iconUrlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
      selectedIconImage = url;
      if (iconFileInput) iconFileInput.value = '';
      updateIconPreview();
    } else {
      selectedIconImage = '';
      updateIconPreview();
    }
  });
}

// Render Color Palette in Admin
function renderColorSelector() {
  if (!colorSelectorRow) return;
  colorSelectorRow.innerHTML = ACCENT_COLORS.map(c => `
    <button type="button" class="color-swatch-btn ${c.hex === selectedColorHex ? 'selected' : ''}" 
            style="background-color: ${c.hex};" 
            title="${c.name}" 
            onclick="setColorChoice('${c.hex}', '${c.bg}')">
    </button>
  `).join('');
}

window.setColorChoice = function (hex, bg) {
  selectedColorHex = hex;
  selectedColorBg = bg;
  renderColorSelector();
};

// Add New Club Form Handler
if (addClubForm) {
  addClubForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('newClubName');
    const linkInput = document.getElementById('newClubLink');
    const descInput = document.getElementById('newClubDesc');

    const name = nameInput.value.trim();
    const link = linkInput.value.trim();
    const desc = descInput.value.trim() || 'WhatsApp Community · Free to join';

    if (!name || !link) {
      showToast('Please fill in required fields');
      return;
    }

    const newClub = {
      id: 'club_' + Date.now(),
      name: name,
      desc: desc,
      link: link,
      iconImage: selectedIconImage || '',
      color: selectedColorHex,
      bgColor: selectedColorBg
    };

    clubs.push(newClub);
    saveClubs();
    renderClubs();

    nameInput.value = '';
    linkInput.value = '';
    descInput.value = 'WhatsApp Community · Free to join';
    selectedIconImage = '';
    if (iconFileInput) iconFileInput.value = '';
    if (iconUrlInput) iconUrlInput.value = '';
    updateIconPreview();

    closeModal();
    showToast(`Added "${name}" successfully!`);
  });
}

// Modal Tabs
if (tabAddBtn && tabListBtn) {
  tabAddBtn.addEventListener('click', () => {
    tabAddBtn.classList.add('active');
    tabListBtn.classList.remove('active');
    tabAddContent.style.display = 'block';
    tabListContent.style.display = 'none';
  });

  tabListBtn.addEventListener('click', () => {
    tabListBtn.classList.add('active');
    tabAddBtn.classList.remove('active');
    tabAddContent.style.display = 'none';
    tabListContent.style.display = 'block';
    renderAdminClubsList();
  });
}

// Modal Open/Close
window.openModal = function () {
  if (sessionStorage.getItem(AUTH_SESSION_KEY) === 'true') {
    showAdminModal();
  } else {
    showPasswordModal();
  }
};

function showPasswordModal() {
  if (!passwordModal) return;
  passwordModal.classList.add('active');
  if (passwordInput) {
    passwordInput.value = '';
    passwordInput.focus();
  }
  if (passwordError) passwordError.style.display = 'none';
}

function showAdminModal() {
  if (!manageModal) return;
  manageModal.classList.add('active');
  selectedIconImage = '';
  if (iconFileInput) iconFileInput.value = '';
  if (iconUrlInput) iconUrlInput.value = '';
  updateIconPreview();
  renderColorSelector();
  renderAdminClubsList();
}

window.closeModal = function () {
  if (!manageModal) return;
  manageModal.classList.remove('active');
};

if (openManageBtn) openManageBtn.addEventListener('click', openModal);
if (closeManageBtn) closeManageBtn.addEventListener('click', closeModal);

if (passwordForm) {
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = passwordInput.value.trim();
    if (entered === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
      passwordModal.classList.remove('active');
      showAdminModal();
    } else {
      passwordError.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
}

if (closePasswordBtn) {
  closePasswordBtn.addEventListener('click', () => {
    passwordModal.classList.remove('active');
  });
}

if (passwordModal) {
  passwordModal.addEventListener('click', (e) => {
    if (e.target === passwordModal) passwordModal.classList.remove('active');
  });
}

if (manageModal) {
  manageModal.addEventListener('click', (e) => {
    if (e.target === manageModal) closeModal();
  });
}

// Toast
function showToast(message) {
  if (!toastMsg) return;
  toastText.textContent = message;
  toastMsg.classList.add('show');
  setTimeout(() => {
    toastMsg.classList.remove('show');
  }, 3000);
}

// HTML Escape
function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadClubs();
  renderClubs();
  renderColorSelector();
});

if (document.readyState !== 'loading') {
  loadClubs();
  renderClubs();
  renderColorSelector();
}
