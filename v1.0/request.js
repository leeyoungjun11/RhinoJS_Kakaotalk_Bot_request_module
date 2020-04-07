importPackage(org.jsoup);
const methodObject = {
    "GET": Connection.Method.GET,
    "POST": Connection.Method.POST,
    "DELETE": Connection.Method.DELETE,
    "HEAD": Connection.Method.HEAD,
    "OPTIONS": Connection.Method.OPTIONS,
    "PATCH": Connection.Method.PATCH,
    "PUT": Connection.Method.PUT,
    "TRACE": Connection.Method.TRACE
};

function request(requestJSON, func) {
    let error, res, doc;
    if(Object.keys(methodObject).indexOf(requestJSON['method']) != -1) {
        var methodName = methodObject[requestJSON['method']];
    } else {
        var methodName = Connection.Method.GET;
    }

    if(requestJSON['userAgent'] == undefined) {
        var userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36";
    } else {
        var userAgent = requestJSON['userAgent'];
    }

    if(requestJSON['timeout'] == undefined) {
        var timeout = 5000;
    } else {
        var timeout = requestJSON['timeout'];
    }

    var url = requestJSON['url'];

    try {
        res = Jsoup.connect(url).method(methodName);
        if(requestJSON["headers"] != undefined){
            var headers = Object.keys(requestJSON["headers"]);
            for(n = 0; n < headers.length; n++) {
                res = res.header(headers[n], requestJSON['headers'][headers[n]]);
            }
        }
        if(requestJSON['body'] != undefined) {
            res = res.data(requestJSON['body']);
        }
        res = res.ignoreContentType(true)
            .timeout(timeout)
            .userAgent(userAgent)
            .execute();
        doc = res.parse();
    } catch(e) {
        error = e.javaException;
    } finally {
        func(error, res, doc);
    }

}

exports.request = request;

/**
 * 이번 1.0은 첫번째 파라미터를 무조건 객체 형식으로 전달해야 합니다.
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
