// this function decides what handler should be invoked

function route(handle, pathname, response, request, postData) {
   
    if (typeof handle[pathname] === 'function') {
       
        handle[pathname](response, request, postData);
        
    } else if (pathname.indexOf('.') == -1) {
        // send 404 error
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not Found");
        response.end();
    }
}

// export route to global scope

exports.route = route;