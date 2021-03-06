# form-snapshot
A lightweight, extendable front-end form sanpshot tool for web page.

## V1.0.0

### 目标
支持项目中80%的WEB表单提交节点的有效内容的解析识别

### 代码构成
- 组件： 核心组件，处理器，过滤器，转换器  
- 演示： 实例演示  
- 插件： -ajax，-preview

### 组件
- 核心组件
- 处理器
- 过滤器
- 转换器
### 实例
- 银行端，覆盖80%增删改业务
- 企业端，覆盖80%增删改业务

### 插件 -ajax
Ajax插件使用代理模式，主动对标识的快照区域（节点）进行快照生成并随业务数据一起提交到后台

### 插件 -preview
项目使用开发时使用，使集成快照的业务页面可以实时查看快照结果


### Usage ###

sts [port] 当前目录启动静态服务

**场景假定：**  
	场景A：提交表单具备工单详情的展示要素，且为常规标准表单  
	场景B：提交表单具备工单详情的展示要素，但存在非常规的或自定义的表单要素  
	场景C：提交表单不具备工单详情的展示要素，后台支持方案  
	场景D：跨应用展示，方案支持  

**方向目标：**  
	第一步：满足常规标准场景，标准表单和表格  
	第二步：逐步支持多种自定义的界面控件和组件  
	第三步：支持复杂场景  

**几种模式：**  
	1、Snapshot生成JSON，Snapshot转换html  
	2、Snapshot生成JSON，页面自己（比如模板）转换html  
	3、JAVA生成JSON，Snapshot转换html   
	4、JAVA生成JSON，页面自己（比如模板）转换html  
	5、脱离JSON生成和转换模式  



1、核心组件和集成插件独立构建，且和扩展插件分离管理（核心组件、集成插件按版本管理，扩展插件跟随项目管理）
2、未决策：提前生成html片段，还是在工单展示的时候生成
3、核心组件和扩展插件 分别转换的html的样式集成能力，核心组件生成的html如何适应各项目
4、核心组件能力升级和进一步实例化（比如表格列表中删除操作的支持等，删除id能否支持数据库实时查询）
5、集成插件和扩展插件成熟度分析或改进
6、未决策：是否支持模板自动装配
7、未决策：工单展示是否只支持Json（或html）的加载模式，由核心组件装配渲染。（旧模式是否兼容）
8、mongodb集成
9、有历史数据时如何升级

其他说明：
1、前台页面决定是否进行快照生成，不由该业务是否走工作流决定
2、快照存储和业务提交不在同一事务，先进行快照存储
3、数据请求无实时状态记录
4、快照存储使用mongodb
5、数据量

