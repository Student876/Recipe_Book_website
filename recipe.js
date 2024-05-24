function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

async function fetchRecipes() {
    const ingredient = document.getElementById('ingredient').value.trim();
    if (!ingredient) {
        alert('Please enter a favorite ingredient');
        return;
    }

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
        const data = await response.json();
        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Error fetching recipes. Please try again later.');
    }
}

async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        return null;
    }
}

async function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes-container');
    if (!recipes) {
        recipesContainer.innerHTML = '<p>No recipes found.</p>';
        return;
    }

    recipesContainer.innerHTML = '';

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        const recipeDetails = await fetchRecipeDetails(recipe.idMeal);
        if (recipeDetails) {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');
            recipeElement.innerHTML = `
                        <h2>${recipeDetails.strMeal}</h2>
                        <img src="${recipeDetails.strMealThumb}" alt="${recipeDetails.strMeal}" onclick="toggleRecipeDetails(this)">
                        <div class="recipe-details">
                            <p><strong>Ingredients:</strong></p>
                            <ul>
                                ${getIngredients(recipeDetails)}
                            </ul>
                            <p><strong>Instructions:</strong> ${recipeDetails.strInstructions}</p>
                        </div>
                    `;
            recipesContainer.appendChild(recipeElement);
        }
    }
}

function getIngredients(recipe) {
    let ingredients = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && measure) {
            ingredients += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredients;
}

function toggleRecipeDetails(img) {
    const recipeDetails = img.nextElementSibling;
    if (recipeDetails.style.display === 'block') {
        recipeDetails.style.display = 'none';
    } else {
        recipeDetails.style.display = 'block';
    }
}

document.getElementById('recipe-form').addEventListener('submit', saveRecipe);

function saveRecipe(event) {
    event.preventDefault();
    const id = document.getElementById('recipe-id').value || Date.now().toString();
    const title = document.getElementById('recipe-title').value;
    const ingredients = document.getElementById('recipe-ingredients').value;
    const instructions = document.getElementById('recipe-instructions').value;

    const recipe = { id, title, ingredients, instructions };
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const existingIndex = recipes.findIndex(r => r.id === id);
    if (existingIndex >= 0) {
        recipes[existingIndex] = recipe;
    } else {
        recipes.push(recipe);
    }

    localStorage.setItem('recipes', JSON.stringify(recipes));
    document.getElementById('recipe-form').reset();
    displayRecipesList();
}

function displayRecipesList() {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = recipes.map(recipe => `
        <div class="recipe-item">
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <button onclick="editRecipe('${recipe.id}')">Edit</button>
            <button onclick="deleteRecipe('${recipe.id}')">Delete</button>
        </div>
    `).join('');
}

function editRecipe(id) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = recipes.find(r => r.id === id);
    if (recipe) {
        document.getElementById('recipe-id').value = recipe.id;
        document.getElementById('recipe-title').value = recipe.title;
        document.getElementById('recipe-ingredients').value = recipe.ingredients;
        document.getElementById('recipe-instructions').value = recipe.instructions;
    }
}

function deleteRecipe(id) {
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes = recipes.filter(r => r.id !== id);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipesList();
}

document.addEventListener('DOMContentLoaded', displayRecipesList);


// Function to handle form submission
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Here you can add code to send the form data to your backend or handle it as needed
    // For demonstration purposes, you can log the form data to the console
    console.log(`Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
});
