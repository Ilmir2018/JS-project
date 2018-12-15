"use strict";

/**
 * Создаём класс который работает с корзиной
 */

class Basket {
    constructor(selector){
        //Получаем элемент контейнера для списка продуктов
      this.elemContainer = $(selector);
      //Инициализируем массив для товаров
      this.arrItems = [];
        //Получаем данные о товарах и выводим товары на страницу.
        this.ajaxProduct();
        // Вешаем обработчик событий на кнопку удалить товар.
        this.elemContainer.on('click', '.a_cart-del', event => this.removeProd(event));
    }

    /**
     * Метод получает данные и вызыввает функцию, которая выводит товары на страницу
      */
    ajaxProduct() {
        //Делаем ajax запрос, чтобы получить список товаров из json файла.
        $.ajax({
            type: 'GET',
            url: 'json/basket.json',
            dataType: 'json',
            context: this,
            //В случае успеха вызываем функцию добавляющую товары на страницу.
            success: data => this.render(data),
            //В случае ошибки выводим в консоль сообщение.
            error: function (error) {
                console.log('Ошибка при получении списка товаров', error);
            }
        });
    }
    //Метод отрисовывает слайдер на странице.
    render(data){
        $('#price').text(data['price']);
        $('#cart-products-span').text(data['products'].length);

        //Перебираем в цикле данные о товаре полученные из json файла,
        //и добавляем их в массив.
        for (let i = 0; i < data['products'].length; i++){
            this.arrItems.push(data['products'][i]);
        }
        //Обходим в цикле все товары и добавляем их на страницу.
        for (let i = 0; i < this.arrItems.length; i++){
            //Созлаём контейнер для товара.
            let $prodContainer = $('<div/>', {
                class: 'cart-model',
                'data-id': this.arrItems[i].id,
                'data-price': this.arrItems[i].price,
                width: 200,
            });
            //Создаём изображение товара
            let elemImage = new Image();
            $(elemImage).addClass('sliderItem_img').attr({
                src: `img/${this.arrItems[i]['img']}`,
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
                text: this.arrItems[i].name
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
                text: '$' + this.arrItems[i].price
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
            this.elemContainer.append($prodContainer);
        }
    }
    /** Метод удаляет товар из списка товаров в корзине и изменяет цену и кол-во. */
    removeProd(event) {
        // Получаем елемент товара который удаляем.
        let $elemRemove = $(event.target).parents('.cart-model');
        let price = parseInt($(event.target).parents('.cart-model').attr('data-price'));
        // Получаем общую сумму и общее количество товаров в корзине.
        let commonPrice =  parseInt($('#price').text()) - price;
        let commonAmount = parseInt($('#cart-products-span').text()) - 1;
        // Переписывает общую сумму и общее количество товаров в корзине.
        $('#cart-products-span').text(commonAmount);
        $('#price').text(commonPrice);
        // Удаляем сам элемент из корзины.
        $elemRemove.remove();
    }
}