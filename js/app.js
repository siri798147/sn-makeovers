// SN MAKEOVERS - Application Logic
// Artist: Swetha D | Phone: 8498919974

document.addEventListener('DOMContentLoaded', () => {
  initServiceTabs();
  initPackageBuilder();
  initGalleryFilter();
  initFaqAccordion();
  initMobileMenu();
  initVideoGallery();
});

// 1. Service Tabs Logic
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const servicePanels = document.querySelectorAll('.service-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      servicePanels.forEach(p => p.classList.add('hidden'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      const targetPanel = document.getElementById(target);
      if (targetPanel) {
        targetPanel.classList.remove('hidden');
      }
    });
  });
}

// 2. Package Builder & WhatsApp Generator
const selectedServices = new Set();
const selectedPots = {};
let sareeCount = 1;

function initPackageBuilder() {
  // Service checkboxes
  const checkboxes = document.querySelectorAll('.pkg-checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const val = e.target.value;
      const cat = e.target.getAttribute('data-category');
      const key = JSON.stringify({ category: cat, name: val });
      if (e.target.checked) {
        selectedServices.add(key);
      } else {
        selectedServices.delete(key);
      }
      updatePackageSummary();
    });
  });

  // Marriage Pots custom options
  const potSelects = document.querySelectorAll('.pot-type-select');
  potSelects.forEach(sel => {
    sel.addEventListener('change', (e) => {
      const potName = e.target.getAttribute('data-pot');
      const count = e.target.getAttribute('data-count');
      const val = e.target.value;
      if (val) {
        selectedPots[potName] = { type: val, count: count };
      } else {
        delete selectedPots[potName];
      }
      updatePackageSummary();
    });
  });

  // Saree Folding Quantity
  const minusBtn = document.getElementById('saree-minus');
  const plusBtn = document.getElementById('saree-plus');
  const sareeCountDisplay = document.getElementById('saree-count-display');

  if (minusBtn && plusBtn && sareeCountDisplay) {
    minusBtn.addEventListener('click', () => {
      if (sareeCount > 1) {
        sareeCount--;
        sareeCountDisplay.textContent = sareeCount;
        updatePackageSummary();
      }
    });
    plusBtn.addEventListener('click', () => {
      sareeCount++;
      sareeCountDisplay.textContent = sareeCount;
      updatePackageSummary();
    });
  }

  // Booking Form Submission to WhatsApp
  const bookingBtn = document.getElementById('whatsapp-submit-btn');
  if (bookingBtn) {
    bookingBtn.addEventListener('click', sendWhatsAppBooking);
  }
}

function updatePackageSummary() {
  const summaryList = document.getElementById('summary-items-list');
  const totalCountEl = document.getElementById('total-services-count');
  const emptyNotice = document.getElementById('summary-empty-notice');

  if (!summaryList) return;
  summaryList.innerHTML = '';

  const parsedServices = Array.from(selectedServices).map(item => JSON.parse(item));
  const potsEntries = Object.entries(selectedPots);
  const totalItems = parsedServices.length + potsEntries.length;

  if (totalCountEl) totalCountEl.textContent = totalItems;

  if (totalItems === 0) {
    if (emptyNotice) emptyNotice.style.display = 'block';
    return;
  }
  if (emptyNotice) emptyNotice.style.display = 'none';

  // Group services
  parsedServices.forEach(item => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between text-xs py-1.5 border-b border-amber-900/10';
    li.innerHTML = '<span class="font-medium text-amber-950 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>' + item.name + '</span><span class="text-amber-800/70 text-[11px] uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">' + item.category + '</span>';
    summaryList.appendChild(li);
  });

  // Pots
  potsEntries.forEach(([name, data]) => {
    const li = document.createElement('li');
    li.className = 'flex items-center justify-between text-xs py-1.5 border-b border-amber-900/10';
    li.innerHTML = '<span class="font-medium text-amber-950 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-red-700 inline-block"></span>' + name + ' (' + data.count + ' pcs)</span><span class="text-red-900 text-[11px] bg-red-50 px-2 py-0.5 rounded border border-red-200/50">' + data.type + '</span>';
    summaryList.appendChild(li);
  });
}

function sendWhatsAppBooking() {
  const nameInput = document.getElementById('client-name');
  const eventDateInput = document.getElementById('event-date');
  const occasionInput = document.getElementById('event-occasion');
  const locationInput = document.getElementById('event-location');
  const notesInput = document.getElementById('client-notes');

  const name = nameInput ? nameInput.value.trim() : '';
  const date = eventDateInput ? eventDateInput.value.trim() : 'To be confirmed';
  const occasion = occasionInput ? occasionInput.value : 'Bridal / Event';
  const location = locationInput ? locationInput.value.trim() : 'Not specified';
  const notes = notesInput ? notesInput.value.trim() : '';

  const parsedServices = Array.from(selectedServices).map(item => JSON.parse(item));
  const potsEntries = Object.entries(selectedPots);

  // Group by category
  const categoriesMap = {};
  parsedServices.forEach(srv => {
    if (!categoriesMap[srv.category]) categoriesMap[srv.category] = [];
    categoriesMap[srv.category].push(srv.name);
  });

  // Build message
  let msg = '🌺 *BOOKING INQUIRY - SN MAKEOVERS* 🌺\n';
  msg += '*Artist:* Swetha D\n';
  msg += '---------------------------------------\n';
  msg += '👤 *Client Name:* ' + (name || 'Prospective Bride / Client') + '\n';
  msg += '📅 *Event Date:* ' + date + '\n';
  msg += '🎉 *Occasion:* ' + occasion + '\n';
  if (location && location !== 'Not specified') {
    msg += '📍 *Location / Mandap:* ' + location + '\n';
  }
  msg += '---------------------------------------\n';
  msg += '✨ *SELECTED SERVICES:*\n';

  if (Object.keys(categoriesMap).length === 0 && potsEntries.length === 0) {
    msg += '- Custom Consultation / All Services Discussion\n';
  } else {
    for (const [cat, items] of Object.entries(categoriesMap)) {
      msg += '\n📌 *' + cat.toUpperCase() + ':*\n';
      items.forEach(i => {
        msg += '   • ' + i + '\n';
      });
    }

    if (potsEntries.length > 0) {
      msg += '\n🏺 *TRADITIONAL MARRIAGE POTS & CRAFTS:*\n';
      potsEntries.forEach(([pName, pData]) => {
        msg += '   • ' + pName + ' (' + pData.count + ' pcs) - *Style:* ' + pData.type + '\n';
      });
    }
  }

  // Saree folding note if selected
  const hasBoxFolding = parsedServices.some(s => s.category.toLowerCase().includes('folding') || s.name.toLowerCase().includes('folding'));
  if (hasBoxFolding) {
    msg += '\n📦 *Estimated Sarees to Fold/Pleat:* ' + sareeCount + ' Saree(s)\n';
  }

  if (notes) {
    msg += '\n💬 *Special Requests / Notes:* ' + notes + '\n';
  }

  msg += '\n---------------------------------------\n';
  msg += 'Hello Swetha garu, please let me know your availability and package quote for this date. Thank you!';

  const phone = '918498919974';
  const encodedMsg = encodeURIComponent(msg);
  const whatsappUrl = 'https://wa.me/' + phone + '?text=' + encodedMsg;

  window.open(whatsappUrl, '_blank');
}

// 3. Gallery Filtering
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-900', 'text-amber-100', 'border-amber-700');
        b.classList.add('bg-white', 'text-stone-700');
      });
      btn.classList.add('bg-amber-900', 'text-amber-100', 'border-amber-700');
      btn.classList.remove('bg-white', 'text-stone-700');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 4. FAQ Accordion
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close all
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// 5. Mobile Navigation
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    });
  });
}

// Quick service selection helper
window.selectAndGoToPackage = function(categoryName, serviceName) {
  const checkboxes = document.querySelectorAll('.pkg-checkbox');
  checkboxes.forEach(cb => {
    if (cb.value.toLowerCase() === serviceName.toLowerCase()) {
      cb.checked = true;
      selectedServices.add(JSON.stringify({ category: categoryName, name: serviceName }));
    }
  });
  updatePackageSummary();

  const packageSection = document.getElementById('package-builder');
  if (packageSection) {
    packageSection.scrollIntoView({ behavior: 'smooth' });
  }
};


// 6. Video Gallery & Modal Player Logic
function initVideoGallery() {
  const filterBtns = document.querySelectorAll('.video-filter-btn');
  const videoCards = document.querySelectorAll('.video-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-900', 'text-amber-100', 'border-amber-700');
        b.classList.add('bg-white', 'text-stone-700');
      });
      btn.classList.add('bg-amber-900', 'text-amber-100', 'border-amber-700');
      btn.classList.remove('bg-white', 'text-stone-700');

      const filter = btn.getAttribute('data-filter');
      videoCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal close handlers
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('close-video-modal');
  const modalBackdrop = document.getElementById('video-modal-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });
}

window.openVideoModal = function(videoSrc, title, caption, category) {
  const modal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('modal-video-player');
  const titleEl = document.getElementById('modal-video-title');
  const descEl = document.getElementById('modal-video-desc');
  const badgeEl = document.getElementById('modal-video-badge');
  const waBtn = document.getElementById('modal-video-whatsapp');

  if (!modal || !videoPlayer) return;

  videoPlayer.src = videoSrc;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = caption;
  if (badgeEl) badgeEl.textContent = category;

  if (waBtn) {
    const text = encodeURIComponent('Hello Swetha garu, I saw the video "' + title + '" on your website and would like to inquire about booking/ordering!');
    waBtn.href = 'https://wa.me/918498919974?text=' + text;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  videoPlayer.play().catch(() => {});
};

window.closeVideoModal = function() {
  const modal = document.getElementById('video-modal');
  const videoPlayer = document.getElementById('modal-video-player');

  if (videoPlayer) {
    videoPlayer.pause();
    videoPlayer.src = '';
  }

  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
};
