
"use strict";

//core
require('../snapshot');
require('../note/filter/base-filter');

//filter Configurable
require('../note/filter/node-asterisk-filter');//星号过滤
require('../note/filter/node-attrs-filter');//s-属性
require('../note/filter/node-invisible-filter');//不可见元素

require('../note/filter/note-clean-filter');//清理已不需要的信息
require('../note/filter/note-width-filter');//宽度
require('../note/filter/note-upgrade-filter');//空壳note升级

//processor
require('../note/processor/default-item-processor');
require('../note/processor/default-group-processor');
require('../note/processor/default-panel-processor');

//extend
require('../extend/default-table-processor');
require('../extend/default-table-convertor');


//bank version
require('../snapshot-integrate');
require('../snapshot-ajax');
require('../extend/default-tab-processor');
require('../extend/bank/bank-select2-processor');
