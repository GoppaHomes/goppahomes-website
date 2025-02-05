document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');

    fetch('properties_for_sale.json')
        .then(response => response.json())
        .then(data => {
            batchDisplayProperties(data, propertyId);  // Pass propertyId to highlight if needed

            // If there's a propertyId in the URL, display its details
            if (propertyId) {
                const selectedProperty = data.find(property => property.id === propertyId);
                if (selectedProperty) {
                    displayPropertyDetails(selectedProperty);
                } else {
                    document.getElementById('property-details').innerHTML = '<p class="text-center">Property not found.</p>';
                }
            } else {
                // Show a default message if no property is selected
                document.getElementById('property-details').innerHTML = '<p class="text-center">Select a property to view details.</p>';
            }
        });
});

// Batch Display Properties
function batchDisplayProperties(properties, selectedId = null) {
    const propertyList = document.getElementById('property-list');
    const fragment = document.createDocumentFragment();

    properties.forEach(property => {
        const propertyItem = document.createElement('div');
        propertyItem.classList.add('p-3', 'border-bottom', 'd-flex', 'align-items-start', 'property-item');

        // Add the 'selected' class if this property matches the selected ID
        if (property.id === selectedId) {
            propertyItem.classList.add('selected');
        }

        propertyItem.innerHTML = `
            <a href="?id=${property.id}" class="d-flex text-decoration-none text-dark w-100">
                <img src="${property.images_folder}/001.jpg" alt="${property.title}" 
                     class="property-thumbnail me-3" loading="lazy">
                <div>
                    <h6 class="mb-2">${property.title}</h6>
                    <div class="d-flex align-items-center">
                        <i class="fas fa-bed me-2 text-black"></i><span>${property.bedrooms}</span>
                        <i class="fas fa-bath ms-4 me-2 text-black"></i><span>${property.bathrooms}</span>
                        <i class="fas fa-car ms-4 me-2 text-black"></i><span>${property.car_spaces}</span>
                    </div>
                </div>
            </a>
        `;

        fragment.appendChild(propertyItem);
    });

    propertyList.appendChild(fragment);  // Append all at once for speed
}

// Display Property Details with Optimized Image Loading
function displayPropertyDetails(property) {
    const propertyDetails = document.getElementById('property-details');
    let currentImageIndex = 1;

    propertyDetails.innerHTML = `
        <div class="position-relative mb-3">
            <img src="${property.images_folder}/001.jpg" id="main-image" class="main-image">

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

    // Share Button Functionality
    document.getElementById('share-button').addEventListener('click', () => {
        const shareUrl = `${window.location.origin}${window.location.pathname}?id=${property.id}`;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Listing URL copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy URL:', err);
        });
    });

    // Navigation Arrows
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

// Load All Available Images Efficiently with Immediate Thumbnail Display
function loadPropertyImages(folderPath) {
    const thumbnailContainer = document.getElementById('thumbnail-container');
    const mainImage = document.getElementById('main-image');
    thumbnailContainer.innerHTML = '';

    let imageIndex = 1;
    let firstImageLoaded = false;

    while (imageIndex <= 20) {  // Assume no more than 20 images
        const imgSrc = `${folderPath}/${String(imageIndex).padStart(3, '0')}.jpg`;

        // Create thumbnail element immediately
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.className = 'thumbnail-image';
        thumbnail.loading = "lazy";
        thumbnail.style.opacity = 0.5;  // Indicate loading state visually

        // Add click event to change the main image
        thumbnail.addEventListener('click', () => {
            mainImage.src = imgSrc;
        });

        // Append the thumbnail to the container immediately
        thumbnailContainer.appendChild(thumbnail);

        // Load the image and update once it's fully loaded
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
            thumbnail.style.opacity = 1;  // Fully loaded thumbnail
            if (!firstImageLoaded) {
                mainImage.src = imgSrc;  // Set the first successfully loaded image as the main image
                firstImageLoaded = true;
            }
        };

        img.onerror = () => {
            thumbnailContainer.removeChild(thumbnail);  // Remove thumbnail if image fails to load
            if (!firstImageLoaded && imageIndex === 1) {
                mainImage.src = '';  // Clear the main image if no images are available
            }
        };

        imageIndex++;
    }
}
