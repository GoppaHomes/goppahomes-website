document.addEventListener('DOMContentLoaded', () => {
    fetch('properties_for_rent.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(property => displayProperty(property));
        });
});

// Display property with image, title, and icons on the left panel
function displayProperty(property) {
    const propertyList = document.getElementById('property-list');
    const propertyItem = document.createElement('div');
    propertyItem.classList.add('p-3', 'border-bottom', 'd-flex', 'align-items-start', 'property-item');

    // noinspection CssInvalidPropertyValue
    propertyItem.innerHTML = `
        <img src="${property.images_folder}/001.jpg" alt="${property.title}" 
             class="me-3" style="
                width: -webkit-fill-available;
                max-width: 250px;
                height: 100px;
                object-fit: cover;
                border-radius: 5px;">
        <div>
            <h6 class="mb-2">${property.title}</h6>
            <div class="d-flex align-items-center">
                <i class="fas fa-bed me-2 text-black"></i><span>${property.bedrooms}</span>
                <i class="fas fa-bath ms-4 me-2 text-black"></i><span>${property.bathrooms}</span>
                <i class="fas fa-car ms-4 me-2 text-black"></i><span>${property.car_spaces}</span>
            </div>
        </div>
    `;

    propertyItem.style.cursor = 'pointer';
    propertyItem.addEventListener('click', () => displayPropertyDetails(property));
    propertyList.appendChild(propertyItem);
}

// Display property details on the right
function displayPropertyDetails(property) {
    const propertyDetails = document.getElementById('property-details');
    propertyDetails.innerHTML = `
        <h3>${property.title}</h3>
        <p>${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.postcode}</p>
        <p><strong>Price:</strong> $${property.price.toLocaleString()}</p>
        <p><strong>Description:</strong> ${property.description}</p>
        <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
        <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
        <p><strong>Car Spaces:</strong> ${property.car_spaces}</p>
        <p><strong>Land Size:</strong> ${property.land_size}</p>
        <p><strong>Floors:</strong> ${property.floors}</p>
        <div class="row" id="image-gallery"></div>
    `;
    loadPropertyImages(property.images_folder);
}

// Load property images dynamically
function loadPropertyImages(folderPath) {
    const gallery = document.getElementById('image-gallery');
    gallery.innerHTML = ''; // Clear previous images
    for (let i = 1; i <= 5; i++) {
        const img = document.createElement('img');
        img.src = `${folderPath}/${String(i).padStart(3, '0')}.jpg`;
        img.alt = `Property Image ${i}`;
        img.className = 'col-md-4 mb-3';
        img.onerror = function () {
            this.style.display = 'none';
        }; // Hide if image doesn't exist
        gallery.appendChild(img);
    }
}
