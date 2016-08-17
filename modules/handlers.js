// include modules
var fs = require('fs');
var url = require('url');
var utils = require(__dirname + "/utils");

// this function handles requests to main page
function index(response, request) {
    fs.readFile(
            __dirname + '/../view/index.html',
            function (error, htmlData) {
                if (error)
                    throw error;
                // read file with shopping cart
                fs.readFile('cart.txt', function (error, data) {
                    if (error)
                        throw error;
                    var cookies = utils.parseCookies(request);
                    var sid = cookies['sessionid'];
                    var str = data.toString();
                    if (!str) {

                        str = '{}';
                    }
                    // convert cart data from string to JSON
                    var cartData = JSON.parse(str);
                    // get cart of the current user
                    var cart = cartData[sid];
                    var len = '(0)';
                    // if cart contains any data
                    if (cart) {
                        len = 0;
                        cart.forEach(function (element) {
                            len += element.quantity;
                        });

                        len = '(' + len + ')';
                    }

                    var html = htmlData.toString().replace('{{ count }}', len);
                    // send html to user
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(html);
                    response.end();
                });
            }
    );
}

// this function handles requests to checkout page
function checkout(response, request) {
    fs.readFile(
            __dirname + '/../view/checkout.html',
            function (error, htmlData) {
                if (error)
                    throw error;
                fs.readFile('cart.txt', function (error, data) {
                    if (error)
                        throw error;
                    var cookies = utils.parseCookies(request);
                    var sid = cookies['sessionid'];
                    var str = data.toString();
                    if (!str) {

                        str = '{}';
                    }
                    var cartData = JSON.parse(str);
                    var cart = cartData[sid];
                    var len = '(0)';
                    if (cart.length) {

                        len = 0;
                        cart.forEach(function (element) {
                            len += element.quantity;
                        });
                        len = '(' + len + ')';
                    }
                    var html = htmlData.toString().replace('{{ cart }}', JSON.stringify(cart));
                    html = html.replace('{{ count }}', len);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(html);
                    response.end();
                });
            }
    );
}

// this function handles POST request (adds pizzas to cart)
function addToCart(response, request, postData) {
    fs.readFile('cart.txt', function (error, data) {
        if (!error) {
            var cartData = JSON.parse(data.toString() || '{}');
            var sid = postData['sid'];
            var cart = cartData[sid];
            // create new cart entry from user's data
            var cartEntry = {
                'size': postData['size'],
                'kind': postData['kind'],
                'quantity': parseInt(postData['quantity']),
                'extra_cheese': postData['extra_cheese']
            };
            // if cart is empty
            if (!cart) {
                cart = [];
                cart.push(cartEntry);
            } else {

                var found = false;

                // for every entry in the cart
                cart.forEach(function (element) {

                    if (element['size'] == cartEntry['size']) {
                        if (element['kind'] == cartEntry['kind']) {
                            if (element['extra_cheese'] == cartEntry['extra_cheese']) {
                                element['quantity'] += cartEntry['quantity'];
                                found = true;
                            }
                        }
                    }
                });
                if (!found) {

                    cart.push(cartEntry);
                }
            }

            // save cart of the current user
            cartData[sid] = cart;

            // write all cart information to file cart.txt
            fs.writeFile(
                    'cart.txt',
                    JSON.stringify(cartData),
                    function (error) {
                        if (error)
                            throw error;
                    }
            );
        }
    });
   
    response.writeHead(301, {'Location': '/order?added=true'});
    response.end();
}

// this function handles requests to confirmation page

function confirmation(response, request) {
    fs.readFile(
            __dirname + '/../view/confirmation.html',
            function (error, htmlData) {
                if (error)
                    throw error;
                fs.readFile('cart.txt', function (error, data) {
                    if (error)
                        throw error;
                    var cartData = JSON.parse(data.toString() || '{}');
                    var cookies = utils.parseCookies(request);
                    var sid = cookies['sessionid'];
                    delete cartData[sid];
                    // write all cart information to file cart.txt
                    fs.writeFile(
                            'cart.txt',
                            JSON.stringify(cartData),
                            function (error) {
                                if (error)
                                    throw error;
                            }
                    );
                });
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(htmlData);
                response.end();
            }
    );
}

function order(response, request) {
    fs.readFile(
            __dirname + '/../view/order.html',
            function (error, htmlData) {
                if (error)
                    throw error;
                // read file with shopping cart
                fs.readFile('cart.txt', function (error, data) {
                    if (error)
                        throw error; 
                    var cookies = utils.parseCookies(request);
                    var sid = cookies['sessionid'];
                    var str = data.toString();
                    if (!str) {
                        // create empty JSON object
                        str = '{}';
                    }
                    // convert cart data from string to JSON
                    var cartData = JSON.parse(str);
                    var cart = cartData[sid];
                    var len = '(0)';

                    // if cart contains any data
                    if (cart) {
                        len = 0;
                        cart.forEach(function (element) {
                            len += element.quantity;
                        });
                        len = '(' + len + ')';
                    }
                    var html = htmlData.toString().replace('{{ count }}', len);
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(html);
                    response.end();
                });
            }
    );
}

function about(response, request) {
   
    fs.readFile(
            __dirname + '/../view/about.html',
            function (error, htmlData) {            
                if (error)
                    throw error; 
                fs.readFile('cart.txt', function (error, data) {
                    if (error)
                        throw error;
                    var cookies = utils.parseCookies(request);
                    var sid = cookies['sessionid'];
                    var str = data.toString();
                    if (!str) {
                        // create empty JSON object
                        str = '{}';
                    }
                    // convert cart data from string to JSON
                    var cartData = JSON.parse(str);

                    var cart = cartData[sid];
                    var len = '(0)';                   
                    if (cart) {
                        len = 0;
                        cart.forEach(function (element) {
                            len += element.quantity;
                        });                       
                        len = '(' + len + ')';
                    }                    
                    var html = htmlData.toString().replace('{{ count }}', len);
                   
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.write(html);
                    response.end();
                });
            }
    );
}
function remove(response, request, data) {
    fs.readFile('cart.txt', function (error, data) {        
        if (error)
            throw error; 
        var cookies = utils.parseCookies(request);
        var sid = cookies['sessionid'];
        var str = data.toString();

        // convert cart data from string to JSON
        var cartData = JSON.parse(str);
        var cart = cartData[sid];
        var url_parts = url.parse(request.url, true);
        var query = url_parts.query;
        var extra_cheese = undefined;
        var parts = query.pizza.split('_');

        if (parts.length > 2) {
            extra_cheese = 'yes'
        }

        var cartEntry = {
            'size': parts[0],
            'kind': parts[1],
            'extra_cheese': extra_cheese
        };
        cart.forEach(function (element, index, array) {
            if (element.size == cartEntry.size) {
                if (element.kind == cartEntry.kind) {
                    if (cartEntry.extra_cheese) {
                        if (element.extra_cheese) {
                            element.quantity--;
                        }
                    } else {
                        if (!element.extra_cheese) {
                            element.quantity--;
                        }
                    }
                    if (element.quantity == 0) {
                        array.splice(index, 1);
                    }
                }
            }
        });

        cartData[sid] = cart;

        // write all cart information to file cart.txt
        fs.writeFile(
                'cart.txt',
                JSON.stringify(cartData),
                function (error) {
                    if (error)
                        throw error;
                }
        );

        response.writeHead(301, {'Location': '/checkout'});
        response.end();

    });

}

// export all functions
exports.remove = remove;
exports.index = index;
exports.order = order;
exports.about = about;
exports.checkout = checkout;
exports.addToCart = addToCart;
exports.confirmation = confirmation;