// Product Gallery Configuration
const galleryImages = [
    { 
        url: 'img/01-NEW-BALANCE-FFSSBNEW0-NEWML2002RC-Grey.webp', 
        title: 'New Balance 2002R Grey',
        price: 2499000,
        sku: 'NEWML2002RC',
        sizes: [40, 41, 42, 43, 44]
    },
    { 
        url: 'img/0888-NEWPV1906ERGRE013-1.webp', 
        title: 'New Balance 1906R Black',
        price: 2799000,
        sku: 'NEWPV1906ERGRE',
        sizes: [39, 40, 41, 42, 43, 44]
    },
    { 
        url: 'img/01-NEW-BALANCE-FFSSBNEWA-NEWPH327CBW-Black.webp', 
        title: 'New Balance 327 Black',
        price: 1599000,
        sku: 'NEWPH327CBW',
        sizes: [38, 39, 40, 41, 42, 43]
    },
    { 
        url: 'img/0888-NEWMS237LGG00G10H-1.webp', 
        title: 'New Balance 237 Men Green/White',
        price: 1499000,
        sku: 'NEWBB550WHT',
        sizes: [40, 41, 42, 43, 44]
    },
    { 
        url: 'img/0888-NEWU1080I13OLI10H-1.webp', 
        title: 'New Balance Fresh Foam X 1080v13 Utility Olive',
        price: 3299000,
        sku: 'NEWM992GRY',
        sizes: [41, 42, 43, 44, 45]
    },
    { 
        url: 'img/0888-NEWU1500PGLGRE11H-1.webp', 
        title: 'New Balance Made in UK 1500 Grey',
        price: 3499000,
        sku: 'NEWM990NV6',
        sizes: [40, 41, 42, 43, 44]
    }
];

// Utility Functions
const utils = {
    formatPrice: (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    },

    createProductCard: (product) => {
        return `
            <div class="card product-card h-100">
                <div class="product-image-wrapper">
                    <img src="${product.url}" alt="${product.title}" class="card-img-top">
                    <div class="product-overlay">
                        <span class="quick-view-btn" data-sku="${product.sku}">Quick View</span>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text price">${utils.formatPrice(product.price)}</p>
                    <div class="size-selector mb-3">
                        <label for="size-${product.sku}">Size:</label>
                        <select class="form-select size-select" id="size-${product.sku}">
                            <option value="">Select Size</option>
                            ${product.sizes.map(size => `<option value="${size}">EU ${size}</option>`).join('')}
                        </select>
                    </div>
                    <button class="btn btn-primary buy-now w-100" 
                            data-sku="${product.sku}" 
                            data-title="${product.title}" 
                            data-price="${product.price}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    },

    showNotification: (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
};

// Shopping Cart Handler
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart') || '[]');
        this.updateCartCount();
    }

    addItem(product, size) {
        const cartItem = {
            sku: product.sku,
            title: product.title,
            price: product.price,
            size: size,
            quantity: 1
        };

        this.items.push(cartItem);
        this.saveCart();
        this.updateCartCount();
        utils.showNotification('Product added to cart!');
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = this.items.length;
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}

// Product Gallery Handler
class ProductGallery {
    constructor() {
        this.cart = new ShoppingCart();
        this.initializeGallery();
        this.attachEventListeners();
    }

    initializeGallery() {
        const galleryContainer = document.getElementById('galleryImages');
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';
        
        galleryImages.forEach(product => {
            const col = document.createElement('div');
            col.className = 'col-md-4 col-sm-6 mb-4';
            col.innerHTML = utils.createProductCard(product);
            galleryContainer.appendChild(col);
        });
    }

    attachEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-now')) {
                this.handleBuyNow(e);
            } else if (e.target.classList.contains('quick-view-btn')) {
                this.handleQuickView(e);
            }
        });
    }

    handleBuyNow(e) {
        const button = e.target;
        const sku = button.dataset.sku;
        const product = galleryImages.find(p => p.sku === sku);
        const sizeSelect = document.getElementById(`size-${sku}`);
        
        if (!sizeSelect.value) {
            utils.showNotification('Please select a size', 'error');
            return;
        }

        this.cart.addItem(product, sizeSelect.value);
    }

    handleQuickView(e) {
        const sku = e.target.dataset.sku;
        const product = galleryImages.find(p => p.sku === sku);
        this.showQuickViewModal(product);
    }

    showQuickViewModal(product) {
        const modalHtml = `
            <div class="modal fade" id="quickViewModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${product.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${product.url}" class="img-fluid" alt="${product.title}">
                                </div>
                                <div class="col-md-6">
                                    <h3 class="mb-3">${utils.formatPrice(product.price)}</h3>
                                    <div class="size-selector mb-3">
                                        <label for="modal-size-${product.sku}">Size:</label>
                                        <select class="form-select" id="modal-size-${product.sku}">
                                            <option value="">Select Size</option>
                                            ${product.sizes.map(size => `<option value="${size}">EU ${size}</option>`).join('')}
                                        </select>
                                    </div>
                                    <button class="btn btn-primary w-100 buy-now" 
                                            data-sku="${product.sku}"
                                            data-title="${product.title}"
                                            data-price="${product.price}">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('quickViewModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
        modal.show();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductGallery();
});