// include required modules

var http = require("http");
var url = require("url");
var fs = require('fs');
var utils = require(__dirname + "/utils");
var querystring = require("querystring");


// this function start a new HTTP server
function start(route, handle) {
    // function onRequest will handle all the requests to server
    function onRequest(request, response) {
        var postData = "";

        if (request.url.indexOf('.css') != -1) {

            fs.readFile(
                    __dirname + '/../view/styles.css',
                    function (error, data) {
                        if (error)
                            throw error;
                        response.writeHead(200, {'Content-Type': 'text/css'});
                        response.write(data);
                        response.end();
                    }
            );
        }

        if (request.url.indexOf('.js') != -1) {
            fs.readFile(
                    __dirname + '/../view/scripts.js',
                    function (error, data) {
                        if (error)
                            throw error;
                        response.writeHead(200, {'Content-Type': 'text/javascript'});
                        response.write(data);
                        response.end();
                    }
            );
        }

        var pathname = url.parse(request.url).pathname;

        if (pathname.indexOf('.jpg') != -1 || pathname.indexOf('.png') != -1 || pathname.indexOf('.gif') != -1) {
            fs.readFile(
                    __dirname + '/../view' + pathname,
                    function (error, data) {
                        if (error)
                            throw error;
                        response.writeHead(200, {'Content-Type': 'text/image'});
                        response.write(data);
                        response.end();
                    }
            );
        }
        if (request.method == 'POST') {
            request.addListener("data", function (chunk) {
                postData += chunk;
            });

            request.addListener("end", function () {
                var data = querystring.parse(postData);
                var cookies = utils.parseCookies(request);
                data['sid'] = cookies['sessionid'];


                route(handle, pathname, response, request, data);
            });
        } else {

            route(handle, pathname, response, request, null);
        }
    }

    http.createServer(onRequest).listen(8888);
}

// export start function

exports.start = start;