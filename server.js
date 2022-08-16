#!/usr/bin/env node
//const express = require("express");
import express from "express";
//const axios = require("axios");
import axios from "axios";
import fetch from "node-fetch";
//const path = require("path");
import path from "path";
const app = express();

//	const dotenv = require("dotenv");
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;

//const var_dump = require("var_dump");

//var sslRootCAs = require("ssl-root-cas");
import sslRootCAs from "ssl-root-cas";
sslRootCAs.inject();

var counter = {};

function getSlug(text) {
  //  var words = text.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/); // note ' and - are >
  // Tok out the tilde
  var words = text.split(/[ .:;?!,`"&|()<>{}\[\]\r\n/\\]+/); // note ' and - are >

  const slugText = words.join("-");
  return slugText;
}

function parseSlug(title, flag) {
  if (flag === false) {
    title = title.toLowerCase();
  }

  const arr = title.split("-");
  const tokens = arr.map((token) => {
    return token;
    //var trimmedToken = trimAlpha(token); // trimAlpha
    //  var strippedToken = stripText(trimmedToken); // stripText
    // return strippedToken;
  });

  return tokens;
}

function stripText(text) {
  var testFoundPostTitle = text.replace(/[^a-zA-Z0-9]+/g, "");
  return testFoundPostTitle;
}

function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      !(code > 47 && code < 58) && // numeric (0-9)
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)
    ) {
      // lower alpha (a-z)
      return false;
    }
  }
  return true;
}

function isMixed(token) {
  if (isAlphaNumeric(token) && !isAlpha(token) && !isNumeric(token)) {
    return true;
  }
  return false;
}

function isAlpha(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (
      !(code > 64 && code < 91) && // upper alpha (A-Z)
      !(code > 96 && code < 123)
    ) {
      // lower alpha (a-z)
      return false;
    }
  }
  return true;
}

function trimAlpha(text) {
  const letters = [];
  var new_text = "";
  var flag = false;
  for (var i = 0; i < text.length; i++) {
    //       foreach (range(0, mb_strlen($text)) as $i) {
    var letter = text.substr(i, 1);

    if (isAlphaNumeric(letter)) {
      flag = true;
    }

    if (!isAlphaNumeric(letter) && flag == false) {
      letter = "";
    }

    letters.push(letter);
  }

  var new_text = "";
  var flag = false;

  var reversedLetters = [...letters].reverse();
  var processedLetters = [];
  for (let letter of reversedLetters) {
    if (isAlphaNumeric(letter)) {
      flag = true;
    }

    if (!isAlphaNumeric(letter) && flag == false) {
      letter = "";
    }

    const n = letters.length - i - 1;

    processedLetters.push(letter);
  }
  var new_text = processedLetters.join("");

  var reversedNewText = [...new_text].reverse();
  var str = reversedNewText.join("");
  return str;
}

function isNumeric(token) {
  if (typeof token != "string") return false; // we only process strings!
  return (
    !isNaN(token) && !isNaN(parseFloat(token)) // use type coercion to parse the _entirety_ of the string>
  ); // ...and ensure strings of whitespace fail
}

function logAxios(data, message = null) {
  console.log("data", data);
}

function logRequest(request, message = null) {
  console.log("log request");
  console.log("----------------");
  console.log("request get X-Forwarded-For ", request.get("X-Forwarded-For"));
  console.log(
    "request headers x-forwarded-for ",
    request.headers["x-forwarded-for"]
  );
  console.log("request headers x-real-ip ", request.headers["x-real-ip"]);
  console.log("-----------------");

  console.log("url", request.originalUrl);
  console.log("host", request.get("host"));
  console.log("origin", request.get("origin"));
  console.log("remote address", request.socket.remoteAddress);
}

function validateIP(request) {
  // dev list of IPs

  console.log("request headers x-real-ip ", request.headers["x-real-ip"]);

  // Google. Stop Google queries.
  if (request.headers["x-real-ip"] === "66.249.66.6") {
    return false;
  }

  return true;
}

function stackFormat(text) {
  return text;
}

function errorAxios(error, message = null) {
  console.log("error axios");
  if (message !== null) {
    console.error("message", message);
  }

  var errorCount = counter.error;
  console.log("errorCount", errorCount);

  counter = { ...counter, error: (counter.error += 1) };
  console.log("counter error", counter.error);
  // message
  // stack
  // config.url
  if (error.response) {
    // Request made and server responded
    console.log("Request made and server responded.");
    console.log("error request method", error.request.method);
    console.log("error request path", error.request.path);
    console.log("error request message", error.request.message);

    var errorId = null;
    var message = null;
    var domain = null;
    var subdomain = null;
    if (error?.response?.data?.errorMessage !== undefined) {
      const errorId =
        error.response.data.errorMessage[0]["error"][0]["errorId"];
      const message =
        error.response.data.errorMessage[0]["error"][0]["message"];

      const domain = error.response.data.errorMessage[0]["error"][0]["domain"];
      const subdomain =
        error.response.data.errorMessage[0]["error"][0]["subdomain"];
    }
    console.log(
      "error id " + errorId + " message " + message + domain + ":" + subdomain
    );

    console.error("error ", error);
  } else if (error.request) {
    // The request was made but no response was received
    console.log("The request was made but no response was received");
    console.log(error.request);
  } else {
    console.log("Something else happened in setting up the request");
    // Something happened in setting up the request that triggered an Error
    console.log("Somethng else error", error);
    //const e = error.toJSON(); // Has more information...
    console.log("Something else. error ".error);
  }
  console.log("---");
}

app.use("/*", function (req, res) {
  const startTime = new Date();
  const queryParam = req.query;

  const site = queryParam.site;
  const keywords = queryParam.keywords;

  console.log("req.originalUrl", req.originalUrl);

  const text = queryParam.keywords;

  const requestUrl = host + req.originalUrl;

  console.log("requestUrl", requestUrl);
  //    method: "GET",
console.log("req.headers", req.headers);
  const options = {
    //    url: requestUrl,
    //    method: 'POST',
    method: req.method,
    //    responseType: "json",
    //    headers: {
    //      Accept: "application/json",
    //      "Content-Type": "application/json",
    //    },
    headers: req.headers,
//    proxy: {
//      host: host,
//      port: 443,
//    },
  };
//  console.log("options", options);
//  console.log("requestUrl", requestUrl);
  return (
    fetch(requestUrl, options)
      //  return axios(options)
      .then((response) => {
console.log("response",response);

const contentType = response.headers.get('content-type');

if (contentType === "application/json") {
return response.json().then((data)=>{
        return res.status(200).send(data);
});

}
//response.text().then((data)=>{
//        return res.status(200).send(data);
//});

return response.text().then((data)=>{
//        console.log("response", response);
        return res.status(200).send(data);

});


//        console.log("response", response);
        //      return res.status(200).send(response.data);


//        return res.status(response.status).send(response.text());
      })
      .catch((error) => {
        errorAxios(error, req.originalUrl);
        console.log(error);
        // console.log(error);
        if (error && error.response && error.response.status) {
          return res.status(error.response.status).send(error.response.data);
        }
        return res.status(500).send({ message: "Proxy error" });
      })
  );
});

// listen to the port.
app.listen(port, () =>
  console.log(`app listening at http://localhost:${port}`)
);
