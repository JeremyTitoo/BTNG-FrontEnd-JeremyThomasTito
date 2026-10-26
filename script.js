
const API_URL = 'https://api-web.dnccudinus.org/api/mobil';

// Element DOM
const carGrid = document.getElementById('car-grid');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const searchInput = document.getElementById('search-input');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');


let carsData = [];


document.addEventListener('DOMContentLoaded', () => {
  fetchCars();
  setupMobileNav();
  setupSearchFilter();
});


async function fetchCars() {
  showState('loading');
  
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Gagal mengambil data. Status: ${response.status}`);
    }
    
    const result = await response.json();
    
  
    carsData = Array.isArray(result) ? result : (result.data || []);
    
    if (carsData.length === 0) {
      showErrorState('Tidak ada data mobil yang ditemukan.');
      return;
    }
    
   
    renderCars(carsData);
    showState('content');
  } catch (error) {
    console.error('API Fetch Error:', error);
    showErrorState('Terjadi kesalahan saat memuat data mobil dari server.');
  }
}

function renderCars(cars) {
  carGrid.innerHTML = '';

  if (cars.length === 0) {
    carGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">Mobil tidak ditemukan.</p>`;
    return;
  }

  cars.forEach(car => {
    const name = car.nama || car.nama_mobil || car.title || 'Mobil Tanpa Nama';
    const price = car.harga ? formatRupiah(car.harga) : 'Hubungi Kami';
    const image = car.gambar || car.image || car.foto || 'https://via.placeholder.com/400x250?text=No+Image';
    const brand = car.merk || car.brand || 'Wowo Cars';
    const year = car.tahun || car.year || 'Terbaru';
    const transmission = car.transmisi || car.transmission || 'Automatic/Manual';

    const card = document.createElement('div');
    card.className = 'car-card';

    card.innerHTML = `
      <div class="car-image-container">
        <img src="${image}" alt="${name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80';">
      </div>
      <div class="car-body">
        <h3 class="car-title">${name}</h3>
        <div class="car-price">${price}</div>
        <div class="car-details">
          <span class="car-detail-item"><i class="fa-solid fa-car"></i> ${brand}</span>
          <span class="car-detail-item"><i class="fa-solid fa-calendar"></i> ${year}</span>
          <span class="car-detail-item"><i class="fa-solid fa-gear"></i> ${transmission}</span>
        </div>
        <div class="car-footer">
          <button class="btn btn-primary btn-block" onclick="alert('Terima kasih! Tim Wowo Cars akan segera menghubungi Anda mengenai. anda siap menghadap ke presiden pukul 3 subuh sambil membawa unit ${name}.')">
            Detail & Pesan
          </button>
        </div>
      </div>
    `;

    carGrid.appendChild(card);
  });
}

function showState(state) {
  if (state === 'loading') {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    carGrid.classList.add('hidden');
  } else if (state === 'content') {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    carGrid.classList.remove('hidden');
  }
}

function showErrorState(msg) {
  loadingState.classList.add('hidden');
  carGrid.classList.add('hidden');
  errorState.classList.remove('hidden');
  errorMessage.textContent = msg;
}

function formatRupiah(number) {
  if (isNaN(number)) return number;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

function setupSearchFilter() {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    const filteredCars = carsData.filter(car => {
      const name = (car.nama || car.nama_mobil || car.title || '').toLowerCase();
      const brand = (car.merk || car.brand || '').toLowerCase();
      return name.includes(searchTerm) || brand.includes(searchTerm);
    });

    renderCars(filteredCars);
  });
}

function setupMobileNav() {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
    });
  });
}