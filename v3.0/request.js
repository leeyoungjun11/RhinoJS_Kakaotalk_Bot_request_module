importClass(org.jsoup.Jsoup);
importClass(org.jsoup.Connection);

function request(opt, callback) {
    let err, res, body;
    if((typeof opt) == 'string') {
        try {
            res = Jsoup.connect(opt)
                .method(Connection.Method.GET)
                .ignoreContentType(true)
                .timeout(10000)
                .userAgent('Samsung A737: SAMSUNG-SGH-A737/UCGI3 SHP/VPP/R5 NetFront/3.4 SMM-MMS/1.2.0 profile/MIDP-2.0 configuration/CLDC-1.1 UP.Link/6.3.1.17.0')
                .execute();
            body = res.parse();
        } catch(e) {
            err = e;
        } finally {
            callback(err, res, body);
        }
    } else if((typeof opt) == 'object') {
        // Method
        let method = {
            GET: Connection.Method.GET,
            POST: Connection.Method.POST,
            DELETE: Connection.Method.DELETE,
            HEAD: Connection.Method.HEAD,
            OPTIONS: Connection.Method.OPTIONS,
            PATCH: Connection.Method.PATCH,
            PUT: Connection.Method.PUT,
            TRACE: Connection.Method.TRACE
        };

        let url, methodName, userAgent, timeout;

        // set url
        if(opt.uri != undefined || opt.url != undefined) {
            if(opt.uri != undefined) {
                url = opt.uri;
            }
            if(opt.url != undefined) {
                url = opt.url;
            }
        } else {
            let error = new ReferenceError('"url" is not defined.');
            error.lineNumber = 44;
            throw error;
        }

        // set method
        if(opt.method != undefined) { 
            if(method[opt.method.toUpperCase()] != undefined) {
                methodName = method[opt.method.toUpperCase()];
            } else {
                let error = new RuntimeError('Invaild method.');
                error.lineNumber = 54;
                throw error;
            }
        } else {
            methodName = method.GET;
        }

        // set query string for GET method
        if(methodName == Connection.Method.GET && opt.qs != undefined) {
            if(Object.keys(opt.qs).length != 0) {
                url = url + '?';
                let qs = [];
                for(let n = 0; n < Object.keys(opt.qs); n ++) {
                    qs[n] = Object.keys(opt.qs)[n] + '=' + opt.qs[Object.keys(opt.qs)[n]];
                }
                qs = qs.join('&');
                url = url + qs;
            }
        }

        // set user-agent
        if(opt.userAgent == undefined) {
            userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36";
        } else {
            userAgent = opt.userAgent;
        }

        // set default timeout
        if(opt.timeout == undefined) {
            timeout = 10000;
        } else {
            timeout = Number(opt.timeout);
            if(isNaN(timeout)) {
                let error = new TypeError('timeout cannot be NaN.');
                error.lineNumber = 88;
                throw error;
            }
        }

        try {
            res = Jsoup.connect(url).method(methodName);

            // set header
            if(opt.headers != undefined){
                let headers = Object.keys(opt.headers);
                for(n = 0; n < headers.length; n++) {
                    res = res.header(headers[n], opt.headers[headers[n]]);
                }
            }

            // set requset body
            if(opt.body != undefined) {
                res = res.requestBody(JSON.stringify(opt.body));
            }

            // execute
            res = res.ignoreContentType(true)
                .timeout(timeout)
                .userAgent(userAgent)
                .execute();
            body = res.parse();

            // if opt.json is true, it return by json.
            if(opt.json) {
                body = JSON.parse(body.text());
            }
        } catch(e) {
            err = e;
        } finally {
            callback(err, res, body);
        }

    }
}

exports.request = request;


/**
 * This version of 3.0 has improved performance.
 * QueryString option was be able
 * json option was be able
 * 
 * require example
 * var request = require('request').request;
 * 
 * Parameters
 * request(String URL | Object request option, callbackFunc)
 * 
 * Copyright 2020. All rights reserved by PinMilk.
 */
