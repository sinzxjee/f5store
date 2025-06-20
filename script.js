window.addEventListener("DOMContentLoaded", () => {
  fetch("header.html").then(res => res.text()).then(data => {
    document.getElementById("header-placeholder").innerHTML = data;

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const loginBtn = document.querySelector(".icon-login");
    const registerBtn = document.querySelector(".icon-register");
    const accountBtn = document.querySelector(".icon-account");
    const logoutBtn = document.querySelector(".icon-logout");
    const cartBtn = document.querySelector(".icon-cart");

    if (isLoggedIn) {
      loginBtn?.style.setProperty("display", "none");
      registerBtn?.style.setProperty("display", "none");
      accountBtn?.style.setProperty("display", "inline-flex");
      logoutBtn?.style.setProperty("display", "inline-flex");
      cartBtn?.style.setProperty("display", "inline-flex");
    } else {
      loginBtn?.style.setProperty("display", "inline-flex");
      registerBtn?.style.setProperty("display", "inline-flex");
      accountBtn?.style.setProperty("display", "none");
      logoutBtn?.style.setProperty("display", "none");
      cartBtn?.style.setProperty("display", "inline-flex");
    }

    logoutBtn?.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "homePage.html";
    });

    cartBtn?.addEventListener("click", (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        alert("Vui lòng đăng nhập để xem giỏ hàng!");
        window.location.href = "signInup.html";
      } else {
        window.location.href = "cart.html";
      }
    });

    updateCartIconCount();
  });

  fetch("footer.html").then(res => res.text()).then(data => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });

  let voucherApplied = false;

  function getCartFromStorage() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCartToStorage(cartData) {
    localStorage.setItem("cart", JSON.stringify(cartData));
  }

  function updateCartIconCount() {
    const cart = getCartFromStorage();
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) cartCountElement.innerText = `(${cartCount})`;
  }

  function addToCart(name, img, price) {
    const cart = getCartFromStorage();
    const existing = cart.find(item => item.name === name && item.image === img);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, image: img, price, quantity: 1 });
    }
    saveCartToStorage(cart);
    updateCartIconCount();
  }

  window.addToCartFromNewArrival = function (name, img, priceText) {
    const price = parseInt(priceText.replace(/\D/g, ''));
    addToCart(name, img, price);
    window.location.href = "cart.html";
  };

  window.addToCartFromBestseller = function (element) {
    const card = element.closest('.product-card');
    if (!card) return;
    const name = card.querySelector('h3')?.innerText.trim();
    const img = card.querySelector('img')?.getAttribute('src');
    const priceText = card.querySelector('.price')?.childNodes[0]?.textContent.trim();
    const price = parseInt(priceText.replace(/\D/g, ''));
    if (!name || !img || !price) return;
    addToCart(name, img, price);
    window.location.href = "cart.html";
  };

  function setupNewArrival() {
    const products = [
      { img: 'https://via.placeholder.com/300x400?text=SP1', name: 'Áo New 1', price: '500.000₫', old: '700.000₫' },
      { img: 'https://via.placeholder.com/300x400?text=SP2', name: 'Áo New 2', price: '450.000₫', old: '650.000₫' },
      { img: 'https://via.placeholder.com/300x400?text=SP3', name: 'Áo New 3', price: '600.000₫', old: '850.000₫' },
      { img: 'https://via.placeholder.com/300x400?text=SP4', name: 'Áo New 4', price: '550.000₫', old: '750.000₫' },
      { img: 'https://via.placeholder.com/300x400?text=SP5', name: 'Áo New 5', price: '700.000₫', old: '900.000₫' },
      { img: 'https://via.placeholder.com/300x400?text=SP6', name: 'Áo New 6', price: '800.000₫', old: '1.000.000₫' }
    ];

    let currentIndex = 0;
    const itemsPerPage = 3;
    const grid = document.getElementById('newArrivalGrid');
    const nextBtn = document.getElementById('nextArrivalBtn');
    const prevBtn = document.getElementById('prevArrivalBtn');

    function renderProducts() {
      if (!grid) return;
      grid.innerHTML = '';
      const visible = products.slice(currentIndex, currentIndex + itemsPerPage);
      visible.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${p.img}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p class="price">${p.price} <span class="compare-price">${p.old}</span></p>
          <a href="#" class="btn-buy" onclick="addToCartFromNewArrival('${p.name}', '${p.img}', '${p.price}')">Mua hàng</a>
        `;
        grid.appendChild(card);
      });
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex + itemsPerPage >= products.length;
    }

    nextBtn?.addEventListener('click', () => {
      if (currentIndex + itemsPerPage < products.length) currentIndex++;
      else currentIndex = 0;
      renderProducts();
    });

    prevBtn?.addEventListener('click', () => {
      if (currentIndex > 0) currentIndex--;
      else currentIndex = products.length - itemsPerPage;
      renderProducts();
    });

    renderProducts();

    let autoSlide = setInterval(() => nextBtn.click(), 2500);
    const slider = document.querySelector('.arrival-slider');
    slider?.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider?.addEventListener('mouseleave', () => {
      autoSlide = setInterval(() => nextBtn.click(), 2500);
    });
  }

  setupNewArrival();

  function setupBestseller() {
    const bestsellerProducts = [
      { img: 'sanpham/dich-vu-chup-anh-thoi-trang-cho-shop-quan-ao-dep-gia-re.jpg', name: 'Áo1', price: '500.000₫', old: '800.000₫' },
      { img: 'sanpham/images.jpg', name: 'Áo2', price: '600.000₫', old: '900.000₫' },
      { img: 'sanpham/images (1).jpg', name: 'Áo3', price: '700.000₫', old: '1.000.000₫' },
      { img: 'https://via.placeholder.com/300x400?text=Áo4', name: 'Áo4', price: '550.000₫', old: '800.000₫' },
      { img: 'https://via.placeholder.com/300x400?text=Áo5', name: 'Áo5', price: '480.000₫', old: '750.000₫' },
    ];

    let currentIndex = 0;
    const itemsPerPage = 3;
    const grid = document.getElementById('bestsellerGrid');
    const nextBtn = document.getElementById('nextBestsellerBtn');
    const prevBtn = document.getElementById('prevBestsellerBtn');

    function render() {
      if (!grid) return;
      grid.innerHTML = '';
      const visible = bestsellerProducts.slice(currentIndex, currentIndex + itemsPerPage);
      visible.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${p.img}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p class="price">${p.price} <span class="compare-price">${p.old}</span></p>
          <a href="#" class="btn-buy" onclick="addToCartFromNewArrival('${p.name}', '${p.img}', '${p.price}')">Mua hàng</a>
        `;
        grid.appendChild(card);
      });

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex + itemsPerPage >= bestsellerProducts.length;
    }

    nextBtn?.addEventListener('click', () => {
      if (currentIndex + itemsPerPage < bestsellerProducts.length) currentIndex++;
      render();
    });

    prevBtn?.addEventListener('click', () => {
      if (currentIndex > 0) currentIndex--;
      render();
    });

    render();
  }

  setupBestseller();

  renderCart();

  function renderCart() {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return;
    const cart = getCartFromStorage();
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty-cart-message";
      empty.innerText = "🛒 Giỏ hàng của bạn hiện đang trống.";
      cartContainer.appendChild(empty);
    } else {
      cart.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
          <img src="${item.image}" alt="${item.name}" width="80" style="border-radius:8px;">
          <p><strong>${item.name}</strong></p>
          <p>Số lượng: <button onclick="decreaseQuantity(${index})">-</button> ${item.quantity} <button onclick="increaseQuantity(${index})">+</button></p>
          <p>Giá: ${(item.price * item.quantity).toLocaleString()}₫</p>
        `;
        cartContainer.appendChild(itemDiv);
        total += item.price * item.quantity;
      });
    }

    if (document.getElementById("voucherNote")) {
      if (voucherApplied) {
        total = Math.round(total * 0.9);
        document.getElementById("voucherNote").innerText = "🎉 Voucher đã áp dụng: giảm 10%!";
      } else {
        document.getElementById("voucherNote").innerText = "";
      }
    }

    if (document.getElementById("totalAmount")) {
      document.getElementById("totalAmount").innerText = total.toLocaleString() + "₫";
    }
    renderOrderPreview();
    saveCartToStorage(cart);
    updateCartIconCount();
  }

  window.increaseQuantity = function (index) {
    const cart = getCartFromStorage();
    cart[index].quantity++;
    saveCartToStorage(cart);
    renderCart();
  };

  window.decreaseQuantity = function (index) {
    const cart = getCartFromStorage();
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    saveCartToStorage(cart);
    renderCart();
  };

  window.applyVoucher = function () {
    const code = document.getElementById("voucherInput")?.value.trim().toLowerCase();
    voucherApplied = code === "voucher1";
    renderCart();
  };

  window.openCheckoutPopup = function () {
    document.getElementById("checkoutPopup").style.display = "flex";
    const date = new Date();
    date.setDate(date.getDate() + 3);
    document.getElementById("deliveryDate").innerText = date.toLocaleDateString("vi-VN");
    renderOrderPreview();
  };

  window.closePopup = function () {
    document.getElementById("checkoutPopup").style.display = "none";
  };

  window.sendVerificationCode = function () {
    alert("🔐 Mã xác minh của bạn là: 123");
  };

  window.submitOrder = function () {
    const fullname = document.getElementById("fullname")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const note = document.getElementById("note")?.value.trim();
    const code = document.getElementById("verifyCode")?.value.trim();

    if (!fullname || !address || !phone || code !== "123") {
      alert("❌ Vui lòng điền đầy đủ thông tin và nhập mã xác minh đúng (123)!");
      return;
    }
      // Kiểm tra ảnh chuyển khoản khi phương thức là chuyển khoản ngân hàng
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
  if (paymentMethod === 'bankTransfer') {
    const proofFile = document.getElementById('transferProof')?.files[0];
    if (!proofFile) {
      alert("❌ Vui lòng tải lên hình ảnh hóa đơn/chứng từ chuyển khoản!");
      return;
    }
  }

    alert(`✅ Đơn hàng đã được đặt thành công!
Tên: ${fullname}
Địa chỉ: ${address}
SĐT: ${phone}
Ghi chú: ${note}`);
    localStorage.removeItem("cart");
    renderCart();
    closePopup();
  };

  function renderOrderPreview() {
    const preview = document.getElementById("orderPreview");
    if (!preview) return;
    preview.innerHTML = "";
    const cart = getCartFromStorage();
    let total = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const li = document.createElement("li");
      li.innerText = `${item.name} - SL: ${item.quantity} - Giá: ${itemTotal.toLocaleString()}₫`;
      preview.appendChild(li);
      total += itemTotal;
    });
    const finalTotal = voucherApplied ? Math.round(total * 0.9) : total;
    const grandTotal = finalTotal + 30000;
    if (document.getElementById("checkoutTotal")) {
      document.getElementById("checkoutTotal").innerText = grandTotal.toLocaleString() + "₫";
    }
    if (document.getElementById("voucherAppliedLine")) {
      document.getElementById("voucherAppliedLine").innerText = voucherApplied ? "Đã áp dụng mã giảm giá: -10%" : "Không có mã giảm giá áp dụng";
    }
  }
// --- Bắt đầu đoạn xử lý hiển thị phần chuyển khoản ngân hàng ---
const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
const bankingSection = document.getElementById('bankingSection');
const bankRadios = document.querySelectorAll('input[name="bank"]');
const bankDetails = document.getElementById('bankDetails');
const bankQRContainer = document.getElementById('bankQRContainer');
const bankQRImage = document.getElementById('bankQRImage');

paymentRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked && radio.value === 'bankTransfer') {
      bankingSection.style.display = 'block';
    } else if (radio.checked) {
      bankingSection.style.display = 'none';
      bankDetails.innerHTML = '';
      bankQRContainer.style.display = 'none';
    }
  });
});

const bankInfoMap = {
  momo: {
    details: 'Số tài khoản MoMo: 0123456789 - Chủ tài khoản: Nguyễn Văn A',
    qr: 'qrcode/#'
  },
  vietcombank: {
    details: 'Số tài khoản Vietcombank: 123456789 - Chủ tài khoản: Nguyễn Văn B',
    qr: 'qrcode/vcbqr.png'
  },
  tpbank: {
    details: 'Số tài khoản TPBank: 987654321 - Chủ tài khoản: Nguyễn Văn C',
    qr: 'qrcode/#'
  },
  mbbank: {
    details: 'Số tài khoản MBBank: 555555555 - Chủ tài khoản: Nguyễn Văn D',
    qr: 'qrcode/MB-QR.png'
  },
  visa: {
    details: 'Thanh toán Visa, vui lòng liên hệ ngân hàng để biết chi tiết.',
    qr: ''
  }
};

bankRadios.forEach(bankRadio => {
  bankRadio.addEventListener('change', () => {
    const bankKey = bankRadio.value;
    if (bankInfoMap[bankKey]) {
      bankDetails.innerHTML = bankInfoMap[bankKey].details;
      if (bankInfoMap[bankKey].qr) {
        bankQRImage.src = bankInfoMap[bankKey].qr;
        bankQRContainer.style.display = 'block';
      } else {
        bankQRContainer.style.display = 'none';
      }
    }
  });
});
const transferProofInput = document.getElementById('transferProof');
const uploadPreview = document.getElementById('uploadPreview');

transferProofInput?.addEventListener('change', () => {
  const file = transferProofInput.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh hợp lệ.');
      transferProofInput.value = '';
      uploadPreview.innerHTML = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Ảnh hóa đơn" style="max-width: 300px; max-height: 300px; border: 1px solid #ccc; border-radius: 8px;" />`;
    };
    reader.readAsDataURL(file);
  } else {
    uploadPreview.innerHTML = '';
  }
});
// --- Kết thúc đoạn xử lý chuyển khoản ---

});
