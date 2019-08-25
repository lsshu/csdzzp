//{ 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' }
var httpPath = 'https://www.csdzzp.com/applet/1';
var sendRequest = function (url, method, data = {}, header = {}) {
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: function (data) {
        data.data.timestamp = Date.now();
        resolve(data);
      },
      fail: function (data) {
        reject(data);
      }
    })
  })
  return promise
}

/**
 * Request
 */
var Request = function (url = "/", data = {}, method = "POST", header = {}) {
  header = Object.assign({ "content-type": "application/x-www-form-urlencoded" }, header);
  return sendRequest(url, method, data, header);
};
/**
 * POST
 */
var postRequest = function (url = "/", data = {}, method = "POST", header = {}) {
  header = Object.assign({ "content-type": "application/x-www-form-urlencoded" }, header);
  return sendRequest(httpPath + url, method, data, header);
};
/**
 * GET
 */
var getRequest = function (url = "/", method = "GET", header = {}) {
  header = Object.assign({ "content-type": "application/json" }, header);
  return sendRequest(httpPath + url, method, {}, header);
};

/**
 * URL
 */
var url = function (url = "/") {
  return httpPath + url;
}
module.exports = {
  post: postRequest,
  request: Request,
  get: getRequest,
  url: url
}