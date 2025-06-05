(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);

    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 1 },
            992: { items: 2 },
            1200: { items: 2 }
        }
    });

    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0: { items: 1 },
            576: { items: 1 },
            768: { items: 2 },
            992: { items: 3 },
            1200: { items: 4 }
        }
    });

    $(document).ready(function () {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        function updateCartCount() {
            let totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            $('.fa-shopping-bag').siblings('span').text(totalQty);
        }

        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }

        function renderCart() {
            if (!/cart(\.html)?$/.test(window.location.pathname)) return;


            const tbody = $('table tbody');
            tbody.empty();

            cart.forEach((item) => {
                const itemTotal = (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2);
                const row = `
                    <tr data-id="${item.id}">
                        <th scope="row">
                            <div class="d-flex align-items-center">
                                <img src="img/vegetable-item-3.png" class="img-fluid me-5 rounded-circle" style="width: 80px; height: 80px;" alt="">
                            </div>
                        </th>
                        <td>${item.name}</td>
                        <td>${item.price}</td>
                        <td>
                            <div class="quantity">
                                <button class="btn btn-sm btn-minus"><i class="fa fa-minus"></i></button>
                                <input type="text" value="${item.quantity}" min="1" style="width:40px;text-align:center;" readonly>
                                <button class="btn btn-sm btn-plus"><i class="fa fa-plus"></i></button>
                            </div>
                        </td>
                        <td class="item-total">$${itemTotal}</td>
                        <td>
                            <button class="btn btn-md rounded-circle bg-light border mt-4 btn-remove">
                                <i class="fa fa-times text-danger"></i>
                            </button>
                        </td>
                    </tr>
                `;
                tbody.append(row);
            });
        }

        // Inject reusable notification banner container (if not present)
            if ($('#cart-toast').length === 0) {
                $('body').append(`
                    <div id="cart-toast" style="
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        background-color: #28a745;
                        color: #fff;
                        font-weight: bold;
                        text-align: center;
                        padding: 1rem;
                        z-index: 9999;
                        display: none;
                    "></div>
                `);
            }

            // Reusable function to show banner
            function showCartBanner(message) {
                const toast = $('#cart-toast');
                toast.text(`🤩 ${message}`).slideDown();

                setTimeout(() => {
                    toast.slideUp();
                }, 2500);
            }




        // Quantity buttons
        $(document).on('click', '.btn-plus, .btn-minus', function () {
            const row = $(this).closest('tr');
            const itemId = parseInt(row.data('id'));
            const item = cart.find(i => i.id === itemId);

            if (!item) return;

            if ($(this).hasClass('btn-plus')) {
                item.quantity += 1;
            } else {
                item.quantity = Math.max(1, item.quantity - 1);
            }

            saveCart();
            renderCart();
        });

        // Remove button
        $(document).on('click', '.btn-remove', function () {
            const itemId = parseInt($(this).closest('tr').data('id'));
            cart = cart.filter(i => i.id !== itemId);
            saveCart();
            renderCart();
        });

        // Add to Cart
        $(document).on('click', 'a:contains("Add to cart")', function (e) {
            e.preventDefault();
            const $item = $(this).closest('.fruite-item, .product-item');
            const name = $item.find('h4').text();
            const price = $item.find('.fs-5').text();
            let quantity = 1;
            const qtyInput = $item.find('.quantity input');
            if (qtyInput.length) quantity = parseInt(qtyInput.val()) || 1;

            let existing = cart.find(i => i.name === name && i.price === price);
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({
                    id: Date.now(),
                    name,
                    price,
                    quantity
                });
            }

            saveCart();
            showCartBanner(`${name} added to cart! 🎉`);
        });

        // Quantity buttons on product page
        $('.quantity button').on('click', function () {
            var button = $(this);
            var input = button.parent().find('input');
            var oldValue = parseFloat(input.val());
            var newVal;
            if (button.hasClass('btn-plus')) {
                newVal = oldValue + 1;
            } else {
                newVal = (oldValue > 1) ? oldValue - 1 : 1;
            }
            input.val(newVal);
        });

        // ✅ Render dynamic cart items in checkout without breaking shipping/total rows
        if (window.location.pathname.includes('chackout.html')) {
            const tbody = $('table tbody');
            let subtotal = 0;
            // Remove only the product rows (identified by having an <img>)
            tbody.find('tr').each(function () {
                if ($(this).find('img').length) {
                    $(this).remove();
                }
            });
            if (cart.length === 0) {
                const emptyRow = `<tr><td colspan="5" class="text-center py-5">Your cart is empty.</td></tr>`;
                tbody.prepend(emptyRow);
            } else {
                cart.reverse().forEach(item => {
                    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                    const rowSubtotal = price * item.quantity;
                    subtotal += rowSubtotal;
                    const row = `
                        <tr>
                            <th scope="row">
                                <div class="d-flex align-items-center mt-2">
                                    <img src="img/vegetable-item-3.png" class="img-fluid rounded-circle" style="width: 90px; height: 90px;" alt="">
                                </div>
                            </th>
                            <td class="py-5">${item.name}</td>
                            <td class="py-5">${item.price}</td>
                            <td class="py-5">${item.quantity}</td>
                            <td class="py-5">$${rowSubtotal.toFixed(2)}</td>
                        </tr>
                    `;
                    tbody.prepend(row);
                });
                // --- Coupon logic for checkout ---
                let appliedCoupon = null;
                try {
                    // Try to get coupon from localStorage if set in cart page
                    appliedCoupon = localStorage.getItem('appliedCoupon') || null;
                } catch (e) {}
                if (appliedCoupon === 'SAVE10') {
                    let discount = subtotal * 0.10;
                    subtotal = subtotal - discount;
                }
                // ✅ Update Subtotal amount only (label already in HTML)
                $('p:contains("Subtotal")')
                    .closest('tr')
                    .find('td:last-child p')
                    .text(`$${subtotal.toFixed(2)}`);
                // ✅ Default TOTAL = Subtotal (before shipping selected)
                $('p:contains("TOTAL")')
                    .closest('tr')
                    .find('td:last-child p')
                    .text(`$${subtotal.toFixed(2)}`);
                // ✅ Listen for shipping change and update TOTAL
                $(document).on('change', 'input[name="Shipping-1"]', function () {
                    $('input[name="Shipping-1"]').not(this).prop('checked', false);
                    let shipping = 0;
                    if ($('#Shipping-2').is(':checked')) {
                        shipping = 15;
                    } else if ($('#Shipping-3').is(':checked')) {
                        shipping = 8;
                    }
                    const totalWithShipping = subtotal + shipping;
                    $('p:contains("TOTAL")')
                        .closest('tr')
                        .find('td:last-child p')
                        .text(`$${totalWithShipping.toFixed(2)}`);
                });
            }
        }

        // Coupon logic for cart.html
        let appliedCoupon = null;
        $(document).on('click', '#apply-coupon-btn', function() {
            if (!cart || cart.length === 0) {
                showCartBanner('❌ Cannot apply coupon to an empty cart.');
                appliedCoupon = null;
                updateCartSubtotal();
                return;
            }
            var code = $(this).siblings('input[type="text"]').val().trim();
            if (!code) {
                showCartBanner('❌ Please enter a coupon code.');
                appliedCoupon = null;
                updateCartSubtotal();
                return;
            }
            if (code.toUpperCase() === 'SAVE10') {
                appliedCoupon = 'SAVE10';
                localStorage.setItem('appliedCoupon', 'SAVE10');
                showCartBanner('🎉 Coupon applied! 10% discount.');
            } else {
                showCartBanner('❌ Invalid coupon code.');
                appliedCoupon = null;
                localStorage.removeItem('appliedCoupon');
            }
            updateCartSubtotal();
        });

        // Update SubTotal in cart.html to match subtotal logic in checkout.html
        function updateCartSubtotal() {
            if (!window.location.pathname.includes('cart')) return;

            let subtotal = 0;
            cart.forEach(item => {
                const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
                subtotal += price * item.quantity;
            });
            if (appliedCoupon === 'SAVE10') {
                let discount = subtotal * 0.10;
                let newSubtotal = subtotal - discount;
                $('#cart-subtotal').text(`$${newSubtotal.toFixed(2)} (10% discount applied ✔)`);
            } else {
                $('#cart-subtotal').text(`$${subtotal.toFixed(2)}`);
            }
        }
        // Run on page load
        updateCartSubtotal();
        // Also update after cart changes
        $(document).on('click', '.btn-plus, .btn-minus, .btn-remove', function() {
            updateCartSubtotal();
        });

        $(document).on('click', '.fruite-item, .vesitable-item', function (e) {
            // Prevent clicking on "Add to cart" from triggering this
            if ($(e.target).closest('a:contains("Add to cart")').length > 0) return;

            const $item = $(this);
            const name = $item.find('h4').text().trim();
            const price = $item.find('.fs-5').first().text().trim();
            const desc = $item.find('p').first().text().trim();
            const img = $item.find('img').attr('src');
            const category = $item.find('.text-white.bg-secondary, .text-white.bg-primary').first().text().trim();

            const product = { name, price, desc, img, category };

            // Save to localStorage
            localStorage.setItem('selectedProduct', JSON.stringify(product));

            // Redirect to shop-detail page
            window.location.href = 'shop-detail.html';
        });

        if (window.location.pathname.includes('shop-detail.html')) {
            const product = JSON.parse(localStorage.getItem('selectedProduct'));

            if (product) {
                $('.container h4.fw-bold').text(product.name); // product name
                $('p:contains("Category")').text(`Category: ${product.category}`); // category
                $('.container h5.fw-bold').first().text(product.price); // price
                $('.container .row.g-4.mb-5 p').first().text(product.desc); // main description
                $('.container img.img-fluid').first().attr('src', product.img); // image
            }
        }



        renderCart();
        updateCartCount();
    });
})(jQuery);
