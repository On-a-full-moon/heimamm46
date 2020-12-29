// axios 配置项
// 引入消息提示
import { message } from "ant-design-vue";
// 引入axios库
import axios from "axios";
// 创建 axios 实例
const instance = axios.create({
  // 返回数据类型
  responseType: "json",
  // 超时时间
  timeout: 7000,
  // 最大发包长度
  maxContentLength: 2000,
  // 重试次数
  retry: 3,
  // 重试延时，3秒重试一次
  retryDelay: 3000,
  // 重试条件，默认只要是错误都需要重试
  shouldRetry: () => true,
  // 是否跨域
  withCredentials: true
});

// 3.声明请求拦截器()
// setRequestHeader("token","token之")
instance.interceptors.request.use(
  config => {
    // 在headers头上添加参数
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
    const token = window.sessionStorage.getItem("token");
    // console.log(config)` 1`
    // 判断是否有token令牌
    if (token) {
      config.headers["Token"] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 4.声明响应拦截器
instance.interceptors.response.use(
  response => {
    console.log(response);
    const { data } = response;
    // const { status } = response.status;
    // 这里可以对后端的一些状态码进行处理
    switch (data.code) {
      // 如果返回的状态码为200说明接口请求成功
      // 否则的话抛出错误
      case 200: // 返回正常内容
        return Promise.resolve(response);
      case 201: // 没有内容
        return Promise.resolve(response);
      case 202: // 用户名或密码错误
        return Promise.resolve(response);
      case 203: // 题库编号已存在
        return Promise.resolve(response);
      case 204: // 题库标签最多写三个
        return Promise.resolve(response);
      case 205: // 题库标签最多写三个
        return Promise.resolve(response);
      case 206: // 题库标签最多写三个
        return Promise.resolve(response);
      // 服务器状态码不是2开头的情况
      //  这里可以跟你们的后台开发人员协商好统一的错误状态码
      // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    }
  },
  error => {
    console.log(error)
    // 获取error对象的config和response属性
    const { config, response } = error;
    const { data } = response;
    //#region 处理错误时的状态码信息
    switch (data.code) {
      case 401: // 没有被授权
        setTimeout(() => {
          message.warning("登录超时，请重新登录");
          setTimeout(() => {
            window.location.replace("/");
          }, 200);
        }, 100);
        return Promise.reject(error);
    }
    // 如果config不存在，或者retry选项没有设置，用reject
    if (!config || !config.retry) return Promise.reject(error);

    // 设置变量来跟踪重试次数
    config.__retryCount = config.__retryCount || 0;

    // 检查我们重试的次数是否超出最大重试次数
    if (config.__retryCount >= config.retry) {
      // 使用reject方法抛出错误
      Notification({
        title: "请求超时",
        message: "当前网络不佳，请稍后刷新重试"
      });

      return Promise.reject(error);
    }

    // 计算重试次数
    config.__retryCount += 1;
    // 创建一个新的Promise 来处理 exponential backoff
    let backoff = new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, config.retryDelay || 1);
    });

    // return the promise in which  recalls axios to retry the request
    return backoff.then(function () {
      return instance(config);
    });
  }
);

export default instance;
