"use strict";

$(document).ready(function () {
    //Создаём объект корзины.
    new Basket('.cart-products-add');
    //Создаём объект добавляемых товаров.
    new Good('.cart-products-add');
});