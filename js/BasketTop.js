/**
 *Класс описываюий корзину с товарами в шапке сайта.
 */

class BasketTop {
    /**
     * Конструктор инициализирует свойства класса, методы и обработчики событий.
     */
    constructor() {
        //Элемент контейнера для товаров в корзине.
        this.goods = $('.cart-products-add');
        //Селектор кнопки удалить товар из корзины.
        this.selectorRemove = '.fa-times-circle';
        //Селектор кнопки добавить товар в коризну.
        this.selectorAdd = $('.push');
        //Элемент контейнера на пиктограмме для отображения количества товаров.
        this.elemGoods = $('#cart-products');
        // Элемент контейнера в корзине для отображения общей суммы товаров.
        this.elemAmount = $('#price');
        //Ключ к объекту корзины в локальном хранилище Storage.
        this.keyBasket = 'basket';
        // Путь к файлу json с данными о товарах в корзине.
        this.pathJsonBasket = 'json/basket.json';
        // Общее количество товаров.
        this.totalPrice = 0;
        // Общая стоимость товаров.
        this.totalAmount = 0;
        // Массив для хранения товаров.
        this.basketItems = [];

        //Получаем данные о товарах в корзине и добавляем их на страницу.
        this.getDataAndRenderBasket();
        /*        //Инициализируем обработчик событий по кнопке удалить товар.
                this.goods.on('click', this.selectorRemove, event => this.removeGood(event));
                //Инициализируем обработчик событий по кнопке добавить товар.
                $('body').on('click', this.selectorAdd, event => this.addGood(event));*/
    }

    /**
     * Метод получает данные о  товарах в корзине и отрисовывает их на странице.
     */
    getDataAndRenderBasket() {
        if (sessionStorage.getItem(this.keyBasket)) {
            //Если локальное хранилище существует, то получаем из нео данные.
            let jsonBasket = sessionStorage.getItem(this.keyBasket);
            let objBasket = JSON.parse(jsonBasket);

            //Изменяем общую сумму и общее количество товаров в корзине.
            this.totalAmount = objBasket['amount'];
            this.totalPrice = objBasket['price'];

            //Перебираем в цикле данные о товаре полученные из json файла,
            //и добавляем их в массив.
            for (let i = 0; i < objBasket['products'].length; i++) {
                this.basketItems.push(objBasket['products'][i]);
            }
            //Отрисовываем товар в корзине.
            this.render();
        } else {
            //Если локальное хранилище не существует, то вызываем метод,
            //который получит данные и поместит их в локальное хранилище.
            this.getAjaxProduct();
        }
    }

    /**
     * Метод получает данные из json файла и вызывает метод,
     * обрабатывающий их
     */
    getAjaxProduct() {
        //Делаем ajax запрос, чтобы получить список товаров из json файла.
        $.ajax({
            type: 'GET',
            url: this.pathJsonBasket,
            dataType: 'json',
            context: this,
            //В случае успеха вызываем метод, который обрабатывает полученные данные.
            success: data => this.setDataFromJson(data),
            //В случае ошибки выводим в консольсообщение.
            error: function (error) {
                console.error('Ошибка при получении списка товаров', error);
            }
        });
    }

    /**
     * Метод изменяет значения переменных totalAmount, totalPrice, basketItems
     * на данные полученные из json файла. И вызывает метод отрисовывающий товары в корзине.
     * @param {Object} data - Полученные файлы из json файла.
     */
    setDataFromJson(data) {
        //Изменяем общую сумму и общее количество товаров в корзине.
        this.totalAmount = data['amount'];
        this.totalPrice = data['price'];

        //Перебераем в цикле данные о товаре полученные из json файла
        //и добавляем их в массив.
        for (let i = 0; i < data['products'].length; i++) {
            this.basketItems.push(data['products'][i]);
        }

        //Перезаписываем данные в локальном хранилище sessionStorage.
        this.setSessionStorage();

        //Отрисовываем товар в корзине.
        this.render();
    }

    /** Метод перезаписываем данные в локальном хранилище sessionStorage. */
    setSessionStorage() {
        // Создаем объект с данными о товаре в корзине.
        let myJson = {
            "products": this.basketItems,
            "amount": this.totalAmount,
            "price": this.totalPrice
        };
        // Преобразуйте объект в JSON перед сохранением.
        myJson = JSON.stringify(myJson);
        // И сохраняем их в session storage.
        sessionStorage.setItem('basket', myJson);
    }

    /**
     * Метод отрисовывает товары в корзине.
     */
    render() {
        //Изменяем общее количество товаров на иконке корзины.
        this.elemGoods.text(this.totalAmount);
        //Изменяем общую сумму товаров в корзине.
        this.elemAmount.text(`$${this.totalPrice}`);
        //Очищаем контейнер корзины.
        this.goods.html('');
        //Получаем количество элементов в массиве.
        let lenghtBasketItem = this.basketItems.length;
        //Если в корзине отсутствуют товары то выводим сообщение.
        if (lenghtBasketItem === 0) {
            //Создаём контейнер с сообщением, что товаров в корзине нет.
            let elemBasketEmpty = $('<div/>', {
                class: 'hr-cart-item',
                text: 'Ваша корзина пуста.'
            });
            //Добавляем элемент в контейнер корзины на странице.
            this.goods.append(elemBasketEmpty);
        } else {
            //Обходим в цикле все товары и добавляем их на страницу.
            for (let i = 0; i < lenghtBasketItem; i++) {
                //Создаём общий контейнер в котором будет храниться товар.
                let $prodContainer = $('<div/>', {
                    class: 'cart-model',
                    'data-id': this.basketItems[i]['id'],
                    width: 200,
                });
                //Создаём изображение товара
                let elemImage = new Image();
                $(elemImage).addClass('sliderItem_img').attr({
                    src: `img/${this.basketItems[i]['img']}`,
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
                    text: '$' + this.basketItems[i]['price']
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
               this.goods.append($prodContainer);
            }
        }
    }
}