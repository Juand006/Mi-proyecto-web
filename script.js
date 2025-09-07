document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let cart = [];
    const cartBtn = document.getElementById('cartBtn');
    const notification = document.getElementById('notification');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const ctaBtn = document.getElementById('ctaBtn');
    const buyButtons = document.querySelectorAll('.buy-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    const contactLink = document.getElementById('contactLink');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const inicioLink = document.getElementById('inicioLink');
    const cartModal = document.getElementById('cartModal');
    const closeCartModal = document.getElementById('closeCartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Modal de contacto
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Registro de Contacto</h2>
            <form id="contactForm">
                <input type="text" placeholder="Nombre completo" required>
                <input type="email" placeholder="Correo electrónico" required>
                <input type="tel" placeholder="Teléfono">
                <textarea placeholder="Mensaje" rows="4" required></textarea>
                <button type="submit">Enviar</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    const closeModal = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contactForm');
    
    // Animaciones en scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar tarjetas de productos
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Funciones
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    function updateCartDisplay() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBtn.textContent = `🛒 Carrito (${totalItems})`;
    }
    
    function updateCartModal() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            cartTotalAmount.textContent = '0.00';
            return;
        }
        
        const cartHTML = cart.map(item => `
            <div class="cart-item" data-product="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-qty" data-product="${item.name}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-qty" data-product="${item.name}">+</button>
                </div>
                <button class="remove-item" data-product="${item.name}">🗑️</button>
            </div>
        `).join('');
        
        cartItems.innerHTML = cartHTML;
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalAmount.textContent = total.toFixed(2);
        
        // Event listeners para botones del carrito
        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productName = e.target.getAttribute('data-product');
                increaseQuantity(productName);
            });
        });
        
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productName = e.target.getAttribute('data-product');
                decreaseQuantity(productName);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productName = e.target.getAttribute('data-product');
                removeFromCart(productName);
            });
        });
    }
    
    function addToCart(productName, price) {
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: productName,
                price: parseFloat(price),
                quantity: 1
            });
        }
        
        updateCartDisplay();
        showNotification(`¡${productName} agregado al carrito!`);
    }
    
    function increaseQuantity(productName) {
        const item = cart.find(item => item.name === productName);
        if (item) {
            item.quantity += 1;
            updateCartDisplay();
            updateCartModal();
        }
    }
    
    function decreaseQuantity(productName) {
        const item = cart.find(item => item.name === productName);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            updateCartDisplay();
            updateCartModal();
        }
    }
    
    function removeFromCart(productName) {
        const index = cart.findIndex(item => item.name === productName);
        if (index > -1) {
            cart.splice(index, 1);
            updateCartDisplay();
            updateCartModal();
            showNotification(`${productName} eliminado del carrito`);
        }
    }
    
    function clearCart() {
        cart = [];
        updateCartDisplay();
        updateCartModal();
        showNotification('Carrito vaciado');
    }
    
    function scrollToSection(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const elementPosition = section.offsetTop - headerHeight;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
    
    function filterProducts(category) {
        // Remover clase active de todos los botones
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Agregar clase active al botón seleccionado
        const activeBtn = document.querySelector(`[data-filter="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        productCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                // Animación escalonada al mostrar
                setTimeout(() => {
                    if (!card.classList.contains('hidden')) {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }
                }, index * 100);
            } else {
                card.classList.add('hidden');
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
            }
        });
        
        // Mostrar mensaje
        const categoryNames = {
            'all': 'todos los productos',
            'audio': 'productos de audio',
            'perifericos': 'periféricos',
            'monitores': 'monitores',
            'mobiliario': 'mobiliario gaming',
            'streaming': 'equipos de streaming',
            'iluminacion': 'iluminación gaming'
        };
        
        showNotification(`Mostrando ${categoryNames[category] || category}`);
    }
    
    function showAllProducts() {
        filterProducts('all');
        scrollToSection('#productos');
    }
    
    // Event Listeners
    
    // Navegación móvil
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            navLinks.classList.remove('active');
        }
    });
    
    // Botón CTA
    ctaBtn.addEventListener('click', function() {
        scrollToSection('#productos');
    });
    
    // Botón de inicio - mostrar todos los productos
    inicioLink.addEventListener('click', function(e) {
        e.preventDefault();
        showAllProducts();
        setTimeout(() => {
            scrollToSection('#inicio');
        }, 300);
    });
    
    // Botones de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    // Botones de compra
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const price = this.getAttribute('data-price');
            addToCart(productName, price);
            
            // Animación del botón
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Tarjetas de categorías
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProducts(category);
            scrollToSection('#productos');
            
            // Animación de la tarjeta
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Modal de contacto
    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'flex';
    });
    
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('¡Formulario de contacto enviado con éxito!');
        modal.style.display = 'none';
        this.reset();
    });
    
    // Modal del carrito
    cartBtn.addEventListener('click', function() {
        updateCartModal();
        cartModal.style.display = 'flex';
    });
    
    closeCartModal.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    clearCartBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                clearCart();
            }
        }
    });
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`Procesando compra por $${total.toFixed(2)}...`);
            cartModal.style.display = 'none';
            // Aquí podrías integrar con un sistema de pago real
        } else {
            showNotification('El carrito está vacío');
        }
    });
    
    // Cerrar modales al hacer clic fuera del contenido
    [modal, cartModal].forEach(modalElement => {
        modalElement.addEventListener('click', function(e) {
            if (e.target === modalElement) {
                modalElement.style.display = 'none';
            }
        });
    });
    
    // Navegación suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target !== '#inicio') {
                scrollToSection(target);
            }
        });
    });
    
    // Efectos de paralaje suaves
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const floatingElements = document.querySelectorAll('.floating-element');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
    
    // Animación de escritura para el título
    function typeWriter(element, text, speed = 100) {
        element.innerHTML = '';
        let i = 0;
        const timer = setInterval(() => {
            element.innerHTML += text.charAt(i);
            i++;
            if (i > text.length - 1) {
                clearInterval(timer);
            }
        }, speed);
    }
    
    // Inicialización
    updateCartDisplay();
    
    // Animación inicial del logo
    const logo = document.querySelector('.logo');
    logo.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
    
    // Mostrar productos con animación al cargar
    setTimeout(() => {
        productCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 500);
    
    // Easter egg: Konami Code
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Activar modo disco
                document.body.style.animation = 'pulse 0.5s infinite alternate';
                showNotification('🎮 ¡Modo Gamer Activado! 🎮');
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 3000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // Funcionalidad adicional: Búsqueda rápida
    let searchTimeout;
    document.addEventListener('keypress', function(e) {
        // Solo activar si no estamos en un input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            clearTimeout(searchTimeout);
            
            // Mostrar productos que coincidan con la letra presionada
            const letter = e.key.toLowerCase();
            const matchingProducts = Array.from(productCards).filter(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                return title.startsWith(letter);
            });
            
            if (matchingProducts.length > 0) {
                // Resaltar productos que coincidan temporalmente
                matchingProducts.forEach(card => {
                    card.style.borderColor = 'rgba(255, 215, 0, 0.8)';
                    card.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.3)';
                });
                
                searchTimeout = setTimeout(() => {
                    matchingProducts.forEach(card => {
                        card.style.borderColor = '';
                        card.style.boxShadow = '';
                    });
                }, 1000);
            }
        }
    });
    
    // Funcionalidad de favoritos (usando memoria durante la sesión)
    let favorites = [];
    
    function toggleFavorite(productName) {
        const index = favorites.indexOf(productName);
        if (index > -1) {
            favorites.splice(index, 1);
            showNotification(`${productName} eliminado de favoritos`);
        } else {
            favorites.push(productName);
            showNotification(`${productName} agregado a favoritos`);
        }
        updateFavoriteButtons();
    }
    
    function updateFavoriteButtons() {
        productCards.forEach(card => {
            const title = card.querySelector('.product-title').textContent;
            let favoriteBtn = card.querySelector('.favorite-btn');
            
            if (!favoriteBtn) {
                favoriteBtn = document.createElement('button');
                favoriteBtn.className = 'favorite-btn';
                favoriteBtn.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    padding: 0.5rem;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 10;
                `;
                card.querySelector('.product-image').style.position = 'relative';
                card.querySelector('.product-image').appendChild(favoriteBtn);
                
                favoriteBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    toggleFavorite(title);
                });
            }
            
            favoriteBtn.textContent = favorites.includes(title) ? '❤️' : '🤍';
            favoriteBtn.style.transform = favorites.includes(title) ? 'scale(1.2)' : 'scale(1)';
        });
    }
    
    // Inicializar botones de favoritos
    updateFavoriteButtons();
    
    // Funcionalidad de comparación de productos
    let compareList = [];
    
    function addToCompare(productName, price, description) {
        if (compareList.length >= 3) {
            showNotification('Máximo 3 productos para comparar');
            return;
        }
        
        const existingProduct = compareList.find(item => item.name === productName);
        if (existingProduct) {
            showNotification('Producto ya está en comparación');
            return;
        }
        
        compareList.push({ name: productName, price: price, description: description });
        showNotification(`${productName} agregado para comparar (${compareList.length}/3)`);
        updateCompareButton();
    }
    
    function updateCompareButton() {
        let compareBtn = document.getElementById('compareBtn');
        if (!compareBtn && compareList.length > 0) {
            compareBtn = document.createElement('button');
            compareBtn.id = 'compareBtn';
            compareBtn.innerHTML = '🔍 Comparar';
            compareBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(45deg, #ff00f5, #00f5ff);
                border: none;
                padding: 1rem 1.5rem;
                border-radius: 25px;
                color: white;
                cursor: pointer;
                font-weight: bold;
                z-index: 1000;
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            `;
            document.body.appendChild(compareBtn);
            
            compareBtn.addEventListener('click', showCompareModal);
            compareBtn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            compareBtn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
        
        if (compareBtn) {
            if (compareList.length === 0) {
                compareBtn.remove();
            } else {
                compareBtn.innerHTML = `🔍 Comparar (${compareList.length})`;
            }
        }
    }
    
    function showCompareModal() {
        if (compareList.length === 0) return;
        
        const compareModal = document.createElement('div');
        compareModal.className = 'modal';
        compareModal.style.display = 'flex';
        
        const compareHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <button class="close-modal">&times;</button>
                <h2>Comparar Productos</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                    ${compareList.map(product => `
                        <div style="border: 1px solid rgba(0, 245, 255, 0.3); border-radius: 10px; padding: 1rem;">
                            <h3 style="color: #00f5ff; margin-bottom: 0.5rem;">${product.name}</h3>
                            <p style="color: #ff00f5; font-weight: bold; margin-bottom: 0.5rem;">${product.price}</p>
                            <p style="font-size: 0.9rem; opacity: 0.8;">${product.description}</p>
                            <button class="remove-compare" data-product="${product.name}" style="
                                background: rgba(255, 0, 0, 0.2);
                                border: none;
                                color: #ff6b6b;
                                padding: 0.5rem;
                                border-radius: 5px;
                                cursor: pointer;
                                margin-top: 1rem;
                                width: 100%;
                            ">Eliminar</button>
                        </div>
                    `).join('')}
                </div>
                <button style="
                    background: rgba(255, 0, 0, 0.3);
                    border: none;
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 1rem;
                    width: 100%;
                " onclick="clearCompare()">Limpiar Comparación</button>
            </div>
        `;
        
        compareModal.innerHTML = compareHTML;
        document.body.appendChild(compareModal);
        
        // Event listeners para el modal de comparación
        compareModal.querySelector('.close-modal').addEventListener('click', function() {
            compareModal.remove();
        });
        
        compareModal.addEventListener('click', function(e) {
            if (e.target === compareModal) {
                compareModal.remove();
            }
        });
        
        compareModal.querySelectorAll('.remove-compare').forEach(btn => {
            btn.addEventListener('click', function() {
                const productName = this.getAttribute('data-product');
                compareList = compareList.filter(item => item.name !== productName);
                updateCompareButton();
                compareModal.remove();
                showNotification(`${productName} eliminado de comparación`);
            });
        });
        
        // Hacer la función clearCompare global para este contexto
        window.clearCompare = function() {
            compareList = [];
            updateCompareButton();
            compareModal.remove();
            showNotification('Comparación limpiada');
        };
    }
    
    // Agregar botones de comparación a las tarjetas de productos
    productCards.forEach(card => {
        const compareBtn = document.createElement('button');
        compareBtn.innerHTML = '🔍';
        compareBtn.className = 'compare-btn';
        compareBtn.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            color: white;
            font-size: 1rem;
            padding: 0.5rem;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        card.querySelector('.product-image').appendChild(compareBtn);
        
        compareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const title = card.querySelector('.product-title').textContent;
            const price = card.querySelector('.product-price').textContent.replace('', '');
            const description = card.querySelector('.product-description').textContent;
            addToCompare(title, price, description);
        });
        
        compareBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.background = 'rgba(0, 245, 255, 0.3)';
        });
        
        compareBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(0, 0, 0, 0.5)';
        });
    });
    
    // Funcionalidad de vista rápida del producto
    productCards.forEach(card => {
        const quickViewBtn = document.createElement('button');
        quickViewBtn.innerHTML = '👁️';
        quickViewBtn.className = 'quick-view-btn';
        quickViewBtn.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.5);
            border: none;
            color: white;
            font-size: 1rem;
            padding: 0.5rem;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            opacity: 0;
        `;
        
        card.querySelector('.product-image').appendChild(quickViewBtn);
        
        card.addEventListener('mouseenter', function() {
            quickViewBtn.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            quickViewBtn.style.opacity = '0';
        });
        
        quickViewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showQuickView(card);
        });
    });
    
    function showQuickView(productCard) {
        const title = productCard.querySelector('.product-title').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        const description = productCard.querySelector('.product-description').textContent;
        const imgSrc = productCard.querySelector('.product-image img').src;
        
        const quickViewModal = document.createElement('div');
        quickViewModal.className = 'modal';
        quickViewModal.style.display = 'flex';
        
        quickViewModal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <button class="close-modal">&times;</button>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                    <div>
                        <img src="${imgSrc}" alt="${title}" style="width: 100%; border-radius: 10px;">
                    </div>
                    <div>
                        <h2 style="color: #00f5ff; margin-bottom: 1rem;">${title}</h2>
                        <p style="color: #ff00f5; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${price}</p>
                        <p style="margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                        <div style="display: flex; gap: 1rem;">
                            <button class="quick-add-cart" style="
                                background: linear-gradient(45deg, #ff00f5, #00f5ff);
                                border: none;
                                padding: 1rem 1.5rem;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                font-weight: bold;
                                flex: 1;
                            ">Agregar al Carrito</button>
                            <button class="quick-favorite" style="
                                background: rgba(255, 255, 255, 0.1);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                padding: 1rem;
                                border-radius: 8px;
                                color: white;
                                cursor: pointer;
                                font-size: 1.2rem;
                            ">${favorites.includes(title) ? '❤️' : '🤍'}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(quickViewModal);
        
        // Event listeners para vista rápida
        quickViewModal.querySelector('.close-modal').addEventListener('click', function() {
            quickViewModal.remove();
        });
        
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === quickViewModal) {
                quickViewModal.remove();
            }
        });
        
        quickViewModal.querySelector('.quick-add-cart').addEventListener('click', function() {
            const priceValue = price.replace('', '');
            addToCart(title, priceValue);
            quickViewModal.remove();
        });
        
        quickViewModal.querySelector('.quick-favorite').addEventListener('click', function() {
            toggleFavorite(title);
            this.textContent = favorites.includes(title) ? '❤️' : '🤍';
        });
    }
    
    // Funcionalidad de descuentos aleatorios (simulado)
    function applyRandomDiscount() {
        const discountProducts = Array.from(productCards).slice(0, 3);
        discountProducts.forEach(card => {
            const priceElement = card.querySelector('.product-price');
            const originalPrice = parseFloat(priceElement.textContent.replace('', ''));
            const discount = Math.floor(Math.random() * 30) + 10; // 10-40% descuento
            const newPrice = (originalPrice * (100 - discount) / 100).toFixed(2);
            
            priceElement.innerHTML = `
                <span style="text-decoration: line-through; opacity: 0.6;">${originalPrice}</span>
                <span style="color: #00ff00; margin-left: 0.5rem;">${newPrice}</span>
                <div style="background: #00ff00; color: black; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.8rem; margin-top: 0.5rem; display: inline-block;">-${discount}% OFF</div>
            `;
        });
        
        showNotification('¡Ofertas especiales aplicadas! 🔥');
    }
    
    // Aplicar descuentos aleatorios cada 30 segundos (solo para demo)
    setInterval(applyRandomDiscount, 30000);
});