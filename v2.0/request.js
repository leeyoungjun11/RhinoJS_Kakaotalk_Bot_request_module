importClass(org.jsoup.Jsoup);
importClass(org.jsoup.Connection);

function request(requestOption, func) {
    let err, res, doc;
    let method = {
        'GET': Connection.Method.GET,
        'POST': Connection.Method.POST,
        'DELETE': Connection.Method.DELETE,
        'HEAD': Connection.Method.HEAD,
        'OPTIONS': Connection.Method.OPTIONS,
        'PATCH': Connection.Method.PATCH,
        'PUT': Connection.Method.PUT,
        'TRACE': Connection.Method.TRACE
    };
    if((typeof requestOption) == 'object') {
        if(Object.keys(method).indexOf(requestOption['method']) != -1) {
            var methodName = method[requestOption['method']];
        } else {
            var methodName = Connection.Method.GET;
        }
    
        if(requestOption['userAgent'] == undefined) {
            var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36";
        } else {
            var userAgent = requestOption['userAgent'];
        }
    
        if(requestOption['timeout'] == undefined) {
            var timeout = 5000;
        } else {
            var timeout = requestOption['timeout'];
        }
    
        var url = requestOption['url'];
    
        try {
            res = Jsoup.connect(url).method(methodName);
            if(requestOption["headers"] != undefined){
                var headers = Object.keys(requestOption["headers"]);
                for(n = 0; n < headers.length; n++) {
                    res = res.header(headers[n], requestOption['headers'][headers[n]]);
                }
            }
            if(requestOption['body'] != undefined) {
                res = res.data(requestOption['body']);
            }
            res = res.ignoreContentType(true)
                .timeout(timeout)
                .userAgent(userAgent)
                .execute();
            doc = res.parse();
        } catch(e) {
            err = e.javaException;
        } finally {
            func(err, res, doc);
        }
    } else {
        try {
            res = Jsoup.connect(requestOption)
                .method(method['GET'])
                .ignoreContentType(true)
                .timeout(10000)
                .userAgent('Samsung A737: SAMSUNG-SGH-A737/UCGI3 SHP/VPP/R5 NetFront/3.4 SMM-MMS/1.2.0 profile/MIDP-2.0 configuration/CLDC-1.1 UP.Link/6.3.1.17.0')
                .execute();
            doc = res.parse();
        } catch(e) {
            err = e.javaException;
        } finally {
            func(err, res, doc);
        }
    }
}

exports.request = request;


/**
 * 저번 1.0은 첫번째 파라미터를 무조건 객체 형식으로 전달해야 했지만,
 * 이번 2.0은 요청을 보낼 url을 String 또는 객체 형식으로 전달할 수 있습니다.
 * 
 * 모듈 require 필수
 * eg)
 * var request = require('request').request;
 * 
 * 파라미터
 * request(String URL|Object request option, callBackFunc)
 * String URL에 요청을 보내거나 Object request option에 해당하는 요청을 보내고,
 * 파라미터로 전달된 callBackFunc를 실행합니다.
 * 
 * Copyright 2020. All rights reserved by PinMilk, 마른().
 */
