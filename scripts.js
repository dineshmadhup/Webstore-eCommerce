// this file contains scripts for client

// =========== prices =================

var cheese_cost = 2.0;

var pizzas = {
    'Small': {
        'Pepperoni': 8.99,
        'Vegetarian': 9.99,
        'Combo': 10.99
    },
    'Medium': {
        'Pepperoni': 9.99,
        'Vegetarian': 10.99,
        'Combo': 11.99
    },
    'Large': {
        'Pepperoni': 10.99,
        'Vegetarian': 11.99,
        'Combo': 12.99
    }
};

// =========== prices end =============

// this function validates a pizza order form

function btnAddToCartHandler() {
    var size = document.getElementById('size');
    var errors = false;
    document.getElementById('size_error').innerHTML = '';
    if (!size.value) {
        document.getElementById('size_error').innerHTML = 'Please, select pizza size!';
        errors = true;
    }
    document.getElementById('kind_error').innerHTML = '';
    var kind = document.getElementById('kind');
    if (!kind.value) {
        document.getElementById('kind_error').innerHTML = 'Please, select pizza kind!';
        errors = true;
    }
    var quantity = parseInt(document.getElementById('quantity').value);
    document.getElementById('error_quantity').innerHTML = '';

    if (!quantity) {
        document.getElementById('error_quantity').innerHTML = 'Please, enter a valid quantity!';
        errors = true;
    }
    return !errors;
}

// this function calculates the price of the pizza
function btnCalculateHandler() {

    var size = document.getElementById('size');

    document.getElementById('size_error').innerHTML = '';
    if (!size.value) {
        document.getElementById('size_error').innerHTML = 'Please, select pizza size!';
    }

    document.getElementById('kind_error').innerHTML = '';
    var kind = document.getElementById('kind');
    if (!kind.value) {
        document.getElementById('kind_error').innerHTML = 'Please, select pizza kind!';
    }

    var quantity = parseInt(document.getElementById('quantity').value);
    document.getElementById('error_quantity').innerHTML = '';
    if (!quantity) {
        document.getElementById('error_quantity').innerHTML = 'Please, enter a valid quantity!';
    }

    // get cost of selected pizza
    var cost = pizzas[size.value][kind.value];

    if (!cost)
        return false;

    // get extra cheese flag
    var extra_cheese = document.getElementById('extra_cheese').checked;

    // add extra cheese cost if needed
    if (extra_cheese) {
        cost += cheese_cost;
    }
    document.getElementById('price').innerHTML = cost * quantity;
    return false;
}

// this function invokes when user clicks on the 'Go to cart' button

function btnGoToCart() {
    // change the location
    window.location.href = '/checkout';
    return false;
}

// this function invokes when main page loaded
function indexReady() {
    document.getElementById('btn_add_to_cart').onclick = btnAddToCartHandler;
    document.getElementById('calculate').onclick = btnCalculateHandler;
    document.getElementById('btn_go_to_cart').onclick = btnGoToCart;

    if (window.location.href.indexOf("added") != -1) {
        document.getElementById('success').innerHTML = 'Pizza successfully added to cart!'
    }

}

// this function validates checkout form
function btnCheckoutHandler() {
    var errors = false;
    var first_name = document.getElementById('first_name').value;
    document.getElementById('error_first_name').innerHTML = '';

    if (first_name.length < 1 || first_name.length > 20) {
        document.getElementById('error_first_name').innerHTML = 'First name must be between 1 and 20 characters';

        errors = true;
    }


    var last_name = document.getElementById('last_name').value;
    document.getElementById('error_last_name').innerHTML = '';
    if (last_name.length < 1 || last_name.length > 25) {
        document.getElementById('error_last_name').innerHTML = 'Last name must be between 1 and 25 characters';
        errors = true;
    }

    var address = document.getElementById('address').value;

    document.getElementById('error_address').innerHTML = '';

    if (address.length == 0) {

        document.getElementById('error_address').innerHTML = 'Address field should be filled';
        errors = true;
    }

    // get phone number
    var phone = document.getElementById('phone').value;

    document.getElementById('error_phone').innerHTML = '';

    if (phone.length == 0) {

        document.getElementById('error_phone').innerHTML = 'Phone field should be filled';
        errors = true;
    } else {
        // in other case create regular expr. to check the format (123-123-1233 for example)
        var phoneValid = /(\d){3}-(\d){3}-(\d){4}/;

        if (!phoneValid.test(phone)) {

            document.getElementById('error_phone').innerHTML = 'Invalid phone format';
            errors = true;
        }
    }
    var stype = document.forms[0].stype.value;
    document.getElementById('error_sales_type').innerHTML = '';

    if (!stype) {

        document.getElementById('error_sales_type').innerHTML = 'Please, select payment type';
        errors = true;
    }

    if (stype == 'credit') {

        var type = document.forms[0].crtype.value;
        var regex = '';


        document.getElementById('error_cr_type').innerHTML = '';

        if (!type) {

            document.getElementById('error_cr_type').innerHTML = 'Please, select credit card type';
            errors = true;
        } else {

            if (type == 'ax') {
                regex = /(\d){4}-(\d){6}-(\d){5}/;
            } else if (type == 'v') {
                regex = /(\d){4}-(\d){4}-(\d){4}-(\d){4}/;
            }

           var cardNumber = document.getElementById('txt_cr_number').value;

            document.getElementById('error_cr_number').innerHTML = '';

            if (!cardNumber) {

                document.getElementById('error_cr_number').innerHTML = 'Credit Card number is Required';
                errors = true;
            } else {

                if (!regex.test(cardNumber)) {

                    document.getElementById('error_cr_number').innerHTML = 'Invalid Credit Card Number Format';
                    errors = true;
                }
            }
            var crCardExpDate = document.getElementById('datepicker').value;

            document.getElementById('error_cr_ex_date').innerHTML = '';

            if (!crCardExpDate) {

                document.getElementById('error_cr_ex_date').innerHTML = 'Please, enter Credit Card expiration Date';
                errors = true;
            }

        }
    }

    return !errors;
}


function crCardTypeClick(element) {
    if (element.value == 'ax') {
        document.getElementById('txt_cr_number').setAttribute('placeholder', 'XXXX-XXXXXX-XXXXX');
    } else {
        document.getElementById('txt_cr_number').setAttribute('placeholder', 'XXXX-XXXX-XXXX-XXXX');
    }
}


function saleTypeClick(element) {
    if (element.value == 'cash') {
        document.getElementById('cr_t').style.display = 'none';
        document.getElementById('cr_number').style.display = 'none';
        document.getElementById('cr_ex_date').style.display = 'none';
    } else {

        document.getElementById('cr_t').style.display = 'table-row';
        document.getElementById('cr_number').style.display = 'table-row';
        document.getElementById('cr_ex_date').style.display = 'table-row';
    }
}

// this function invokes when checkout page loaded
function checkoutReady() {
    var min = 1000, max = 10000;
    var totalCost = 0;
    var div = document.getElementById('full_order');
    var id = Math.floor(Math.random() * (max - min + 1)) + min;
    div.innerHTML += '<p>Order #' + id + '</p>';

    if (myCart.length) {

        myCart.forEach(function (element) {

            var cost = pizzas[element.size][element.kind];

            if (element.extra_cheese) {
                cost += cheese_cost;
            }

            var str = '<p>' + element.size + ' ' + element.kind;

            if (element.extra_cheese) {
                str += ' with extra cheese';
            }

            cost *= element.quantity;
            str += ' x' + element.quantity + ' ($' + cost + ')';

            var pizza_id = element.size + '_' + element.kind;
            if (element.extra_cheese) {
                pizza_id += '_extra_cheese'
            }
            div.innerHTML += str + '<a href="./remove?pizza=' + pizza_id + '" style="display: block; float: right">Remove</a>';

            totalCost += cost;
        });

        div.innerHTML += '<hr/>' + '<p>Total: $' + totalCost + '</p>';
        document.getElementById('total_amount').innerHTML = '$' + totalCost;
    } else {
        div.innerHTML = '<p>You have no pizza in your cart</p>';
        document.getElementById('btn_checkout').disabled = true;
    }

    document.getElementById('btn_checkout').onclick = btnCheckoutHandler;

}