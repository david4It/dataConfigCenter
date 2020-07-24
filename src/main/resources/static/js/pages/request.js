let service = axios.create({
    timeout: 5000 ,
    withCredentials:false
});

service.interceptors.response.use(response => {
    //对响应数据做操作
    if (response.data.errorCode !== 'invalidSession' && response.data.errorCode !== 'expiredSession') {
        return response;
    }
    if(response.data.errorCode === 'invalidSession' || response.data.errorCode === 'expiredSession') {
        window.alert(response.data.tip);
        setTimeout(()=> {
            window.location.href = '/form_login';
        }, 500);
        return Promise.reject(response);
    }
}, error => {
    //对响应数据错误做操作
    console.log('请求error', error.message);
    return Promise.reject(error);
});