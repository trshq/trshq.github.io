
function loadHomepage() {
    const searchInput = document.querySelector('input[type="search"]');
    const searchDropdown = createSearchDropdown();
    const productContainer = document.getElementById('product-section');
    const flattenedProducts = Object.values(products).flat();
    showRecommendations(productContainer);
    searchInput.addEventListener("input", (e) => handleSearchInput(e, flattenedProducts, searchDropdown, searchInput));
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target)) {
            searchDropdown.style.display = "none";
        }
    });

    loadAd();

    showBillboard();
}
function openAdPopup() {
    document.getElementById("ad-popup").style.display = "flex";
    document.body.style.overflow = "hidden";
}

function closeAdPopup() {
    document.getElementById("ad-popup").style.display = "none";
    document.body.style.overflow = ""; 
}

function loadAd() {
    // if (localStorage.getItem("hasSeenAd") === "yes") return;
    setTimeout(openAdPopup, 3000);
    localStorage.setItem("hasSeenAd", "yes");
}

const openPopup = document.getElementById('openPopup');
const closePopup = document.getElementById('closePopup');
const popupOverlay = document.getElementById('popupOverlay');

openPopup.addEventListener('click', () => popupOverlay.style.display = 'block');
closePopup.addEventListener('click', () => popupOverlay.style.display = 'none');
popupOverlay.addEventListener('click', (event) => {
    if (event.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});

const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Thank you for contacting us!');
    popupOverlay.style.display = 'none';
    contactForm.reset();
});

function createSearchDropdown() {
    const dropdown = document.createElement("ul");
    dropdown.className = "dropdown-menu";
    Object.assign(dropdown.style, {
        position: "absolute",
        zIndex: "1000",
        top: "60px",
        display: "none",
        listStyleType: "none",
        padding: "10px",
        margin: "0",
        backgroundColor: "white",
        border: "1px solid #ddd"
    });
    document.querySelector('input[type="search"]').parentNode.appendChild(dropdown);
    return dropdown;
}


function showRecommendations(container) {
    if (!container) return;
    Object.values(products).flat().forEach((item) => {
        container.innerHTML += generateProductCard(item);
    });
}

function updateItems(category) {
    const productContainer = document.getElementById('product-section');
    const filteredProducts = category === 'all' ? Object.values(products).flat() : Object.values(products[category] || {}).flat();

    productContainer.innerHTML = "";

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            productContainer.innerHTML += generateProductCard(product);
        });
    } else {
        productContainer.innerHTML = "<p>No products found for this category.</p>";
    }
}


function generateProductCard(item) {
    return `
        <div class="mycol d-flex justify-content-around mb-4">
            <div class="card" style="width: 15rem; height: auto;">
                <img src="./assets/img/products/${item.src + item.variants_src[0]}" class="card-img-top product-image" alt="${item.name}">
                <button onclick="goToOrder('${item.name}')" class="btn btn-primary mt-auto hover-button">Order Now</button>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.short_description}</p>
                    <div class="mt-auto">
                        <div class="card-text">₱${item.price}</div>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star checked"></span>
                        <span class="fa fa-star"></span>
                    </div>
                </div>
            </div>
        </div>`;
}



function handleSearchInput(event, products, dropdown, input) {
    const query = event.target.value.toLowerCase();
    dropdown.innerHTML = "";

    if (query.trim() === "") {
        dropdown.style.display = "none";
        return;
    }

    const matches = products.filter(product => product.name.toLowerCase().includes(query));
    dropdown.style.display = matches.length > 0 ? "block" : "none";

    matches.forEach(product => {
        const listItem = document.createElement("li");
        listItem.textContent = product.name;
        Object.assign(listItem.style, {
            cursor: "pointer",
            padding: "5px 10px"
        });

        listItem.addEventListener("click", () => {
            goToOrder(product.name);
            dropdown.style.display = "none";
            input.value = product.name;
        });

        dropdown.appendChild(listItem);
    });
}


function goToOrder(productName) {
    const product = findProductByName(productName);
    if (product) {
        localStorage.setItem("product", JSON.stringify(product));
        window.location.href = './product.html';
    }
}


function findProductByName(name) {
    return Object.values(products).flat().find(product => product.name === name);
}

function loadGallery() {
    const galleryContainer = document.getElementById("gallery-container");
    const categories = [
        ["Trisha0.jpg", "Trisha1.jpg", "Trisha2.jpg", "Trisha3.jpg", "Trisha4.jpg","Shaz0.jpg"],
        [, "Shaz1.jpg", "Shaz2.jpg", "Shaz3.jpg", "Shaz4.jpg", "Shaz5.jpg","Alexa0.jpg"],
        [, "Alexa1.jpg", "Alexa2.jpg", "Alexa3.jpg","Gelai0.jpg","Gelai1.jpg","Gelai2.jpg"],
        ["Gelai3.jpg","Gelai4.jpg","Gelai5.jpg","Gelai6.jpg", "Gelai7.jpg", "Gelai8.jpg"],
        [,"Gelai9.jpg","Abi0.jpg", "Mika0.jpg", "Tina0.jpg", "Triplets.jpg", "Trisha_Mika.jpg" ],
    ];
    let currentCategoryIndex = 0;

    function renderImages() {
        galleryContainer.innerHTML = "";
        const images = categories[currentCategoryIndex];

        images.forEach(image => {
            galleryContainer.innerHTML += generateGalleryCard(image);
        });
    }

    function generateGalleryCard(image) {
        return `
            <div class="col-12 col-sm-6 col-md-4 d-flex justify-content-center mb-1">
                <div class="card shadow-sm" style="width: 100%; max-width: 300px;">
                    <img class="card-img-top" src="./assets/img/gallery/${image}" style="object-fit: cover; height: 250px; width: 100%;" alt="Gallery Image">
                </div>
            </div>`;
    }

    function updateNavigation() {
        document.getElementById("prev-btn").disabled = currentCategoryIndex === 0;
        document.getElementById("next-btn").disabled = currentCategoryIndex === categories.length - 1;
    }

    document.getElementById("prev-btn").addEventListener("click", () => {
        if (currentCategoryIndex > 0) {
            currentCategoryIndex--;
            renderImages();
            updateNavigation();
        }
    });

    document.getElementById("next-btn").addEventListener("click", () => {
        if (currentCategoryIndex < categories.length - 1) {
            currentCategoryIndex++;
            renderImages();
            updateNavigation();
        }
    });

    renderImages();
    updateNavigation();
}


function showBillboard() {
    var prod = ["", "", 
        "Glam Illuminating Sunscreen w/ SPF50 PA+++", 
        "Glam 30 Shade Color Palette", 
        "Glam Super Pure Night Serum (Niacinamide ++ Zinc)", 
        "Glam Long Lasting Body Mist (for women)", 
        "Glam Matte Bullet", 
        "Glam Perfume Hair Mist"]
    const carousel = document.getElementById("carousel-container");
    for (let i = 2; i <= 7; i++) {
        const div = document.createElement("a");
        div.href = "#"
        div.onclick = function () {
            goToOrder(prod[i]); 
        };
        div.className = `carousel-item${i === 2 ? " active" : ""}`;
        const img = document.createElement("img");
        img.src = `./assets/img/billboard/${i}.jpg` || `./assets/img/billboard/${i}.png`;
        img.className = "d-block w-100";
        div.appendChild(img);
        carousel.appendChild(div);
    }
}

function showProductInformation() {
    const product = JSON.parse(localStorage.getItem("product"));
    if (product) {
        document.getElementById("item-image").src = `./assets/img/products/${product.src + product.variants_src[0]}`;
        document.getElementById("item-name").textContent = product.name;
        document.getElementById("item-description").textContent = product.description;
        document.getElementById("item-price").textContent = `₱${product.price}`;
        document.getElementById("item-variant").innerHTML = `<strong>Variant:</strong> ${product.variants[0]}`;

        const variantsContainer = document.getElementById("item-variants-container");
        product.variants.forEach((variant, index) => {
            variantsContainer.innerHTML += generateVariantDiv(product, index, variant);
        });
    }
}

function generateVariantDiv(product, index, variant) {
    return `
        <div class="circle" style="width: 60px; height: 60px; background-image: url('./assets/img/products/${product.src + product.variants_src[index]}'); background-size: cover; background-position: center;" onclick="changeVariant(${index}, '${product.name}')">
        </div>`;
}

function changeVariant(index, productName) {
    const product = findProductByName(productName);
    if (product) {
        document.getElementById("item-variant").innerHTML = `<strong>Variant:</strong> ${product.variants[index]}`;
        document.getElementById("item-image").src = `./assets/img/products/${product.src + product.variants_src[index]}`;
    }
}


var products = {
    nocategory: [
        {
            name: "Glam Hydrating & Pore-refining Primer",
            price: 499.00,
            short_description: "smooth, even base for makeup application.",
            description: "Prepare your skin for perfection with Glam Hydrating & Pore-refining Primer, creating a smooth, even base for makeup application.",
            src: "./nocategory/primer/",
            variants_src: ["mini.png", "reg.png",],
            variants: ["The mini variant of our Glam Hydrating & Pore-refining Primer", "Achieve a flawless base with Glam Hydrating & Pore-refining Primer, which minimizes the appearance of pores on the face."],
        },
        {
            name: "Glam Enchanted Glow Highlighter",
            price: 299.00,
            short_description: "Illuminate your best features.",
            description: "Glow like never before with Glam Enchanted Glow Highlighter, designed to illuminate your best features.",
            src: "./nocategory/highlighter/",
            variants_src: ["Dreamy.png", "Enchanted.png", "Prism.png", "Strobe.png"],
            variants: ["Dreamy, a pink shade. Perfect for sweet looks.", "Enchanted, perfect for bold looks.", "Prism, a subtle brown shade.", "Strobe, a light shade for an effortless glow."],
        },
        {
            name: "Glam Waterproof Mascara",
            price: 299.00,
            short_description: "Waterproof Mascara",
            description: "Glam Waterproof Mascara delivers dramatic volume and length in a single coat while staying smudge-proof and waterproof.",
            src: "./nocategory/mascara/",
            variants_src: ["mini.png", "reg.png", "minireg.png"],
            variants: ["Mini Mascara - Try the mini variant of our mascara. Perfect for travels.", "Regular Mascara - Achieve attractive lashes in seconds with just one coat with Glam Regular Mascara.", "Mini Regular - Grab the mini regular variant of our mascara now! Perfect for beginners."]
        },
        {
            name: "Glam Long Wear Setting Spray",
            price: 399.00,
            short_description: "Hair Setting Spray",
            description: "Lock in your makeup with Glam Long Wear Setting Spray, ensuring a flawless look that lasts for hours.",
            src: "./nocategory/setting_spray/",
            variants_src: ["mini.png", "reg.png"],
            variants: ["Mini Setting Spray - Grab our mini setting spray and enjoy makeup that lasts for hours!", "Regular Setting Spray - Glam Long Wear Setting Spray ensures your makeup is locked in all throughout the day."]
        },
        {
            name: "Glam Double-Head Eyebrow Pencil",
            price: 199.00,
            short_description: "Precision and ease for perfectly shaped brows.",
            description: "This eyebrow pencil combines precision and ease for perfectly shaped brows.",
            src: "./nocategory/eyebrow_pencil/",
            variants_src: ["Coffee.png", "Dark.png"],
            variants: ["Coffee Brown, perfect for light eyebrows.", "tube variant, best applied using clean fingers."]
        },
        {
            name: "Glam Perfume Hair Mist",
            price: 299.00,
            short_description: "Hair Spray for shiny and smooth hair (Healthy Shiny Hair)",
            description: "Infuse your hair with fragrance and shine using the Glam Perfume Hair Mist.",
            src: "./nocategory/hair_mist/",
            variants_src: ["50ml.png", "162ml.png"],
            variants: ["50ml, The same hair mist that you love, just smaller in size. Perfect for travels.", "162ml, Our best-selling variant. Perfect for daily use."]
        },
        {
            name: "Glam Milky Whitening Soap",
            price: 399.00,
            short_description: "Soap (Glutathione + Alpha Arbutin Power)",
            description: "Brighten and nourish your skin with the Glam Milky Whitening Soap, powered by glutathione and alpha arbutin.",
            src: "./nocategory/milky_soap/",
            variants_src: ["heart.png", "regular.png"],
            variants: ["Heart Soap, Glam Essence’s original milky soap",
                "Regular Soap, Our best-selling milky soap, now in a simpler look."
            ]
        },
    ],
    foundations: [{
        name: "Glam High Coverage Foundation",
        price: 499.00,
        short_description: "Flawless natural looking foundation",
        description: "Glam High Coverage Foundation offers flawless, natural-looking coverage with a lightweight feel.",
        src: "./foundation/glam/",
        variants_src: ["Chinita.jpg", "Mestiza.jpg", "Morena.jpg"],
        variants: ["Chinita - A neutral shade.", "Mestiza - A light ivory shade.", "Morena - A warm shade."]
    }, ],
    lipsticks: [{
            name: "Glam Matte Bullet",
            price: 599.00,
            short_description: "Rich and vibrant lipstick",
            description: "Glam Matte Bullet delivers rich, vibrant color in just one swipe, leaving your lips soft and matte.",
            src: "./lipsticks/glam_matte/",
            variants_src: ["Dulce.png", "Amara.png", "Blaire.png", "Charlotte.png"],
            variants: [
                "Dulce, a bold, brown shade.",
                "Amara, a toasted brown shade.",
                "Blaire, a warm nude shade.",
                "Charlotte, a neutral nude shade.",

            ]
        },
        {
            name: "Glam Lip Gloss",
            price: 299.00,
            short_description: "Mirror Lip Glaze Tint",
            description: "Enhance your lips with Glam Mirror Lip Glaze Tint, combining the shine of a gloss with the lasting color of a tint.",
            src: "./lipsticks/glam_lipgloss/",
            variants_src: ["Apple.png", "Berry.png", "Cherry.png", "Peach.png"],
            variants: ["Apple - A beige nude color", "Berry - A lively coral beige color", "Cherry - A bright sugar-coated grapefruit orange color", "Peach - A lovely soft pink color"]
        },
        {
            name: "Glam Lipstick",
            price: 599.00,
            short_description: "Matte Lipstick",
            description: "Luscious lip gloss and lipstick hooked up, and now you can get Gloss Bomb’s explosive shine in a color-packed stick. The moisture-lock formula is packed with lip-loving ingredients to condition, nourish and keep lips lookin' plump.",
            src: "./lipsticks/glam_lipstick/",
            variants_src: ["Peach.png", "Cutesy_Pink.png", "Firey_Red.png", "Citrus_Orange.png", "Hot_Fuschia.png"],
            variants: ["Peach", "Cutesy Pink", "Fiery Red", "Citrus Orange", "Hot Fuschia"]
        },

        {
            name: "Glam Lip Therapy",
            price: 399.00,
            short_description: "Moisturizing & Soothing to Lips",
            description: "Soothe and hydrate your lips with the Glam Lip Therapy, a must-have for soft, supple lips.",
            src: "./lipsticks/glam_lip_therapy/",
            variants_src: ["lucious.png", "red.png", "transparen.png"],
            variants: ["Luscious Pink gives a subtle pink color on your lips and", "Seductive Red gives a subtle red color on your lips and provides hydration to your lips.", "Transparent gives your lips a flawless shine and provides hydration to your lips."]
        },
    ],
    palettes: [{
            name: "Glam 30 Shade Color Palette",
            price: 699.00,
            short_description: "Eyeshadow Palette",
            description: "Unleash your creativity with the Glam Essence Eyeshadow Palette, featuring a stunning mix of matte and shimmer shades.",
            src: "./palettes/glam_eyeshadow_palette/",
            variants_src: ["Muted.png", "Radiant.png", "Rosy.png", "Warm.png"],
            variants: ["Muted - For natural, elegant looks.", "Radiant - For vibrant, bold looks.", "Rosy - For sweet, charming looks.", "Warm - For eye-catching looks, perfect for warm tones."]
        },
        {
            name: "Glam Soft Blurring Blush",
            price: 199.00,
            short_description: "Soft Matte Blush",
            description: "Provides a soft, velvety touch of color to your cheeks.",
            src: "./palettes/glam_soft_blurring_blush/",
            variants_src: ["Alexa.png", "Gelai.png", "Shaznay.png", "Trisha.png"],
            variants: ["Alexa, Rosy Pink Shade", "Gelai, a neutral rose shade", "Shaznay, a cool pink shade.", "Trisha, a light peachy shade"]
        }
    ],
    skincare: [{
            name: "Glam Pink Facial Clay Mask (w/ Niacinamide and Whitening Skin Care)",
            price: 399.00,
            short_description: "Facial Clay Mask",
            description: "Detoxify and brighten your skin with the Glam Pink Facial Clay Mask, enriched with niacinamide.",
            src: "./nocategory/face_mask/",
            variants_src: ["roll.png", "tube.png"],
            variants: ["roll-on variant, perfect for direct application onto the face.", "tube variant, best applied using clean fingers."]
        },
        {
            name: "Glam Super Pure Night Serum (Niacinamide ++ Zinc)",
            price: 299.00,
            short_description: "Night Serum",
            description: "Transform your skin overnight with the Glam Super Pure Night Serum, infused with niacinamide and zinc.",
            src: "./skincare/serum/",
            variants_src: ["bounce.png", "fresh.png", "glow.png"],
            variants: ["Super Bounce - Achieve a soft, youthful skin with Super Bounce serum.",
                "Super Fresh - Achieve a fresh, radiant skin with Super Fresh serum.",
                "Super Glow - Achieve a healthy, glowing skin with Super Glow serum."
            ]
        },
        {
            name: "Glam Watermelon Glow Toner",
            price: 399.00,
            short_description: "Pore Tightening Effect, Hydrating, & PHA + BHA",
            description: "Refresh your skin with the Glam Watermelon Glow Toner, formulated to hydrate and tighten pores.",
            src: "./skincare/toner/",
            variants_src: ["mini.png", "reg.png"],
            variants: ["Mini Glow Toner - Grab the mini variant of our Watermelon Glow toner! Perfect for travels.", "Regular Glow Toner - Hydrate your skin and tighten your pores with our Watermelon Glow Toner."]
        },
        {
            name: "Glam Illuminating Sunscreen w/ SPF50 PA+++",
            price: 599.00,
            short_description: "Protective Sunscreen",
            description: "Protect and glow with the Glam Illuminating Sunscreen, offering SPF50 PA+++ for superior sun protection.",
            src: "./sunscreens/spf50/",
            variants_src: ["base.png"],
            variants: ["SPF50 PA+++"]
        },
        {
            name: "Glam Whitening & Glow Lotion w/ SPF30 PA+++",
            price: 599.00,
            short_description: "Protective Sunscreen",
            description: "Nourish and protect your skin with the Glam Whitening & Glow Lotion, enriched with SPF30 PA+++",
            src: "./sunscreens/spf30/",
            variants_src: ["cream.png", "serum.png"],
            variants: ["Cream, Get the glow you desire with the OG version of Glam Whitening & Glow Lotion.", "Serum, Our Glam Whitening & Glow Lotion, now in a lighter formula."]
        }
    ],
    perfumes: [{
        name: "Glam Long Lasting Body Mist (for women)",
        price: 259.00,
        short_description: "Soft captivating scent",
        description: "Stay fresh and confident with the Glam Long Lasting Body Mist, designed for women who love soft, captivating scents.",
        src: "./perfume/glam_mist/",
        variants_src: ["Flora.png", "Shauna.png"],
        variants: ["Flora, a sweet floral scent perfect for daily use", "Shauna, a seductive fragrance perfect for occasions"]
    }],
    moisturizers: [{
        name: "Glam Niacinamide Whitening Moisturizer (w/ cooling effect)",
        price: 299.00,
        short_description: "Cooling Whitening Moisturizer",
        description: "Revitalize your skin designed to brighten and soothe with a cooling effect.",
        src: "./moisturizers/glam_niacinamide/",
        variants_src: ["base.png"],
        variants: ["Whitening Moisturizer"]
    }]
};