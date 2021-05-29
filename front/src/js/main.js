// Imports files
import Http from './http.service.js'
import '../styles/styles.scss'

let productHttpService = new Http('/products/');
let productsContainer = document.querySelector(".catalog");
let cardsContainer = document.querySelector(".catalog__cards");
let cardsDescriptionContainer = document.querySelector(".catalog__card-description");
let categoryContainer = document.querySelector(".catalog__category");

main();

function main() {
    
    productHttpService.getLimit(10).then(response => response.json())
    .then(data => createProductsCards(data, cardsContainer));

    productsContainer.addEventListener('click', (event) => {

        let cardTitleClick = event.target.closest('.card__title');
        if(cardTitleClick) {
            const id = event.target.closest('.card').dataset.id;
            productHttpService.get(id).then(response => response.json())
            .then((data) => createSelectedCard(data, cardsDescriptionContainer));
        }
        
        let btnCategoryClick = event.target.closest('.description-card__show-category');
        if(btnCategoryClick) {
            let categoryName = event.target.closest('.description-card__show-category').dataset.category;
            productHttpService.getCategory(categoryName).then(response => response.json())
            .then(data => {
                let categoryContainerInner = `
                <div class="catalog__category__title">
                <h2>Products of ${categoryName}</h2>
                </div>
                <div class="catalog__category__cards"></div>
                `
                categoryContainer.innerHTML = categoryContainerInner;
                let categoryCardsContainer = document.querySelector(".catalog__category__cards");
                createProductsCards(data, categoryCardsContainer);
            })
        }

        let selectedCard = event.target.closest('.selected-card');

        let btnDeleteClick = event.target.closest('.description-card__delete');
        if(btnDeleteClick) {
            const id = selectedCard.dataset.id;
            productHttpService.delete(id).then(() => cardsDescriptionContainer.innerHTML = '').then(() => {
                productHttpService.getLimit(10).then(response => response.json())
                .then(data => createProductsCards(data, cardsContainer));
            });
        }

        const modal = document.querySelector('.modal');
        const modalOverlay = document.querySelector('.modal__overlay');

        let btnEditClick = event.target.closest('.description-card__edit');
        if(btnEditClick) {
            modal.style.display = "block"
            modalOverlay.style.display = "block"
        }

        let btnSubmitClick = event.target.closest('._form-submit');
        if(btnSubmitClick) {
            event.preventDefault();
            const form = document.querySelector("#form");
            const id = selectedCard.dataset.id;
            modal.style.display = "none"
            modalOverlay.style.display = "none"
            let productUpdate = {
                title: form.elements.title.value,
                price: form.elements.price.value,
                description: form.elements.description.value,
                category: form.elements.category.value,
                image: form.elements.image.value,
            }
            productHttpService.update(id, {...productUpdate}).then(response => response.json())
            .then((data) => createSelectedCard(data,cardsDescriptionContainer)).then(() => {
                productHttpService.getLimit(10).then(response => response.json())
                .then(data => createProductsCards(data, cardsContainer));
            });
        }

        let clickModalOverlay = event.target.closest('.modal__overlay');
        let clickFormBody = event.target.closest('#form');
        let btnCloseModal = event.target.closest('.close-modal')

        if(clickModalOverlay && !clickFormBody || btnCloseModal) {
            modal.style.display = "none"
            modalOverlay.style.display = "none"
        }
    })
}

function createProductsCards(data, container) {
    let cardInner = '';

    data.forEach(({id,title,image,price}) => {

        cardInner += `
            <div class="catalog__cards__item">
                <div class="card" data-id="${id}">
                <div class="card__title">
                    <span>${title}</span>
                </div>
                <div class="card__visual">
                    <img src="${image}">
                </div>
                <div class="card__price">
                    <span>${price} $</span>
                </div>
                <button class="card__basket">
                    <span>add to basket</span>
                </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = cardInner;
}

function createSelectedCard(data, container) {

    let { id, title, price, description, category, image } = data;

    let cardInner = `
        <div class="selected-card" data-id="${id}">
            <div class="selected-card__visual">
            </div>
            <div class="description-card">
                <div class="description-card__title">
                    <span>${title}</span>
                </div>
                <div class="description-card__category">
                    <span>Category - ${category}</span>
                </div>
                <div class="description-card__text">
                    <p>${description}</p>
                </div>
                <div class="description-card__price">
                    <span>${price} $</span>
                </div>
                <div class="description-card__control">
                    <button class="description-card__basket"><span>add to basket</span></button>
                    <button class="description-card__show-category" data-category="${category}">
                        <span>Show products ${category}</span>
                    </button>
                    <button class="description-card__delete">
                        <span>Delete</span>
                    </button>
                    <button class="description-card__edit">
                        <span>Edit</span>
                    </button>
                </div>
            </div>
            <div class="modal">
                <div class="modal__overlay"></div>
                <div class="modal__body">
                    <form id='form'>
                        <div class="close-modal">&#10006</div>
                        <label>
                        <p>Title</p>
                        <input name="title" type="text" value="${title}">
                        </label>
                        <label>
                        <p>Price</p>
                        <input name="price" type="text" value="${price}">
                        </label>
                        <label>
                        <p>Description</p>
                        <textarea name="description">${description}</textarea>
                        </label>
                        <label>
                        <p>Category</p>
                        <input name="category" type="text" value="${category}">
                        </label>
                        <label>
                        <p>Image</p>
                        <input name="image" type="text" value="${image}">
                        </label>
                        <button class="_form-submit"><span>Submit</span></button>
                    </form>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = cardInner;
    let visualDescriptionCard = document.querySelector(`.selected-card__visual`);
    let visualCard = document.querySelector(`[data-id="${id}"] .card__visual`);
    visualDescriptionCard.innerHTML = visualCard.innerHTML;
}