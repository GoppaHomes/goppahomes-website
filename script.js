document.addEventListener('DOMContentLoaded', () => {
    // Event listeners for Buy and Rent buttons
    document.getElementById('buy-link').addEventListener('click', () => {
        loadProperties('sale');
    });

    document.getElementById('rent-link').addEventListener('click', () => {
        loadProperties('rent');
    });
});

// Function to load properties based on type (sale or rent)
function loadProperties(type) {
    const propertyListContainer = document.getElementById('property-list-container');
    const propertyListTitle = document.getElementById('property-list-title');
    const propertyList = document.getElementById('property-list');

    // Clear previous results
    propertyList.innerHTML = '';
    propertyListContainer.classList.remove('d-none');

    if (type === 'sale') {
        propertyListTitle.innerText = 'Properties for Sale';
        fetch('properties_for_sale.json')
            .then(response => response.json())
            .then(data => data.forEach(displayProperty));
    } else if (type === 'rent') {
        propertyListTitle.innerText = 'Properties for Rent';
        fetch('properties_for_rent.json')
            .then(response => response.json())
            .then(data => data.forEach(displayProperty));
    }
}

// Function to display properties
function displayProperty(property) {
    const propertyList = document.getElementById('property-list');
    const propertyCard = `
        <div class="col-md-4 mb-4">
            <div class="card shadow-sm h-100">
                <img src="${property.images_folder}/001.jpg" class="card-img-top" alt="${property.title}">
                <div class="card-body">
                    <h5 class="card-title">${property.title}</h5>
                    <p class="card-text">${property.description}</p>
                    <p class="card-text"><strong>Price:</strong> $${property.price.toLocaleString()}</p>
                    <a href="property-details.html?id=${property.id}" class="btn btn-primary">View Details</a>
                </div>
            </div>
        </div>
    `;
    propertyList.innerHTML += propertyCard;
}
