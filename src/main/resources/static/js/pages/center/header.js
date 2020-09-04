new Vue({
    el: "#header",
    data: {
        username: '',
        dataInfo: '',
        isIndex: true
    },
    created() {
        let href = window.location.href;
        let uri = (href.split('/')[href.split('/').length - 1]);
        if (uri !== 'index') {
            this.isIndex = false;
        }
        this.username = getCookies("username");
        this.getDateInfo();
    },
    methods: {
        getDateInfo: function() {
            mydate=new Date();
            myweekday=mydate.getDay();
            mymonth=mydate.getMonth()+1;
            myday= mydate.getDate();
            myyear= mydate.getYear();
            year=(myyear > 200) ? myyear : 1900 + myyear;
            if(myweekday === 0)
                weekday=" 星期日";
            else if(myweekday === 1)
                weekday=" 星期一";
            else if(myweekday === 2)
                weekday=" 星期二";
            else if(myweekday === 3)
                weekday=" 星期三";
            else if(myweekday === 4)
                weekday=" 星期四";
            else if(myweekday === 5)
                weekday=" 星期五";
            else if(myweekday === 6)
                weekday=" 星期六";
            this.dateInfo = year+"年"+mymonth+"月"+myday+"日"+weekday;
        }
    }
});