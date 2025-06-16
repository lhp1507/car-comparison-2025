document.addEventListener('DOMContentLoaded', () => {
    // Car data structure
    const cars = [
        {
            id: 'vios',
            name: 'Toyota Vios 2025',
            price: 480000000,
            brand: 'toyota',
            specs: {
                dimensions: ['4425 x 1730 x 1475 mm', '2550 mm', '133 mm'],
                engine: ['1.5L DOHC Dual VVT-i', '107 hp', '140 Nm'],
                features: ['7 túi khí', 'ABS, EBD, BA', 'Camera lùi'],
                price: ['480.000.000 VNĐ', '550.000.000 VNĐ', '3.000.000 VNĐ/lần']
            },
            image: 'assets/vios.jpg',
            rating: 4.5,
            reviews: [
                { user: 'Minh Anh', text: 'Xe bền bỉ, tiết kiệm nhiên liệu', rating: 5 },
                { user: 'Hoàng Nam', text: 'Thiết kế đẹp, vận hành êm ái', rating: 4 }
            ]
        },
        {
            id: 'city',
            name: 'Honda City 2025',
            price: 529000000,
            brand: 'honda',
            specs: {
                dimensions: ['4553 x 1748 x 1467 mm', '2600 mm', '135 mm'],
                engine: ['1.5L DOHC i-VTEC', '119 hp', '145 Nm'],
                features: ['6 túi khí', 'ABS, EBD, VSA', 'Camera lùi đa góc'],
                price: ['529.000.000 VNĐ', '600.000.000 VNĐ', '3.500.000 VNĐ/lần']
            },
            image: 'assets/city.jpg',
            rating: 4.3,
            reviews: [
                { user: 'Thu Hà', text: 'Không gian rộng rãi, vận hành mạnh mẽ', rating: 4 },
                { user: 'Đức Anh', text: 'Trang bị an toàn đầy đủ', rating: 4.5 }
            ]
        },
        {
            id: 'accent',
            name: 'Hyundai Accent 2025',
            price: 499000000,
            brand: 'hyundai',
            specs: {
                dimensions: ['4440 x 1729 x 1470 mm', '2600 mm', '140 mm'],
                engine: ['1.4L Kappa MPI', '100 hp', '132 Nm'],
                features: ['6 túi khí', 'ABS, EBD, ESC', 'Camera lùi'],
                price: ['499.000.000 VNĐ', '570.000.000 VNĐ', '3.200.000 VNĐ/lần']
            },
            image: 'assets/accent.jpg',
            rating: 4.4,
            reviews: [
                { user: 'Văn Minh', text: 'Tiết kiệm nhiên liệu, giá tốt', rating: 4.5 },
                { user: 'Mai Lan', text: 'Thiết kế hiện đại, nhiều tính năng', rating: 4.3 }
            ]
        }
    ];

    // Feature categories for comparison
    const featureCategories = {
        dimensions: {
            title: 'KÍCH THƯỚC & TRỌNG LƯỢNG',
            features: ['Dài x Rộng x Cao', 'Chiều dài cơ sở', 'Khoảng sáng gầm']
        },
        engine: {
            title: 'ĐỘNG CƠ & VẬN HÀNH',
            features: ['Động cơ', 'Công suất tối đa', 'Mô-men xoắn cực đại']
        },
        features: {
            title: 'TÍNH NĂNG AN TOÀN',
            features: ['Số túi khí', 'Hệ thống phanh', 'Camera lùi']
        },
        price: {
            title: 'GIÁ & CHI PHÍ',
            features: ['Giá niêm yết', 'Chi phí lăn bánh', 'Chi phí bảo dưỡng']
        }
    };

    // Initialize components
    initializeFilters();
    initializeCarGrid();
    createComparisonTable();
    initializeReviews();

    function initializeFilters() {
        const filterSection = document.getElementById('filters');
        const brands = [...new Set(cars.map(car => car.brand))];
        
        const filters = [
            { id: 'all', text: 'Tất cả' },
            ...brands.map(brand => ({
                id: brand,
                text: brand.charAt(0).toUpperCase() + brand.slice(1)
            }))
        ];

        const filterHTML = filters.map(filter => `
            <button class="filter-btn ${filter.id === 'all' ? 'active' : ''}" 
                    data-filter="${filter.id}">
                ${filter.text}
            </button>
        `).join('');
        
        filterSection.innerHTML = filterHTML;
        
        // Add filter event listeners
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn')
                    .forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterCars(button.dataset.filter);
            });
        });
    }

    function initializeCarGrid() {
        const compareSection = document.getElementById('compare');
        const carGrid = document.createElement('div');
        carGrid.className = 'car-grid';
        
        const carsHTML = cars.map(car => `
            <div class="car-card" data-brand="${car.brand}">
                <img src="${car.image}" alt="${car.name}" loading="lazy">
                <div class="car-info">
                    <h3>${car.name}</h3>
                    <div class="car-rating">
                        ${'★'.repeat(Math.floor(car.rating))}
                        ${car.rating % 1 ? '½' : ''}
                        ${'☆'.repeat(5 - Math.ceil(car.rating))}
                        <span>${car.rating.toFixed(1)}</span>
                    </div>
                    <p class="car-price">Giá từ: ${formatPrice(car.price)} VNĐ</p>
                    <button class="compare-btn" data-car-id="${car.id}">
                        So sánh
                    </button>
                </div>
            </div>
        `).join('');
        
        carGrid.innerHTML = carsHTML;
        compareSection.insertBefore(carGrid, compareSection.firstChild);
        
        // Add compare button event listeners
        document.querySelectorAll('.compare-btn').forEach(button => {
            button.addEventListener('click', () => {
                const carId = button.dataset.carId;
                toggleCarComparison(carId);
            });
        });
    }

    function createComparisonTable() {
        const compareSection = document.getElementById('compare');
        const table = document.createElement('div');
        table.className = 'comparison-table-container';
        
        const selectedCars = cars.slice(0, 3); // Initially show first 3 cars
        
        const tableHTML = `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Thông số</th>
                        ${selectedCars.map(car => `
                            <th>
                                <img src="${car.image}" alt="${car.name}" class="car-thumb">
                                <span>${car.name}</span>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(featureCategories).map(([category, {title, features}]) => `
                        <tr class="category-header">
                            <th colspan="${selectedCars.length + 1}">${title}</th>
                        </tr>
                        ${features.map((feature, index) => `
                            <tr>
                                <td>${feature}</td>
                                ${selectedCars.map(car => 
                                    `<td>${car.specs[category][index]}</td>`
                                ).join('')}
                            </tr>
                        `).join('')}
                    `).join('')}
                </tbody>
            </table>
        `;
        
        table.innerHTML = tableHTML;
        compareSection.appendChild(table);
    }

    function initializeReviews() {
        const reviewsSection = document.getElementById('reviews');
        const reviewsHTML = `
            <div class="reviews-header">
                <h2>Đánh giá từ người dùng</h2>
                <div class="reviews-filter">
                    <button class="reviews-filter-btn active" data-rating="all">Tất cả</button>
                    ${[5,4,3].map(rating => `
                        <button class="reviews-filter-btn" data-rating="${rating}">
                            ${rating} ★
                        </button>
                    `).join('')}
                </div>
            </div>
            <div class="reviews-grid">
                ${cars.flatMap(car => 
                    car.reviews.map(review => `
                        <div class="review-card" data-rating="${review.rating}">
                            <div class="review-header">
                                <div class="review-user">
                                    <span class="user-avatar">${review.user.charAt(0)}</span>
                                    <span class="user-name">${review.user}</span>
                                </div>
                                <div class="review-rating">
                                    ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                                </div>
                            </div>
                            <p class="review-text">${review.text}</p>
                            <div class="review-car">
                                <img src="${car.image}" alt="${car.name}" class="car-thumb">
                                <span>${car.name}</span>
                            </div>
                        </div>
                    `).join('')
                )}
            </div>
        `;
        
        reviewsSection.innerHTML = reviewsHTML;
        
        // Add review filter event listeners
        document.querySelectorAll('.reviews-filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.reviews-filter-btn')
                    .forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterReviews(button.dataset.rating);
            });
        });
    }

    function filterCars(filter) {
        document.querySelectorAll('.car-card').forEach(card => {
            card.style.display = 
                (filter === 'all' || card.dataset.brand === filter) ? 'block' : 'none';
        });
    }

    function filterReviews(rating) {
        document.querySelectorAll('.review-card').forEach(card => {
            card.style.display = 
                (rating === 'all' || card.dataset.rating === rating) ? 'block' : 'none';
        });
    }

    function toggleCarComparison(carId) {
        // Implementation for comparison toggle
        console.log(`Toggle comparison for car: ${carId}`);
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price);
    }
});