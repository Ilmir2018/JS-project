"use strict";
class Good {
    constructor(selector) {
        this.id = '';
        this.price = '';
        this.img = '';
        //Селектор кнопки для добавления товара в корзину.
        this.selectorAdd = '.push';
        // Вешаем обработчик событий на кнопки добавления товара.
        $('body').on('click', this.selectorAdd, event => this.addProd(event));
    }

    render($jqueryElement) {
        //Создаём общий контейнер в котором будет храниться товар.
        let $prodContainer = $('<div/>', {
            class: 'cart-model',
            'data-id': this.id,
            'data-price': this.price,
            width: 200,
        });
        //Создаём изображение товара
        let elemImage = new Image();
        $(elemImage).addClass('sliderItem_img').attr({
            src: this.img,
            width: 80,
            height: 80
        });
        //Делаем контейнер для информации под товар.
        let $informCont = $('<div/>', {
            class: 'cart_goods',
        });
        //Добавляем ссылку на товар
        let $elemInform = $('<a/>', {
            class: 'text_goods',
            text: 'MANGO  PEOPLE  T-SHIRT',
        });

        // Создаем элемент с рейтингом.
        let $elemRating = $('<div class="rating">' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="fas fa-star"></i>' +
            '<i class="far fa-star"></i>' +
            '</div>');
        //Создаём элемент с ценой
        let $price = $('<span/>', {
            class: 'price_good',
            text: '$' + this.price,
        });
        //Создаём контейнер для удаления товара.
        let $elemClose = $('<div/>', {
            class: 'cart-del',
        });
        //Делаем кнопку удаления товара.
        let $a_elemClose = $('<a/>', {
            class: 'a_cart-del',
            href: '#',
        });
        //Для кнопки удаления товара делаем значёк.
        let $i_a_elemClose = $('<i/>', {
            class: 'far fa-times-circle sliderItem__close',
        });
        //Добавляем элементы в блок
        $prodContainer.append($(elemImage));
        $prodContainer.append($informCont);
        $prodContainer.append($elemClose);
        $elemClose.append($a_elemClose);
        $a_elemClose.append($i_a_elemClose);
        $informCont.append($elemInform);
        $informCont.append($elemRating);
        $informCont.append($price);
        $jqueryElement.append($prodContainer);
    }

    /** Метод добавляет товар в корзину и изменяет цену и кол-во. */
    addProd(event) {
        //Отменяем действие браузера по умолчанию.
        event.preventDefault();
        //Получаем параметры по дата атрибутам и заносим их создаваемые элементы
        this.price = parseInt($(event.target).parents('.product').attr('data-price'));
        this.id = parseInt($(event.target).parents('.product').attr('data-id'));
        this.img = $(event.target).parents('.product').attr('data-img');
        // Получаем общую сумму и общее количество товаров в корзине.
        let commonPrice = parseInt($('#price').text()) + this.price;
        let commonAmount = parseInt($('#cart-products-span').text()) + 1;
        // Переписывает общую сумму и общее количество товаров в корзине.
        $('#cart-products-span').text(commonAmount);
        $('#price').text(commonPrice);
        this.render($('.cart-products-add'));
    }
}