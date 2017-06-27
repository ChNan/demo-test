var menutree = {
    nodeIndex:0,
	init:function(){

		var defaultData = [
            {
                text: $.i18n.prop('menutree.js.talksetting'),
                href: 'talksetting'
            },
            {
                text: $.i18n.prop('menutree.js.systemSetting'),
                href: '#parent1',
                selectable: false,
                nodes: [
                    {
                        text: $.i18n.prop('menutree.js.smtpsetting'),
                        href: 'smtpsetting'
                    }
                ]
            },
        ];

        $('#m-mt-tree').treeview({
        	selectedBackColor:'#ddd',
            selectedColor:"#12B5B0",
            backColor:"#f2f2f2",
            borderColor:"#f2f2f2",
            selectedIcon:"glyphicon glyphicon-play",
        	data: defaultData,
        	onNodeSelected:function(event, data){

        		main.pageInit(main.MAIN_DATA,data.href,function(){
					console.log($.i18n.prop('menutree.js.load.success'));
				});
        	}
        })
        //触发第一个节点选中事件
        $('#m-mt-tree').treeview('selectNode', [ menutree.nodeIndex ]);
	},
    selectNode:function(index){
        $('#m-mt-tree').treeview('selectNode', [ index ]);
    },
	treeEvent:function(){

	}
}