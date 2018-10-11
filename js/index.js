'use strict';
var _ = require('underscore');
var dataApi = require('./js/dataApi.js');
var commen = require('./js/commen.js');
var dbFilePath = './data/data.db';
//缓存数据
var catchData = {
    shareLog: '',
    shareType: ''
}
var vueDataAll = {
    creatLog: '',
    chooseType: '',
    showLogList: ''
};
$(function () {
    initDataBase();
    init();
    initAction();
    initForm();
})

function initDataBase() {
    console.log("初始化数据库");
    return dataApi.changeDB(dbFilePath).then(function () {
        console.log('数据库已打开');
    }).catch(function () {
        console.log('数据库打开失败');
    })
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
                grailTypes: [{
                    name: "上证指数",
                    value: "1"
                }, {
                    name: "深证指数",
                    value: "2"
                }, {
                    name: "创业板指数",
                    value: "3"
                }],
                showCreatLogLoadding: false, //是否展示创建日志框
                newLogData: {

                }
            }
        },
        methods: {
            creatLog: function (e) {
                //获取当前所在tab页
                var tab = $("#myTab li[class='active'] a")[0].text;
                if (tab == "股票日志") {
                    var d = {};
                    var t = $('#showCreatLogLoadding').serializeArray();
                    $.each(t, function () {
                        d[this.name] = this.value;
                    });
                    d.guid = commen.getGuid();
                    console.log(d);
                    addLog(d, "share"); //新增table数据
                    // vueDataAll.showLogList.logList.push(d);
                    $('#showCreatLogLoadding')[0].reset()
                    this.showCreatLogLoadding = false; //隐藏浮框
                } else if (tab == "大盘日志") {
                    var d = {};
                    var t = $('#showCreatLogLoadding').serializeArray();
                    $.each(t, function () {
                        d[this.name] = this.value;
                    });
                    d.guid = commen.getGuid();
                    console.log(d);
                    addLog(d, "grail"); //新增table数据
                    $('#showCreatLogLoadding')[0].reset()
                    this.showCreatLogLoadding = false; //隐藏浮框
                }
            }
        }
    });
    // vueDataAll.showLogList = new Vue({
    //     el: '#showLogList',
    //     data() {
    //         return {
    //             logList: []
    //         }
    //     },
    //     methods: {
    //         showLog: function (e) {
    //             console.log("")
    //         }
    //     }
    // });
    $("#addNewLog").click(function () {
        console.log("开始创建日志");

        vueDataAll.creatLog.showCreatLogLoadding = true;
    })
    $(".bb").click(function (x) {
        console.log("aaaaa", x)
    })
}

function init() {
    initDataBase().then(function () {
        dataApi.getAllShareType().then(function (d) {
            catchData.shareType = d.data;
            vueDataAll.chooseType.list = d.data;
            console.log('1111', d)
        });
    })
    console.log("###日志数据开始初始化");
    vueDataAll.chooseType = new Vue({
        el: '#chooseType',
        data() {
            return {
                list: [],
                showChooseLoadding: true //是否展示日志类型选择框
            }
        },
        computed: {
            size: function () {
                // return this.ieds.length;
            }
        },
        methods: {
            chooseThisTarget: function (type) {
                this.showChooseLoadding = false;
                dataApi.getAllShareLog(type).then(function (d) {
                    catchData.shareLog = d.data;
                    showLog(d.data);
                });

            },
            creatNewChoose: function () {}
        },
        watch: {
            ieds: function () {

            }
        }
    });
}
// $e.on('chooseThisTarget', function(iedGuid) {
// 	console.log(iedGuid);
// 	$('#showList').parent().hide();
// });
//渲染log列表
function showLog(data) {
    var columns = [{
        field: 'guid',
        title: 'id',
        align: 'center',
        halign: 'center',
        valign: 'middle',
        visible: false
    }, {
        field: 'guid',
        title: '序号',
        align: 'center',
        halign: 'center',
        valign: 'middle',
        formatter: function (value, row, index) {
            return index + 1;
        }
    }, {
        field: 'share_name',
        title: '股票名称',
        align: 'center',
        halign: 'center',
        valign: 'middle'
    }, {
        field: 'date',
        title: '日期',
        align: 'center',
        halign: 'center',
        valign: 'middle'
    }, {
        field: 'share_type',
        title: '收益类型',
        formatter: function (index, row) {
            var d = row['share_type'];
            if (d == "1") {
                return "盈利";
            } else if (d == "2") {
                return "浮盈";
            } else if (d == "3") {
                return "浮亏";
            } else if (d == "4") {
                return "亏损";
            } else if (d == "5") {
                return "空仓";
            } else if (d == "6") {
                return "加仓";
            } else if (d == "7") {
                return "减仓";
            }
        },
        align: 'center',
        halign: 'center',
        valign: 'middle'
    }, {
        field: 'share_percent',
        title: '收益百分比',
        align: 'center',
        halign: 'center',
        valign: 'middle',
        formatter: function (index, row) {
            let pp = row['share_percent'];
            return pp + " %";
        }
    }, {
        field: 'share_much',
        title: '收益金额',
        align: 'center',
        halign: 'center',
        valign: 'middle',
        formatter: function (value, row, index) {
            return "<span class='badge bg-orange'  style='padding:5px 10px;'>" + value + "</span>"
        }
    }, {
        field: 'share_value',
        title: '收盘股价',
        align: 'center',
        halign: 'center',
        valign: 'middle'
    }, {
        field: 'share_num',
        title: '收盘手数',
        align: 'center',
        halign: 'center',
        valign: 'middle'
    }, {
        field: 'share_remarks',
        title: '备注',
        align: 'center',
        halign: 'center',
        valign: 'middle'
    }];
    $('#table1').bootstrapTable('destroy');
    $('#table1').bootstrapTable({
        data: data,
        classes: 'table table-hover',
        search: false,//显示搜索
        fixedColumns: true,
            fixedNumber: 1, //固定列数
        // uniqueId: "guid",
        sortName: 'date', // 要排序的字段
        sortOrder: 'desc',
        columns: columns
    })
    // $("#table1").bootstrapTable('destroy').bootstrapTable({
    //     fixedColumns: true,
    //     fixedNumber: 1 //固定列数
    // })
}
/**
 * 新增日志
 * @param {Obj} data 保存的数据
 * @param String} type 保存的类型 share.股票；grail.大盘
 */
function addLog(data, type) {
    if (type == "share") {
        $("#table1").bootstrapTable('append', data); //向table内添加
        var sql = `INSERT INTO share_log (guid,share_name,share_index,share_type,date,share_percent,share_much,share_num,share_remarks) VALUES 
        ('${data.guid}','${data.share_name}','${data.share_index}','${data.share_type}','${data.date}','${data.share_percent}','${data.share_much}','${data.share_num}','${data.share_remarks}')`;
        dataApi.setDataList(dbFilePath, sql, function (a, b) {
            console.log(a, b, '333')
        });
    } else if (type == "grail") {
        var sql = `INSERT INTO grail_log (guid,grail_type,date,grail_num,grail_percent,grail_range,grail_up) VALUES
        ('${data.guid}', '${data.grail_type}', '${data.date}', '${data.grail_num}', '${data.grail_percent}', '${data.grail_range}', '${data.grail_up}')
        `;
        dataApi.setDataList(dbFilePath, sql, function (a, b) {
            console.log(a, b, '333')
        });
    }
}

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