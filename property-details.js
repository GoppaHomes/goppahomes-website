// Get property ID from URL
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('id');

// Fetch both sale and rent properties
Promise.all([
    fetch('properties_for_sale.json').then(res => res.json()),
    fetch('properties_for_rent.json').then(res => res.json())
]).then(([saleProperties, rentProperties]) => {
    const allProperties = [...saleProperties, ...rentProperties];
    const property = allProperties.find(item => item.id === propertyId);

    if (property) {
        displayPropertyDetails(property);
    } else {
        document.getElementById('property-details').innerHTML = '<p>Property not found.</p>';
    }
});

// Display property details
function displayPropertyDetails(property) {
    document.getElementById('property-title').innerText = property.title;
    document.getElementById('property-address').innerText = `${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.postcode}`;
    document.getElementById('property-description').innerText = property.description;
    document.getElementById('property-price').innerText = property.price.toLocaleString();

    document.getElementById('property-features').innerHTML = `
    <p><strong>Bedrooms:</strong> ${property.bedrooms}</p>
    <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
    <p><strong>Car Spaces:</strong> ${property.car_spaces}</p>
    <p><strong>Land Size:</strong> ${property.land_size}</p>
    <p><strong>Floors:</strong> ${property.floors}</p>
  `;

    fetchImages(property.images_folder);
}

// Load all images dynamically
function fetchImages(folderPath) {
    const gallery = document.getElementById('image-gallery');
    for (let i = 1; i <= 5; i++) { // Assuming max 5 images
        const img = document.createElement('img');
        img.src = `${folderPath}/${String(i).padStart(3, '0')}.jpg`;
        img.alt = `Property Image ${i}`;
        img.className = 'col-md-4 mb-3';
        img.onerror = function() { this.style.display = 'none'; }; // Hide if image doesn't exist
        gallery.appendChild(img);
    }
}
