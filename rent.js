document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    fetch('properties_for_rent.json')
        .then(response => response.json())
        .then(data => {
            batchDisplayProperties(data, propertyId);

            // For large screens, show the property in the details pane
            if (propertyId && window.innerWidth >= 1400) {
                const selectedProperty = data.find(property => property.id === propertyId);
                if (selectedProperty) {
                    displayPropertyDetails(selectedProperty);
                } else {
                    document.getElementById('property-details').innerHTML = '<p class="text-center">Property not found.</p>';
                }
            }

            // For small screens, auto-toggle the correct property
            if (propertyId && window.innerWidth < 1400) {
                setTimeout(() => autoToggleProperty(propertyId), 100);  // Ensure toggle runs after DOM is fully rendered
            }
        });
});

// Auto-toggle the correct property on mobile via direct link
function autoToggleProperty(propertyId) {
    const propertyItems = document.querySelectorAll('.property-item');
    let propertyFound = false;

    propertyItems.forEach(item => {
        const link = item.querySelector('a')?.href;
        if (!link) return;

        const itemId = new URL(link, window.location.origin).searchParams.get('id');

        if (itemId === propertyId) {
            // Clear other highlights
            document.querySelectorAll('.property-item').forEach(item => {
                item.classList.remove('selected', 'active');
                const details = item.querySelector('.property-details');
                if (details) {
                    details.style.display = 'none';
                }
            });

            // Highlight and expand the correct property
            item.classList.add('selected', 'active');
            const selectedDetails = item.querySelector('.property-details');
            if (selectedDetails) {
                selectedDetails.style.display = 'block';
            }

            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            propertyFound = true;
        }
    });

    // Fallback if property isn't found
    if (!propertyFound) {
        console.error('Property not found in the list.');
    }
}

// Batch Display Properties with Responsive & Conditional Toggle
function batchDisplayProperties(properties, selectedId = null) {
    const propertyList = document.getElementById('property-list');
    const fragment = document.createDocumentFragment();

    properties.forEach(property => {
        const propertyItem = document.createElement('div');
        propertyItem.classList.add('p-3', 'border-bottom', 'd-flex', 'flex-column', 'property-item');

        // Apply 'selected' class if the property matches the selectedId
        if (property.id === selectedId) {
            propertyItem.classList.add('selected', 'active');  // Ensure both selected and active on load
        }

        propertyItem.innerHTML = `
            <div class="d-flex align-items-start">
                <img src="${property.images_folder}/001.jpg" alt="${property.title}" 
                     class="property-thumbnail me-3" loading="lazy">
                <div class="w-100">
                    <h6 class="mb-2">${property.title}</h6>
                    <div class="d-flex align-items-center mt-auto">
                        <i class="fas fa-bed me-2 text-black"></i><span>${property.bedrooms}</span>
                        <i class="fas fa-bath ms-4 me-2 text-black"></i><span>${property.bathrooms}</span>
                        <i class="fas fa-car ms-4 me-2 text-black"></i><span>${property.car_spaces}</span>
                    </div>
                </div>
            </div>

            <!-- Hidden property details for toggle on smaller screens -->
            <div class="property-details">
                <div class="position-relative mb-3">
                    <img src="${property.images_folder}/001.jpg" id="main-image-${property.id}" class="main-image" alt="main image">

                    <button class="nav-arrow left-arrow" id="prev-image-${property.id}"><i class="fas fa-chevron-left"></i></button>
                    <button class="nav-arrow right-arrow" id="next-image-${property.id}"><i class="fas fa-chevron-right"></i></button>
                </div>

                <div class="d-flex overflow-auto" id="thumbnail-container-${property.id}"></div>

                <h3 style="margin-top: 20px;">${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.postcode}</h3>
                <div class="d-flex align-items-center">
                    <i class="fas fa-bed me-2 text-black"></i><span>${property.bedrooms}</span>
                    <i class="fas fa-bath ms-3 me-2 text-black"></i><span>${property.bathrooms}</span>
                    <i class="fas fa-car ms-3 me-2 text-black"></i><span>${property.car_spaces}</span>
                    <span class="mx-2">•</span>
                    <span><strong>${property.land_size} m<sup>2</sup></strong></span>
                </div>

                <h5 style="margin-top: 20px;"><strong>$${property.price.toLocaleString()}</strong></h5>
                <p style="margin-top: 20px;"><strong>Description:</strong> ${property.description}</p>

                <!-- Share Button -->
                <button class="btn btn-outline-primary mt-3" id="share-button-${property.id}">
                    <i class="fas fa-share"></i> Share Listing
                </button>
            </div>
        `;

        // Handle click behavior and ensure highlight remains
        propertyItem.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove highlight from other properties
            document.querySelectorAll('.property-item').forEach(item => {
                item.classList.remove('selected', 'active');
                const details = item.querySelector('.property-details');
                if (details) {
                    details.style.display = 'none';
                }
            });

            // Apply highlight to the clicked property
            propertyItem.classList.add('selected', 'active');

            if (window.innerWidth < 1400) {
                const details = propertyItem.querySelector('.property-details');
                if (details) {
                    details.style.display = 'block';
                }
                history.pushState(null, '', `?id=${property.id}`);  // Update URL
            } else {
                displayPropertyDetails(property);
                history.pushState(null, '', `?id=${property.id}`);
            }
        });

        fragment.appendChild(propertyItem);
    });

    propertyList.appendChild(fragment);
}

// Display Property Details for Large Screens
function displayPropertyDetails(property) {
    const propertyDetails = document.getElementById('property-details');
    let currentImageIndex = 1;

    propertyDetails.innerHTML = `
        <div class="position-relative mb-3">
            <img src="${property.images_folder}/001.jpg" id="main-image" class="main-image" alt="main image">

            <button class="nav-arrow left-arrow" id="prev-image"><i class="fas fa-chevron-left"></i></button>
            <button class="nav-arrow right-arrow" id="next-image"><i class="fas fa-chevron-right"></i></button>
        </div>

        <div class="d-flex overflow-auto" id="thumbnail-container"></div>

        <h3 style="margin-top: 20px;">${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.postcode}</h3>
        <div class="d-flex align-items-center">
            <i class="fas fa-bed me-2 text-black"></i><span>${property.bedrooms}</span>
            <i class="fas fa-bath ms-3 me-2 text-black"></i><span>${property.bathrooms}</span>
            <i class="fas fa-car ms-3 me-2 text-black"></i><span>${property.car_spaces}</span>
            <span class="mx-2">•</span>
            <span><strong>${property.land_size} m<sup>2</sup></strong></span>
        </div>

        <h5 style="margin-top: 20px;"><strong>$${property.price.toLocaleString()}</strong></h5>
        <p style="margin-top: 20px;"><strong>Description:</strong> ${property.description}</p>

        <!-- Share Button -->
        <button class="btn btn-outline-primary mt-3" id="share-button">
            <i class="fas fa-share"></i> Share Listing
        </button>
    `;

    loadPropertyImages(property.images_folder, currentImageIndex);

    document.getElementById('share-button').addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?id=${property.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Listing URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy URL:', err);
        });
    });

    document.getElementById('prev-image').addEventListener('click', () => navigateImages(-1, property.images_folder));
    document.getElementById('next-image').addEventListener('click', () => navigateImages(1, property.images_folder));
}

// Efficient Image Navigation
function navigateImages(direction, folderPath) {
    const mainImage = document.getElementById('main-image');
    let currentImageIndex = parseInt(mainImage.src.match(/(\d+)\.jpg$/)[1]);
    currentImageIndex += direction;

    const newImg = new Image();
    newImg.src = `${folderPath}/${String(currentImageIndex).padStart(3, '0')}.jpg`;
    newImg.onload = () => mainImage.src = newImg.src;
}

// Load All Available Images with Immediate Thumbnails
function loadPropertyImages(folderPath) {
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const mainImage = document.getElementById('main-image');
    thumbnailContainer.innerHTML = '';

    let imageIndex = 1;
    let firstImageLoaded = false;

    while (imageIndex <= 20) {
        const imgSrc = `${folderPath}/${String(imageIndex).padStart(3, '0')}.jpg`;

        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.className = 'thumbnail-image';
        thumbnail.loading = "lazy";
        thumbnail.style.opacity = 0.5;

        thumbnail.addEventListener('click', () => {
            mainImage.src = imgSrc;
        });

        thumbnailContainer.appendChild(thumbnail);

        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            thumbnail.style.opacity = 1;
            if (!firstImageLoaded) {
                mainImage.src = imgSrc;
                firstImageLoaded = true;
            }
        };

        img.onerror = () => {
            thumbnailContainer.removeChild(thumbnail);
            if (!firstImageLoaded && imageIndex === 1) {
                mainImage.src = '';
            }
        };

        imageIndex++;
    }
}
