/* =========================================================
   GADGETSTORE
   SCRIPT.JS FINAL
   FIX:
   - CUSTOMER WAJIB LOGIN SEBELUM BELI
   - CUSTOMER WAJIB LOGIN SEBELUM KERANJANG
   - CHECKOUT WAJIB LOGIN
   - PROFILE AMAN
   - CUSTOMER LOGOUT
   - ADMIN WAJIB LOGIN
   - ADMIN LOGOUT
   - VIDEO PRODUK
   - EDIT / TAMBAH / HAPUS PRODUK
========================================================= */

"use strict";


/* =========================================================
   STORAGE KEY
========================================================= */

const STORAGE_KEY = "gadgetstore_final_v1";
const PRODUCT_KEY = "gadgetstore_products_v1";


/* =========================================================
   DATA PRODUK
========================================================= */

let products = [

    {
        id: 1,
        name: "iPhone 15",
        category: "SMARTPHONE",
        price: 12999000,
        rating: 4.9,
        tag: "BEST SELLER",

        image: "iphone15.jpg",

        video: "iphone-15-pro.mp4",

        description:
            "Smartphone premium dengan performa cepat, kamera tajam, dan desain elegan.",

        specs: {
            Layar: "6.1 inch",
            Chip: "A16 Bionic",
            Kamera: "48 MP",
            Storage: "128 GB"
        }
    },


    {
        id: 2,
        name: "Samsung Galaxy S24",
        category: "SMARTPHONE",
        price: 11999000,
        rating: 4.8,
        tag: "POPULAR",

        image: "images/samsung.jpg",

        video: "videos/samsung-s24-ultra.mp4",

        description:
            "Flagship Android dengan layar Dynamic AMOLED, kamera cerdas, dan performa tinggi.",

        specs: {
            Layar: "6.2 inch",
            Chip: "Snapdragon",
            Kamera: "50 MP",
            Storage: "256 GB"
        }
    },


    {
        id: 3,
        name: "iPad Air",
        category: "TABLET",
        price: 9999000,
        rating: 4.8,
        tag: "NEW",

        image: "images/ipad.jpg",

        video: "videos/ipad-pro-m4.mp4",

        description:
            "Tablet tipis dan bertenaga untuk belajar, bekerja, menggambar, dan hiburan.",

        specs: {
            Layar: "10.9 inch",
            Chip: "Apple M1",
            Kamera: "12 MP",
            Storage: "64 GB"
        }
    },


    {
        id: 4,
        name: "MacBook Air M2",
        category: "LAPTOP",
        price: 14999000,
        rating: 4.9,
        tag: "PREMIUM",

        image: "images/macbook.jpg",

        video: "videos/macbook-air-m3.mp4",

        description:
            "Laptop ringan dengan chip Apple M2, baterai awet, dan performa responsif.",

        specs: {
            Layar: "13.6 inch",
            Chip: "Apple M2",
            RAM: "8 GB",
            Storage: "256 GB"
        }
    },


    {
        id: 5,
        name: "Xiaomi 14T",
        category: "SMARTPHONE",
        price: 6999000,
        rating: 4.7,
        tag: "HOT",

        image: "images/xiaomi.jpg",

        video: "videos/xiaomi-14t.mp4",

        description:
            "Smartphone modern dengan layar AMOLED, kamera berkualitas, dan performa kencang.",

        specs: {
            Layar: "6.67 inch",
            Chip: "Dimensity",
            Kamera: "50 MP",
            Storage: "256 GB"
        }
    }

];


/* =========================================================
   STATE
========================================================= */

let state = {

    cart: [],

    orders: [],

    gdpayBalance: 500000,

    currentUser: null,

    selectedPayment: null,

    filter: "all"

};


/* =========================================================
   ADMIN SESSION
========================================================= */

let adminLoggedIn = false;


/* =========================================================
   CURRENT PRODUCT
========================================================= */

let currentProduct = null;


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


/* =========================================================
   DOM
========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   RUPIAH
========================================================= */

function rupiah(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(
        Number(value) || 0
    );

}


/* =========================================================
   LOGIN STATUS
========================================================= */

function isCustomerLoggedIn() {

    return !!(
        state.currentUser &&
        state.currentUser.name &&
        state.currentUser.email
    );

}


/* =========================================================
   SAVE STATE
========================================================= */

function save() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

        localStorage.setItem(
            PRODUCT_KEY,
            JSON.stringify(products)
        );

    }

    catch (error) {

        console.warn(
            "Gagal menyimpan data:",
            error
        );

    }

}


/* =========================================================
   LOAD STATE
========================================================= */

function load() {

    try {

        const savedState =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            );


        if (
            savedState &&
            typeof savedState === "object"
        ) {

            state = {
                ...state,
                ...savedState
            };

        }


        const savedProducts =
            JSON.parse(
                localStorage.getItem(
                    PRODUCT_KEY
                )
            );


        if (
            Array.isArray(
                savedProducts
            ) &&
            savedProducts.length
        ) {

            products =
                savedProducts;

        }

    }

    catch (error) {

        console.warn(
            "Data lokal tidak valid. Menggunakan data default.",
            error
        );

    }


    /*
     * PERBAIKAN PENTING
     *
     * Versi lama pernah menyimpan:
     * { name: "Customer" }
     *
     * Itu BUKAN login valid.
     */

    if (
        !state.currentUser ||
        !state.currentUser.name ||
        !state.currentUser.email
    ) {

        state.currentUser =
            null;

    }


    if (
        !Array.isArray(
            state.cart
        )
    ) {

        state.cart = [];

    }


    if (
        !Array.isArray(
            state.orders
        )
    ) {

        state.orders = [];

    }


    if (
        typeof state.gdpayBalance !==
        "number"
    ) {

        state.gdpayBalance =
            500000;

    }


    if (
        !state.filter
    ) {

        state.filter =
            "all";

    }

}


/* =========================================================
   MODAL
========================================================= */

function openModal(id) {

    const modal =
        $(id);


    if (!modal) {

        return;

    }


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeModal(id) {

    const modal =
        $(id);


    if (!modal) {

        return;

    }


    /*
     * Hentikan video ketika
     * preview ditutup.
     */

    if (
        id ===
        "detailModal"
    ) {

        const video =
            $("detailVideo");


        if (video) {

            try {

                video.pause();

            }

            catch (error) {

                console.warn(
                    "Video pause error:",
                    error
                );

            }

        }

    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );

}


function closeAllModals() {

    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            modal => {

                closeModal(
                    modal.id
                );

            }
        );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        $("toast");


    if (!toast) {

        console.log(
            message
        );

        return;

    }


    clearTimeout(
        toastTimer
    );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

}


/* =========================================================
   SCREEN
========================================================= */

function showScreen(id) {

    document
        .querySelectorAll(
            ".screen"
        )
        .forEach(
            screen => {

                screen.classList.remove(
                    "active"
                );

            }
        );


    const target =
        $(id);


    if (target) {

        target.classList.add(
            "active"
        );

    }


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );

}


/* =========================================================
   CUSTOMER
========================================================= */

function openCustomer() {

    closeAllModals();

    showScreen(
        "customerPage"
    );

    showHome();

    updateCart();

}


/* =========================================================
   ADMIN
========================================================= */

function openAdmin() {

    /*
     * ADMIN TIDAK BOLEH
     * LANGSUNG MASUK DASHBOARD.
     */

    closeAllModals();


    if (
        !adminLoggedIn
    ) {

        openModal(
            "adminLoginModal"
        );

        return;

    }


    showScreen(
        "adminPage"
    );


    updateAdmin();

}


/* =========================================================
   BACK TO ROLE
========================================================= */

function backToRole() {

    /*
     * Ini dipakai sebagai
     * fallback / tombol kembali.
     *
     * Logout customer dan admin
     * mempunyai fungsi masing-masing.
     */

    closeAllModals();

    showScreen(
        "rolePage"
    );

}


/* =========================================================
   CUSTOMER LOGOUT
========================================================= */

function logoutCustomer() {

    /*
     * HAPUS SESSION CUSTOMER
     */

    state.currentUser =
        null;


    /*
     * Produk pending juga
     * harus dihapus.
     */

    currentProduct =
        null;


    /*
     * Jangan hapus:
     * cart
     * orders
     * saldo
     */

    save();


    closeAllModals();


    showScreen(
        "rolePage"
    );


    showToast(
        "✓ Customer berhasil logout."
    );

}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

function logoutAdmin() {

    /*
     * ADMIN SESSION HANYA
     * BERLAKU SELAMA SESSION.
     */

    adminLoggedIn =
        false;


    closeAllModals();


    showScreen(
        "rolePage"
    );


    showToast(
        "✓ Admin berhasil logout."
    );

}


/* =========================================================
   HOME
========================================================= */

function showHome() {

    showScreen(
        "customerPage"
    );


    const home =
        $("homeSection");


    const productsSection =
        $("productsSection");


    if (home) {

        home.classList.remove(
            "hidden"
        );

    }


    if (productsSection) {

        productsSection.classList.add(
            "hidden"
        );

    }


    setNavActive(
        0
    );


    renderHome();

}


/* =========================================================
   BACK CUSTOMER
========================================================= */

function backCustomer() {

    showHome();

}


/* =========================================================
   PRODUCTS PAGE
========================================================= */

function showProducts() {

    showScreen(
        "customerPage"
    );


    const home =
        $("homeSection");


    const productsSection =
        $("productsSection");


    if (home) {

        home.classList.add(
            "hidden"
        );

    }


    if (productsSection) {

        productsSection.classList.remove(
            "hidden"
        );

    }


    setNavActive(
        1
    );


    renderAllProducts();

}


/* =========================================================
   ORDERS
========================================================= */

function showOrders() {

    /*
     * PESANAN WAJIB LOGIN
     */

    if (
        !isCustomerLoggedIn()
    ) {

        openModal(
            "loginModal"
        );


        showToast(
            "Login dulu untuk melihat pesanan."
        );


        return;

    }


    showScreen(
        "ordersPage"
    );


    renderOrders();

}


/* =========================================================
   PROFILE
========================================================= */

function openProfile() {

    /*
     * FIX PROFILE ERROR
     */

    if (
        !isCustomerLoggedIn()
    ) {

        openModal(
            "loginModal"
        );


        showToast(
            "Login dulu untuk membuka profil."
        );


        return;

    }


    showScreen(
        "profilePage"
    );


    updateProfile();

}


function closeProfile() {

    showHome();

}


/* =========================================================
   NAV
========================================================= */

function setNavActive(
    index
) {

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            (
                button,
                i
            ) => {

                button.classList.toggle(
                    "active",
                    i === index
                );

            }
        );

}


/* =========================================================
   RENDER HOME
========================================================= */

function renderHome() {

    const box =
        $("homeProducts");


    if (!box) {

        return;

    }


    box.innerHTML =
        products
            .slice(
                0,
                5
            )
            .map(
                productCard
            )
            .join(
                ""
            );

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderAllProducts() {

    const box =
        $("allProducts");


    if (!box) {

        return;

    }


    const query =
        (
            $("searchInput")
                ?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const filtered =
        products.filter(
            product => {

                const categoryMatch =
                    state.filter ===
                    "all" ||

                    product.category ===
                    state.filter;


                const searchMatch =
                    !query ||

                    product.name
                        .toLowerCase()
                        .includes(
                            query
                        ) ||

                    product.category
                        .toLowerCase()
                        .includes(
                            query
                        );


                return (
                    categoryMatch &&
                    searchMatch
                );

            }
        );


    if (
        !filtered.length
    ) {

        box.innerHTML = `

            <div
                class="empty-state"
            >

                <div>
                    🔎
                </div>

                <h3>
                    Produk tidak ditemukan
                </h3>

                <p>
                    Coba kata kunci lain.
                </p>

            </div>

        `;

        return;

    }


    box.innerHTML =
        filtered
            .map(
                productCard
            )
            .join(
                ""
            );

}


/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(
    product
) {

    return `

        <article
            class="product-card"
        >

            <div
                class="product-media"
                onclick="
                    openDetail(
                        ${product.id}
                    )
                "
            >

                <img
                    src="${escapeHtml(
                        product.image
                    )}"
                    alt="${escapeHtml(
                        product.name
                    )}"
                    onerror="
                        imageError(this)
                    "
                >

                <span
                    class="product-tag"
                >
                    ${escapeHtml(
                        product.tag ||
                        "NEW"
                    )}
                </span>

            </div>


            <div
                class="product-info"
            >

                <span
                    class="product-category"
                >
                    ${escapeHtml(
                        product.category
                    )}
                </span>


                <h3>
                    ${escapeHtml(
                        product.name
                    )}
                </h3>


                <div
                    class="product-rating"
                >

                    ★★★★★

                    <span>
                        ${Number(
                            product.rating
                        ).toFixed(1)}
                    </span>

                </div>


                <div
                    class="product-bottom"
                >

                    <strong>
                        ${rupiah(
                            product.price
                        )}
                    </strong>


                    <button
                        class="add-button"
                        onclick="
                            addToCart(
                                ${product.id}
                            )
                        "
                    >
                        +
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    text
) {

    return String(
        text ?? ""
    ).replace(

        /[&<>"']/g,

        function (
            match
        ) {

            return {

                "&":
                    "&amp;",

                "<":
                    "&lt;",

                ">":
                    "&gt;",

                '"':
                    "&quot;",

                "'":
                    "&#039;"

            }[
                match
            ];

        }

    );

}


/* =========================================================
   IMAGE ERROR
========================================================= */

function imageError(
    img
) {

    if (!img) {

        return;

    }


    img.onerror =
        null;


    img.src =
        "data:image/svg+xml;charset=UTF-8," +

        encodeURIComponent(`

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="800"
                height="600"
            >

                <rect
                    width="100%"
                    height="100%"
                    fill="#111827"
                />

                <text
                    x="50%"
                    y="48%"
                    text-anchor="middle"
                    fill="white"
                    font-size="34"
                    font-family="Arial"
                    font-weight="700"
                >
                    GADGETSTORE
                </text>

                <text
                    x="50%"
                    y="58%"
                    text-anchor="middle"
                    fill="#f59e0b"
                    font-size="20"
                    font-family="Arial"
                >
                    Product Image
                </text>

            </svg>

        `);

}


/* =========================================================
   FILTER
========================================================= */

function filterCategory(
    category
) {

    state.filter =
        category;


    showProducts();

}


/* =========================================================
   SEARCH
========================================================= */

function searchProducts() {

    renderAllProducts();

}


/* =========================================================
   PRODUCT DETAIL
   FOTO + VIDEO
========================================================= */

function openDetail(
    id
) {

    const product =
        products.find(
            item =>
                item.id ===
                id
        );


    if (!product) {

        showToast(
            "Produk tidak ditemukan."
        );

        return;

    }


    currentProduct =
        product;


    /* =========================
       IMAGE
    ========================= */

    const image =
        $("detailImage");


    if (image) {

        image.src =
            product.image;


        image.onerror =
            function () {

                imageError(
                    this
                );

            };

    }


    /* =========================
       CATEGORY
    ========================= */

    if (
        $("detailCategory")
    ) {

        $("detailCategory")
            .textContent =
            product.category;

    }


    /* =========================
       NAME
    ========================= */

    if (
        $("detailName")
    ) {

        $("detailName")
            .textContent =
            product.name;

    }


    /* =========================
       RATING
    ========================= */

    if (
        $("detailRating")
    ) {

        $("detailRating")
            .innerHTML =

            `★★★★★ <span>${
                product.rating
            }</span>`;

    }


    /* =========================
       PRICE
    ========================= */

    if (
        $("detailPrice")
    ) {

        $("detailPrice")
            .textContent =
            rupiah(
                product.price
            );

    }


    /* =========================
       DESCRIPTION
    ========================= */

    if (
        $("detailDescription")
    ) {

        $("detailDescription")
            .textContent =
            product.description;

    }


    /* =========================
       STOCK
    ========================= */

    if (
        $("detailStock")
    ) {

        $("detailStock")
            .textContent =
            "✓ Stok tersedia • Siap dikirim";

    }


    /* =========================
       SPECS
    ========================= */

    const specs =
        $("detailSpecs");


    if (specs) {

        specs.innerHTML =
            Object
                .entries(
                    product.specs ||
                    {}
                )
                .map(
                    (
                        [
                            key,
                            value
                        ]
                    ) => `

                        <div
                            class="spec-item"
                        >

                            <strong>
                                ${escapeHtml(
                                    key
                                )}
                            </strong>

                            <span>
                                ${escapeHtml(
                                    value
                                )}
                            </span>

                        </div>

                    `
                )
                .join(
                    ""
                );

    }


    /* =========================
       VIDEO
    ========================= */

    const video =
        $("detailVideo");


    const source =
        $("detailVideoSource");


    if (
        video &&
        source
    ) {

        try {

            video.pause();

        }

        catch (error) {

            console.warn(
                error
            );

        }


        source.src =
            product.video ||
            "";


        video.load();

    }


    /* =========================
       ADD BUTTON PREVIEW
    ========================= */

    const addButton =
        $("detailAddButton");


    if (addButton) {

        addButton.onclick =
            function () {

                /*
                 * WAJIB LOGIN
                 */

                if (
                    !isCustomerLoggedIn()
                ) {

                    openModal(
                        "loginModal"
                    );


                    showToast(
                        "Login dulu untuk memasukkan produk ke keranjang."
                    );


                    return;

                }


                addToCart(
                    product.id
                );


                closeModal(
                    "detailModal"
                );

            };

    }


    /* =========================
       OPEN
    ========================= */

    openModal(
        "detailModal"
    );

}


/* =========================================================
   BUY PRODUCT
========================================================= */

function buyProduct(
    id
) {

    const product =
        products.find(
            item =>
                item.id ===
                id
        );


    if (!product) {

        return;

    }


    currentProduct =
        product;


    /*
     * WAJIB LOGIN
     */

    if (
        !isCustomerLoggedIn()
    ) {

        openModal(
            "loginModal"
        );


        showToast(
            "Login dulu sebelum membeli."
        );


        return;

    }


    addToCart(
        product.id
    );


    openCart();

}


/* =========================================================
   BUY FROM DETAIL
========================================================= */

function buyDetailProduct() {

    if (
        !currentProduct
    ) {

        return;

    }


    if (
        !isCustomerLoggedIn()
    ) {

        closeModal(
            "detailModal"
        );


        openModal(
            "loginModal"
        );


        showToast(
            "Login dulu sebelum membeli."
        );


        return;

    }


    addToCart(
        currentProduct.id
    );


    closeModal(
        "detailModal"
    );


    openCart();

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    id
) {

    const product =
        products.find(
            item =>
                item.id ===
                id
        );


    if (!product) {

        showToast(
            "Produk tidak ditemukan."
        );

        return;

    }


    /*
     * LAPISAN KEAMANAN
     *
     * Bahkan kalau addToCart()
     * dipanggil langsung dari HTML,
     * tetap wajib login.
     */

    if (
        !isCustomerLoggedIn()
    ) {

        currentProduct =
            product;


        openModal(
            "loginModal"
        );


        showToast(
            "Login dulu sebelum memasukkan produk ke keranjang."
        );


        return;

    }


    const existing =
        state.cart.find(
            item =>
                item.id ===
                id
        );


    if (existing) {

        existing.qty +=
            1;

    }

    else {

        state.cart.push({

            ...product,

            qty:
                1

        });

    }


    save();

    updateCart();


    showToast(
        `${product.name} ditambahkan ke keranjang.`
    );

}


/* =========================================================
   CART COUNT
========================================================= */

function getCartCount() {

    return state.cart.reduce(
        (
            total,
            item
        ) =>
            total +
            Number(
                item.qty
            ),

        0
    );

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

    return state.cart.reduce(
        (
            total,
            item
        ) =>
            total +
            (
                Number(
                    item.price
                ) *
                Number(
                    item.qty
                )
            ),

        0
    );

}


/* =========================================================
   UPDATE CART
========================================================= */

function updateCart() {

    const count =
        $("cartCount");


    if (count) {

        count.textContent =
            getCartCount();

    }


    const box =
        $("cartItems");


    if (!box) {

        return;

    }


    if (
        !state.cart.length
    ) {

        box.innerHTML = `

            <div
                class="empty-state"
            >

                <div>
                    🛒
                </div>

                <h3>
                    Keranjang kosong
                </h3>

                <p>
                    Tambahkan gadget favoritmu.
                </p>

            </div>

        `;

    }

    else {

        box.innerHTML =
            state.cart
                .map(
                    item => `

                        <div
                            class="cart-item"
                        >

                            <img
                                src="${escapeHtml(
                                    item.image
                                )}"
                                alt="${escapeHtml(
                                    item.name
                                )}"
                                onerror="
                                    imageError(this)
                                "
                            >


                            <div
                                class="cart-item-info"
                            >

                                <strong>
                                    ${escapeHtml(
                                        item.name
                                    )}
                                </strong>

                                <small>
                                    ${rupiah(
                                        item.price
                                    )}
                                    ×
                                    ${item.qty}
                                </small>

                            </div>


                            <div
                                class="qty-controls"
                            >

                                <button
                                    onclick="
                                        changeQty(
                                            ${item.id},
                                            -1
                                        )
                                    "
                                >
                                    −
                                </button>


                                <b>
                                    ${item.qty}
                                </b>


                                <button
                                    onclick="
                                        changeQty(
                                            ${item.id},
                                            1
                                        )
                                    "
                                >
                                    +
                                </button>

                            </div>


                            <button
                                class="remove-cart"
                                onclick="
                                    removeFromCart(
                                        ${item.id}
                                    )
                                "
                            >
                                ×
                            </button>

                        </div>

                    `
                )
                .join(
                    ""
                );

    }


    const total =
        $("cartTotal");


    if (total) {

        total.textContent =
            rupiah(
                getCartTotal()
            );

    }

}


/* =========================================================
   CHANGE QTY
========================================================= */

function changeQty(
    id,
    delta
) {

    if (
        !isCustomerLoggedIn()
    ) {

        openModal(
            "loginModal"
        );

        return;

    }


    const item =
        state.cart.find(
            product =>
                product.id ===
                id
        );


    if (!item) {

        return;

    }


    item.qty +=
        delta;


    if (
        item.qty <=
        0
    ) {

        state.cart =
            state.cart.filter(
                product =>
                    product.id !==
                    id
            );

    }


    save();

    updateCart();

}


/* =========================================================
   REMOVE CART
========================================================= */

function removeFromCart(
    id
) {

    state.cart =
        state.cart.filter(
            item =>
                item.id !==
                id
        );


    save();

    updateCart();


    showToast(
        "Produk dihapus dari keranjang."
    );

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    /*
     * Melihat keranjang boleh.
     *
     * Tapi checkout tetap wajib login.
     */

    updateCart();

    openModal(
        "cartModal"
    );

}


/* =========================================================
   CHECKOUT
========================================================= */

function checkout() {

    /*
     * WAJIB LOGIN
     */

    if (
        !isCustomerLoggedIn()
    ) {

        closeModal(
            "cartModal"
        );


        openModal(
            "loginModal"
        );


        showToast(
            "Login diperlukan sebelum checkout."
        );


        return;

    }


    if (
        !state.cart.length
    ) {

        showToast(
            "Keranjang masih kosong."
        );

        return;

    }


    const paymentTotal =
        $("paymentTotal");


    if (paymentTotal) {

        paymentTotal.textContent =
            rupiah(
                getCartTotal()
            );

    }


    state.selectedPayment =
        null;


    const form =
        $("paymentForm");


    const confirmButton =
        $("confirmPaymentBtn");


    if (form) {

        form.innerHTML =
            "";

        form.classList.add(
            "hidden"
        );

    }


    if (confirmButton) {

        confirmButton.classList.add(
            "hidden"
        );

    }


    document
        .querySelectorAll(
            ".payment-card"
        )
        .forEach(
            card =>
                card.classList.remove(
                    "selected"
                )
        );


    closeModal(
        "cartModal"
    );


    openModal(
        "paymentModal"
    );

}


/* =========================================================
   SELECT PAYMENT
========================================================= */

function selectPayment(
    method
) {

    if (
        !isCustomerLoggedIn()
    ) {

        closeModal(
            "paymentModal"
        );


        openModal(
            "loginModal"
        );


        showToast(
            "Login diperlukan."
        );


        return;

    }


    state.selectedPayment =
        method;


    document
        .querySelectorAll(
            ".payment-card"
        )
        .forEach(
            card =>
                card.classList.remove(
                    "selected"
                )
        );


    const selectedCard =
        $(
            "pay-" +
            method
        );


    if (selectedCard) {

        selectedCard.classList.add(
            "selected"
        );

    }


    const form =
        $("paymentForm");


    const confirmButton =
        $("confirmPaymentBtn");


    if (
        !form ||
        !confirmButton
    ) {

        return;

    }


    form.classList.remove(
        "hidden"
    );


    const total =
        getCartTotal();


    /* =========================
       GDPAY
    ========================= */

    if (
        method ===
        "gdpay"
    ) {

        form.innerHTML = `

            <div
                class="payment-info-box"
            >

                <strong>
                    💳 GDPAY
                </strong>

                <p>
                    Saldo saat ini:
                    <b>
                        ${rupiah(
                            state.gdpayBalance
                        )}
                    </b>
                </p>

                <p>
                    Total:
                    <b>
                        ${rupiah(
                            total
                        )}
                    </b>
                </p>

                <small
                    class="${
                        state.gdpayBalance >=
                        total
                            ? "success"
                            : "danger"
                    }"
                >

                    ${
                        state.gdpayBalance >=
                        total

                            ? "✓ Saldo mencukupi"

                            : "✕ Saldo tidak mencukupi"

                    }

                </small>

            </div>

        `;

    }


    /* =========================
       QRIS
    ========================= */

    else if (
        method ===
        "qris"
    ) {

        form.innerHTML = `

            <div
                class="payment-info-box qris-payment"
            >

                <div
                    class="qris-demo"
                >

                    <strong>
                        QRIS
                    </strong>

                    <div
                        class="qris-pattern"
                    >
                        ▦ ▦ ▦
                        <br>
                        ▦ ▥ ▦
                        <br>
                        ▦ ▦ ▦
                    </div>

                    <b>
                        GADGETSTORE
                    </b>

                </div>


                <p>
                    Total:
                    <b>
                        ${rupiah(
                            total
                        )}
                    </b>
                </p>


                <label>
                    Kode demo
                </label>


                <input
                    id="qrisCode"
                    class="form-input"
                    inputmode="numeric"
                    maxlength="6"
                    placeholder="123456"
                >


                <small>
                    Gunakan kode
                    <b>
                        123456
                    </b>
                </small>

            </div>

        `;

    }


    /* =========================
       E-WALLET
    ========================= */

    else if (
        method ===
        "ewallet"
    ) {

        form.innerHTML = `

            <div
                class="payment-info-box"
            >

                <label>
                    Pilih E-Wallet
                </label>


                <select
                    id="walletName"
                    class="form-input"
                >

                    <option>
                        GoPay
                    </option>

                    <option>
                        DANA
                    </option>

                    <option>
                        OVO
                    </option>

                    <option>
                        ShopeePay
                    </option>

                </select>


                <label>
                    Nomor E-Wallet
                </label>


                <input
                    id="walletNumber"
                    class="form-input"
                    inputmode="numeric"
                    placeholder="08xxxxxxxxxx"
                >


                <label>
                    Kode verifikasi demo
                </label>


                <input
                    id="walletCode"
                    class="form-input"
                    inputmode="numeric"
                    placeholder="123456"
                >

            </div>

        `;

    }


    /* =========================
       BANK
    ========================= */

    else if (
        method ===
        "bank"
    ) {

        form.innerHTML = `

            <div
                class="payment-info-box"
            >

                <label>
                    Pilih Bank
                </label>


                <select
                    id="bankName"
                    class="form-input"
                >

                    <option>
                        BCA
                    </option>

                    <option>
                        BRI
                    </option>

                    <option>
                        BNI
                    </option>

                    <option>
                        Mandiri
                    </option>

                </select>


                <div
                    class="bank-account-box"
                >

                    <span>
                        Rekening GadgetStore
                    </span>

                    <strong>
                        1234567890
                    </strong>

                    <small>
                        a.n. GADGETSTORE
                    </small>

                </div>


                <label>
                    Nomor rekening pengirim
                </label>


                <input
                    id="bankNumber"
                    class="form-input"
                    inputmode="numeric"
                    placeholder="Nomor rekening"
                >

            </div>

        `;

    }


    /* =========================
       RETAIL
    ========================= */

    else {

        form.innerHTML = `

            <div
                class="payment-info-box"
            >

                <label>
                    Tempat pembayaran
                </label>


                <select
                    id="retailName"
                    class="form-input"
                >

                    <option>
                        Alfamart
                    </option>

                    <option>
                        Indomaret
                    </option>

                </select>


                <div
                    class="retail-payment-code"
                >

                    <span>
                        Kode Pembayaran
                    </span>

                    <strong>
                        GS${Math.floor(
                            10000000 +
                            Math.random() *
                            90000000
                        )}
                    </strong>

                </div>


                <input
                    id="retailCode"
                    class="form-input"
                    placeholder="Masukkan kode pembayaran demo"
                >

            </div>

        `;

    }


    confirmButton.classList.remove(
        "hidden"
    );

}


/* =========================================================
   CONFIRM PAYMENT
========================================================= */

function confirmPayment() {

    /*
     * LAPISAN KEAMANAN TERAKHIR
     */

    if (
        !isCustomerLoggedIn()
    ) {

        closeModal(
            "paymentModal"
        );


        openModal(
            "loginModal"
        );


        showToast(
            "Login diperlukan sebelum pembayaran."
        );


        return;

    }


    const method =
        state.selectedPayment;


    if (!method) {

        showToast(
            "Pilih metode pembayaran terlebih dahulu."
        );

        return;

    }


    if (
        !state.cart.length
    ) {

        showToast(
            "Keranjang kosong."
        );

        return;

    }


    const total =
        getCartTotal();


    /* =========================
       GDPAY
    ========================= */

    if (
        method ===
        "gdpay"
    ) {

        if (
            state.gdpayBalance <
            total
        ) {

            showToast(
                "Saldo GDPAY tidak mencukupi."
            );

            return;

        }


        state.gdpayBalance -=
            total;

    }


    /* =========================
       QRIS
    ========================= */

    if (
        method ===
        "qris"
    ) {

        const code =
            $("qrisCode")
                ?.value
                .trim();


        if (
            code !==
            "123456"
        ) {

            showToast(
                "Kode QRIS salah. Gunakan 123456."
            );

            return;

        }

    }


    /* =========================
       E-WALLET
    ========================= */

    if (
        method ===
        "ewallet"
    ) {

        const number =
            $("walletNumber")
                ?.value
                .trim();


        const code =
            $("walletCode")
                ?.value
                .trim();


        if (
            !number ||
            !code
        ) {

            showToast(
                "Nomor dan kode E-Wallet wajib diisi."
            );

            return;

        }

    }


    /* =========================
       BANK
    ========================= */

    if (
        method ===
        "bank"
    ) {

        const number =
            $("bankNumber")
                ?.value
                .trim();


        if (!number) {

            showToast(
                "Nomor rekening pengirim wajib diisi."
            );

            return;

        }

    }


    /* =========================
       RETAIL
    ========================= */

    if (
        method ===
        "retail"
    ) {

        const code =
            $("retailCode")
                ?.value
                .trim();


        if (!code) {

            showToast(
                "Masukkan kode pembayaran."
            );

            return;

        }

    }


    /* =========================
       ORDER
    ========================= */

    const order = {

        id:
            "GS-" +
            Math.floor(
                100000 +
                Math.random() *
                900000
            ),

        user:
            state.currentUser.name,

        items:
            JSON.parse(
                JSON.stringify(
                    state.cart
                )
            ),

        total:
            total,

        payment:
            method,

        status:
            "Dikemas",

        shipping:
            "Pesanan sedang dikemas oleh gudang",

        tracking:
            "GSX-" +
            Math.floor(
                100000 +
                Math.random() *
                900000
            ),

        date:
            new Date()
                .toLocaleString(
                    "id-ID"
                )

    };


    state.orders.unshift(
        order
    );


    state.cart =
        [];


    state.selectedPayment =
        null;


    save();

    updateCart();

    updateProfile();

    updateAdmin();


    closeModal(
        "paymentModal"
    );


    showToast(
        "✓ Pembayaran berhasil! Pesanan dibuat."
    );


    setTimeout(
        function () {

            showOrders();

        },
        500
    );

}


/* =========================================================
   RENDER ORDERS
========================================================= */

function renderOrders() {

    const box =
        $("customerOrders");


    if (!box) {

        return;

    }


    if (
        !state.orders.length
    ) {

        box.innerHTML = `

            <div
                class="empty-state large"
            >

                <div>
                    📦
                </div>

                <h3>
                    Belum ada pesanan
                </h3>

                <p>
                    Pesanan yang berhasil checkout
                    akan tampil di sini.
                </p>


                <button
                    class="primary-button"
                    onclick="
                        showProducts()
                    "
                >
                    Mulai Belanja
                </button>

            </div>

        `;

        return;

    }


    box.innerHTML =
        state.orders
            .map(
                order => `

                    <article
                        class="order-card"
                    >

                        <div
                            class="order-head"
                        >

                            <div>

                                <small>
                                    ${escapeHtml(
                                        order.id
                                    )}
                                </small>

                                <h3>
                                    ${escapeHtml(
                                        order.date
                                    )}
                                </h3>

                            </div>


                            <span
                                class="status"
                            >
                                ${escapeHtml(
                                    order.status
                                )}
                            </span>

                        </div>


                        <div
                            class="order-items"
                        >

                            ${
                                order.items
                                    .map(
                                        item => `

                                            <div>

                                                <img
                                                    src="${escapeHtml(
                                                        item.image
                                                    )}"
                                                    alt=""
                                                    onerror="
                                                        imageError(this)
                                                    "
                                                >

                                                <span>
                                                    ${escapeHtml(
                                                        item.name
                                                    )}
                                                    ×
                                                    ${item.qty}
                                                </span>

                                                <b>
                                                    ${rupiah(
                                                        item.price *
                                                        item.qty
                                                    )}
                                                </b>

                                            </div>

                                        `
                                    )
                                    .join(
                                        ""
                                    )
                            }

                        </div>


                        <div
                            class="order-foot"
                        >

                            <span>
                                Tracking:
                                <b>
                                    ${escapeHtml(
                                        order.tracking
                                    )}
                                </b>
                            </span>


                            <strong>
                                ${rupiah(
                                    order.total
                                )}
                            </strong>

                        </div>

                    </article>

                `
            )
            .join(
                ""
            );

}


/* =========================================================
   PROFILE
========================================================= */

function updateProfile() {

    if (
        !isCustomerLoggedIn()
    ) {

        return;

    }


    const name =
        $("profileName");


    const email =
        $("profileEmail");


    const balance =
        $("profileBalance");


    if (name) {

        name.textContent =
            state.currentUser.name;

    }


    if (email) {

        email.textContent =
            state.currentUser.email;

    }


    if (balance) {

        balance.textContent =
            rupiah(
                state.gdpayBalance
            );

    }

}


/* =========================================================
   TOP UP
========================================================= */

function topUp() {

    if (
        !isCustomerLoggedIn()
    ) {

        openModal(
            "loginModal"
        );


        showToast(
            "Login dulu untuk menggunakan wallet."
        );


        return;

    }


    openModal(
        "topupModal"
    );

}


function setTopup(
    amount
) {

    const input =
        $("topupAmount");


    if (input) {

        input.value =
            amount;

    }

}


function confirmTopUp() {

    if (
        !isCustomerLoggedIn()
    ) {

        closeModal(
            "topupModal"
        );


        openModal(
            "loginModal"
        );


        return;

    }


    const amount =
        Number(
            $("topupAmount")
                ?.value ||
            0
        );


    if (
        !amount ||
        amount <
        10000
    ) {

        showToast(
            "Minimal top up Rp10.000."
        );

        return;

    }


    state.gdpayBalance +=
        amount;


    save();

    updateProfile();


    closeModal(
        "topupModal"
    );


    showToast(
        `Saldo bertambah ${rupiah(
            amount
        )}`
    );

}


/* =========================================================
   CUSTOMER LOGIN
========================================================= */

function loginCustomer() {

    const identity =
        $("customerLoginName")
            ?.value
            .trim();


    const password =
        $("customerLoginPassword")
            ?.value;


    if (!identity) {

        showToast(
            "Nama atau email wajib diisi."
        );

        return;

    }


    if (
        password !==
        "123456"
    ) {

        showToast(
            "Password customer salah. Gunakan 123456."
        );

        return;

    }


    /*
     * Karena field HTML hanya
     * satu input "Nama / Email",
     * kita gunakan input itu
     * sebagai nama customer.
     */

    const email =
        identity.includes("@")
            ? identity
            : (
                identity
                    .toLowerCase()
                    .replace(
                        /\s+/g,
                        "."
                    ) +
                "@gadgetstore.local"
            );


    state.currentUser = {

        name:
            identity,

        email:
            email

    };


    save();


    closeModal(
        "loginModal"
    );


    updateProfile();


    showToast(
        `✓ Selamat datang, ${identity}!`
    );


    /*
     * Kalau sebelumnya user
     * menekan Beli / Keranjang,
     * lanjutkan produk tersebut.
     */

    if (
        currentProduct
    ) {

        const productId =
            currentProduct.id;


        currentProduct =
            null;


        addToCart(
            productId
        );


        /*
         * Setelah login dari
         * tombol beli, buka cart.
         */

        setTimeout(
            function () {

                openCart();

            },
            150
        );

    }

}


/* =========================================================
   ADMIN LOGIN
========================================================= */

function loginAdmin() {

    const username =
        $("adminUsername")
            ?.value
            .trim();


    const password =
        $("adminPassword")
            ?.value;


    if (
        username !==
        "admin"
    ) {

        showToast(
            "Username admin salah."
        );

        return;

    }


    if (
        password !==
        "admin123"
    ) {

        showToast(
            "Password admin salah."
        );

        return;

    }


    /*
     * ADMIN LOGIN VALID
     */

    adminLoggedIn =
        true;


    closeModal(
        "adminLoginModal"
    );


    showScreen(
        "adminPage"
    );


    updateAdmin();


    showToast(
        "✓ Login admin berhasil."
    );

}


/* =========================================================
   ADMIN UPDATE
========================================================= */

function updateAdmin() {

    if (
        !adminLoggedIn
    ) {

        return;

    }


    const revenue =
        state.orders.reduce(
            (
                total,
                order
            ) =>
                total +
                Number(
                    order.total ||
                    0
                ),

            0
        );


    const statRevenue =
        $("statRevenue");


    const statOrders =
        $("statOrders");


    const statProcess =
        $("statProcess");


    const statProducts =
        $("statProducts");


    if (statRevenue) {

        statRevenue.textContent =
            rupiah(
                revenue
            );

    }


    if (statOrders) {

        statOrders.textContent =
            state.orders.length;

    }


    if (statProcess) {

        statProcess.textContent =
            state.orders.filter(
                order =>
                    order.status ===
                    "Dikemas"
            ).length;

    }


    if (statProducts) {

        statProducts.textContent =
            products.length;

    }


    renderAdminOrders();

    renderAdminProducts();

}


/* =========================================================
   ADMIN ORDERS
========================================================= */

function renderAdminOrders() {

    const box =
        $("adminOrders");


    if (!box) {

        return;

    }


    if (
        !state.orders.length
    ) {

        box.innerHTML = `

            <div
                class="admin-empty"
            >

                <div>
                    📦
                </div>

                <h3>
                    Belum ada pesanan
                </h3>

                <p>
                    Pesanan customer akan muncul
                    di sini.
                </p>

            </div>

        `;

        return;

    }


    box.innerHTML =
        state.orders
            .map(
                order => `

                    <div
                        class="admin-order-item"
                    >

                        <div
                            class="admin-order-top"
                        >

                            <strong>
                                ${escapeHtml(
                                    order.id
                                )}
                            </strong>


                            <span
                                class="status"
                            >
                                ${escapeHtml(
                                    order.status
                                )}
                            </span>

                        </div>


                        <p>

                            ${escapeHtml(
                                order.user
                            )}

                            •

                            ${order.items.length}
                            produk

                            •

                            ${rupiah(
                                order.total
                            )}

                        </p>


                        <small>

                            ${escapeHtml(
                                order.date
                            )}

                            •

                            ${escapeHtml(
                                String(
                                    order.payment
                                )
                            ).toUpperCase()}

                        </small>


                        ${
                            order.status !==
                            "Dikirim"

                                ? `

                                    <button
                                        onclick="
                                            completeOrder(
                                                '${escapeHtml(
                                                    order.id
                                                )}'
                                            )
                                        "
                                    >
                                        Tandai Dikirim
                                    </button>

                                `

                                : ""

                        }

                    </div>

                `
            )
            .join(
                ""
            );

}


/* =========================================================
   COMPLETE ORDER
========================================================= */

function completeOrder(
    id
) {

    if (
        !adminLoggedIn
    ) {

        openModal(
            "adminLoginModal"
        );

        return;

    }


    const order =
        state.orders.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    id
                )
        );


    if (!order) {

        showToast(
            "Pesanan tidak ditemukan."
        );

        return;

    }


    order.status =
        "Dikirim";


    order.shipping =
        "Pesanan sudah diserahkan kepada kurir";


    save();

    updateAdmin();

    renderOrders();


    showToast(
        "Status pesanan diperbarui."
    );

}


/* =========================================================
   ADMIN PRODUCT LIST
========================================================= */

function renderAdminProducts() {

    const box =
        $("adminProductList");


    if (!box) {

        return;

    }


    box.innerHTML =
        products
            .map(
                product => `

                    <div
                        class="admin-product"
                    >

                        <img
                            src="${escapeHtml(
                                product.image
                            )}"
                            alt="${escapeHtml(
                                product.name
                            )}"
                            onerror="
                                imageError(this)
                            "
                        >


                        <div
                            class="admin-product-info"
                        >

                            <strong>
                                ${escapeHtml(
                                    product.name
                                )}
                            </strong>

                            <span>
                                ${escapeHtml(
                                    product.category
                                )}
                            </span>

                        </div>


                        <strong>
                            ${rupiah(
                                product.price
                            )}
                        </strong>


                        <div
                            class="admin-product-actions"
                        >

                            <button
                                class="edit-btn"
                                onclick="
                                    editProduct(
                                        ${product.id}
                                    )
                                "
                            >
                                Edit
                            </button>


                            <button
                                class="delete-btn"
                                onclick="
                                    deleteProduct(
                                        ${product.id}
                                    )
                                "
                            >
                                Hapus
                            </button>

                        </div>

                    </div>

                `
            )
            .join(
                ""
            );

}


/* =========================================================
   ADD PRODUCT EDITOR
========================================================= */

function openProductEditor() {

    if (
        !adminLoggedIn
    ) {

        openModal(
            "adminLoginModal"
        );


        return;

    }


    if ($("editorTitle")) {

        $("editorTitle")
            .textContent =
            "Tambah Produk";

    }


    if ($("editorId")) {

        $("editorId")
            .value =
            "";

    }


    if ($("editorName")) {

        $("editorName")
            .value =
            "";

    }


    if ($("editorCategory")) {

        $("editorCategory")
            .value =
            "SMARTPHONE";

    }


    if ($("editorPrice")) {

        $("editorPrice")
            .value =
            "";

    }


    if ($("editorRating")) {

        $("editorRating")
            .value =
            "4.8";

    }


    if ($("editorTag")) {

        $("editorTag")
            .value =
            "NEW";

    }


    if ($("editorImage")) {

        $("editorImage")
            .value =
            "images/";

    }


    if ($("editorVideo")) {

        $("editorVideo")
            .value =
            "videos/";

    }


    if ($("editorDescription")) {

        $("editorDescription")
            .value =
            "";

    }


    if ($("editorSpecs")) {

        $("editorSpecs")
            .value =
            "";

    }


    openModal(
        "productEditorModal"
    );

}


/* =========================================================
   EDIT PRODUCT
========================================================= */

function editProduct(
    id
) {

    if (
        !adminLoggedIn
    ) {

        openModal(
            "adminLoginModal"
        );

        return;

    }


    const product =
        products.find(
            item =>
                item.id ===
                id
        );


    if (!product) {

        showToast(
            "Produk tidak ditemukan."
        );

        return;

    }


    if ($("editorTitle")) {

        $("editorTitle")
            .textContent =
            "Edit Produk";

    }


    if ($("editorId")) {

        $("editorId")
            .value =
            product.id;

    }


    if ($("editorName")) {

        $("editorName")
            .value =
            product.name;

    }


    if ($("editorCategory")) {

        $("editorCategory")
            .value =
            product.category;

    }


    if ($("editorPrice")) {

        $("editorPrice")
            .value =
            product.price;

    }


    if ($("editorRating")) {

        $("editorRating")
            .value =
            product.rating;

    }


    if ($("editorTag")) {

        $("editorTag")
            .value =
            product.tag;

    }


    if ($("editorImage")) {

        $("editorImage")
            .value =
            product.image;

    }


    if ($("editorVideo")) {

        $("editorVideo")
            .value =
            product.video;

    }


    if ($("editorDescription")) {

        $("editorDescription")
            .value =
            product.description;

    }


    if ($("editorSpecs")) {

        $("editorSpecs")
            .value =
            Object
                .entries(
                    product.specs ||
                    {}
                )
                .map(
                    (
                        [
                            key,
                            value
                        ]
                    ) =>
                        `${key}: ${value}`
                )
                .join(
                    "\n"
                );

    }


    openModal(
        "productEditorModal"
    );

}


/* =========================================================
   SAVE PRODUCT EDITOR
========================================================= */

function saveProductEditor() {

    if (
        !adminLoggedIn
    ) {

        openModal(
            "adminLoginModal"
        );

        return;

    }


    const id =
        Number(
            $("editorId")
                ?.value ||
            0
        );


    const name =
        $("editorName")
            ?.value
            .trim();


    const category =
        $("editorCategory")
            ?.value ||
        "SMARTPHONE";


    const price =
        Number(
            $("editorPrice")
                ?.value ||
            0
        );


    const rating =
        Number(
            $("editorRating")
                ?.value ||
            4.8
        );


    const tag =
        $("editorTag")
            ?.value
            .trim() ||
        "NEW";


    const image =
        $("editorImage")
            ?.value
            .trim();


    const video =
        $("editorVideo")
            ?.value
            .trim();


    const description =
        $("editorDescription")
            ?.value
            .trim() ||
        "";


    const specsText =
        $("editorSpecs")
            ?.value ||
        "";


    if (
        !name ||
        price <= 0
    ) {

        showToast(
            "Nama dan harga wajib diisi."
        );

        return;

    }


    const specs = {};


    specsText
        .split(
            "\n"
        )
        .forEach(
            line => {

                const separator =
                    line.indexOf(
                        ":"
                    );


                if (
                    separator >
                    0
                ) {

                    const key =
                        line
                            .slice(
                                0,
                                separator
                            )
                            .trim();


                    const value =
                        line
                            .slice(
                                separator +
                                1
                            )
                            .trim();


                    if (
                        key &&
                        value
                    ) {

                        specs[key] =
                            value;

                    }

                }

            }
        );


    /* =========================
       EDIT
    ========================= */

    if (id) {

        const product =
            products.find(
                item =>
                    item.id ===
                    id
            );


        if (!product) {

            showToast(
                "Produk tidak ditemukan."
            );

            return;

        }


        product.name =
            name;


        product.category =
            category;


        product.price =
            price;


        product.rating =
            rating;


        product.tag =
            tag;


        product.image =
            image ||
            product.image;


        product.video =
            video ||
            product.video;


        product.description =
            description;


        product.specs =
            specs;

    }


    /* =========================
       TAMBAH
    ========================= */

    else {

        const newId =
            products.length
                ? Math.max(
                    ...products.map(
                        product =>
                            Number(
                                product.id
                            )
                    )
                ) + 1

                : 1;


        products.push({

            id:
                newId,

            name:
                name,

            category:
                category,

            price:
                price,

            rating:
                rating,

            tag:
                tag,

            image:
                image ||
                "images/product.jpg",

            video:
                video ||
                "videos/product.mp4",

            description:
                description,

            specs:
                specs

        });

    }


    save();

    renderHome();

    renderAllProducts();

    updateAdmin();


    closeModal(
        "productEditorModal"
    );


    showToast(
        id
            ? "✓ Produk berhasil diubah."
            : "✓ Produk berhasil ditambahkan."
    );

}


/* =========================================================
   DELETE PRODUCT
========================================================= */

function deleteProduct(
    id
) {

    if (
        !adminLoggedIn
    ) {

        openModal(
            "adminLoginModal"
        );

        return;

    }


    const product =
        products.find(
            item =>
                item.id ===
                id
        );


    if (!product) {

        return;

    }


    const confirmed =
        window.confirm(
            "Hapus produk " +
            product.name +
            "?"
        );


    if (!confirmed) {

        return;

    }


    products =
        products.filter(
            item =>
                item.id !==
                id
        );


    state.cart =
        state.cart.filter(
            item =>
                item.id !==
                id
        );


    save();

    updateCart();

    renderHome();

    renderAllProducts();

    updateAdmin();


    showToast(
        "Produk berhasil dihapus."
    );

}


/* =========================================================
   KEYBOARD ESC
========================================================= */

document.addEventListener(
    "keydown",
    function (
        event
    ) {

        if (
            event.key ===
            "Escape"
        ) {

            closeAllModals();

        }

    }
);


/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

document.addEventListener(
    "click",
    function (
        event
    ) {

        if (
            event.target
                ?.classList
                ?.contains(
                    "modal"
                )
        ) {

            closeModal(
                event.target.id
            );

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

load();


document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderHome();

        renderAllProducts();

        updateCart();

        updateProfile();


        /*
         * Jangan pernah otomatis
         * masuk Admin.
         */

        adminLoggedIn =
            false;

    }
);
