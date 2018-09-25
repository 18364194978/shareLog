var vueDataAll = {
    creatLog: '',
    chooseType: '',
    showLogList: ''
};
$(function () {
    //todo 先promise数据库显示数据加载中再.then加载数据
    initDataBase();
    init();
    initAction();
    initForm();
})

function initDataBase() {
    console.log("初始化数据库");
}

function initAction() {
    console.log("###动作开始初始化");

}

function initForm() {
    console.log("##from表单初始化");
    vueDataAll.creatLog = new Vue({
        el: '#showCreatLogLoadding',
        data() {
            return {
                logTypesList: [{
                        name: "盈利",
                        value: "1"
                    }, {
                        name: "浮盈",
                        value: "2"
                    },
                    {
                        name: "浮亏",
                        value: "3"
                    }, {
                        name: "亏损",
                        value: "4"
                    }, {
                        name: "空仓",
                        value: "5"
                    },
                    {
                        name: "加仓",
                        value: "5"
                    }, {
                        name: "减仓",
                        value: "6"
                    }
                ],
                showCreatLogLoadding: false, //是否展示创建日志框
                newLogData: {
                    
                }
            }
        },
        methods: {
            creatLog: function (e) {
                console.log("aaa",e)
                // this.newLogData.date = $("#log_date").val();
                // this.showCreatLogLoadding = false; //隐藏浮框
                // console.log(this.newLogData)
                // var list =  vueDataAll.showLogList.logList.push(this.newLogData);
                // console.log(vueDataAll.showLogList.logList)
            }
        }
    });
    vueDataAll.showLogList = new Vue({
        el: '#showLogList',
        data:{
            logList: []
        },
        // data() {
        //     return {
                
        //     }
        // },
        methods: {
            showLog: function (e) {
                console.log("")
            }
        }
    });
    $("#addNewLog").click(function () {
        console.log("开始创建日志")
        vueDataAll.creatLog.showCreatLogLoadding = true;
    })
}

function init() {
    console.log("###日志数据开始初始化");
    vueDataAll.chooseType = new Vue({
        // mixins: [iedMixIn],
        el: '#chooseType',
        data() {
            return {
                list: [],
                showChooseLoadding: false //是否展示日志类型选择框
            }
        },
        computed: {
            size: function () {
                // return this.ieds.length;
            }
        },
        methods: {
            chooseThisTarget: function (event) {
                console.log(event)
                this.showChooseLoadding = false;

            },
            creatNewChoose: function () {}
        },
        watch: {
            ieds: function () {

            }
        }
    });
    let temList = [{
        guid: "123",
        value: "真的"
    }, {
        guid: "456",
        value: "真的6"
    }]
    vueDataAll.chooseType.list = temList;
    // console.log(logList)
}
// $e.on('chooseThisTarget', function(iedGuid) {
// 	console.log(iedGuid);
// 	$('#showList').parent().hide();
// });


function showTip(text, position) {
    $("#tooltip").css({
        "top": position.y,
        "left": position.x
    }).text(text).fadeIn('fast');
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(function () {
        $('#tooltip').fadeOut();
    }, 2000);
}