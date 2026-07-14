# 一、实验目标

基于ARMxy工业计算机，熟练掌握 Node-RED 开发中最核心、最高频的四个基础节点，分别为 Inject（注入节点）、Debug（调试节点）、Switch（判断节点）、Function（函数节点）。

![ARMxy BL340 工业边缘网关](assets/picture/1.png)

# 二、Node-RED 消息机制简介

Node-RED 所有节点的数据交互、流程传递均基于 msg 消息对象 实现，节点之间传输的所有数据都封装在该对象中，是 Node-RED 运行的核心载体。

标准基础消息格式示例：

```
{
    "payload": 35
}
```

核心参数说明：

msg.payload：消息主体数据，是整个流程中数据存储、处理、传输的核心字段，绝大多数节点的输入、输出、运算均围绕msg.payload展开。

简单来说，Node-RED 可视化编程的本质，就是对 msg.payload 数据的获取、运算、转换、判断与输出。

# 三、Inject

## 3.1 节点作用

Inject 节点是流程的触发源头，用于主动生成消息、启动整个业务流程，无需依赖外部设备、接口触发，是调试、测试、模拟场景的核心节点。

<img>eb06f721b1c3cf6a5b9f49b08b66ff0e</img>

常见应用场景：

- 手动触发流程测试与调试
- 定时自动执行业务逻辑
- 模拟传感器、设备上报数据
- 定时触发 MQTT 上传、Modbus 读取、接口请求等操作

## 3.2 手动触发模式

点击 Inject 节点左侧的蓝色按钮，即可手动发送一次消息，触发整条流程执行，适用于单次调试、功能验证。

## 3.3 定时触发模式

支持周期性自动触发流程，无需人工干预。配置方式：Repeat 选择 interval（间隔模式），设置对应时间周期。

示例：配置每10秒执行一次流程

适用场景：定时采集传感器数据、定时上传设备状态、定时读取工业设备参数、定时请求接口数据。

# 四、Debug

## 4.1 节点作用

Debug 节点是 Node-RED 开发的核心调试工具，用于实时查看流程中消息的数据内容、格式、传输状态，排查流程报错、数据异常问题，使用频率最高。

<img>c3fc58900d0500d12294d49aa720d827</img>

## 4.2 查看核心数据（msg.payload）

节点配置：Output 选择msg.payload，仅输出消息主体数据，简化调试信息。

## 4.3 查看完整消息对象

节点配置：Output 选择 complete msg object (与调试输出相同)，输出整条消息的所有参数，包含系统内置字段与自定义字段。

# 五、Switch

## 5.1 节点作用

Switch 节点为条件分流节点，类比编程语言中的 if、else if、else 逻辑，可根据自定义条件对消息数据进行判断，实现流程多路分支、条件分流。

<img>7d3322d6358dcf423d351ee220633ce4</img>

# 六、Function（函数节点）详解

## 6.1 节点作用

Function 节点是 Node-RED 的自定义逻辑核心，支持编写原生 JavaScript 代码处理消息数据，弥补可视化节点的功能短板，适用于复杂数据处理场景。

<img>4c0b1506870cfd187b1be3d64b018ddd</img>

核心应用场景：数据计算、数据格式转换、字符串处理、协议数据解析、自定义业务逻辑封装、复杂条件判断。

# 七、节点实战：温度采集报警模拟系统

## 7.1 实验目标

基于四大基础节点，搭建模拟温度采集报警系统，实现自动生成随机温度、智能判断温度状态、输出对应提示信息的完整流程：

- 温度 ≥ 30℃：输出高温报警提示
- 温度 < 30℃：输出温度正常提示

## 7.2 整体流程拓扑

Inject 节点（触发流程）

↓

Function 节点（生成随机温度）

↓

Switch 节点（温度条件分流）

├── 高温分支 → Function 节点（封装报警信息）→ Debug 输出

└── 正常分支 → Function 节点（封装正常信息）→ Debug 输出

## 7.3 温度模拟 Function 节点配置

通过随机函数生成 0~39℃ 的模拟温度数据，如图：

<img>4a88f8536ade0e8b0ed39f7da804564e</img>

代码说明：Math.random() * 40 生成 0-40 随机小数，Marh.floor()向下取整，最终得到 0~39 的整数温度值。

## 7.4 Switch 节点分流配置

判断对象：msg.payload

分流规则：

- 输出1：条件 >30 → 高温报警分支
- 输出2：otherwise → 温度正常分支

## 7.5 高温报警分支 Function 配置

对超温数据进行文字封装，生成报警提示，如图：

<img>ecce75c75427393b5beae172332c8a45</img>

## 7.6 正常温度分支 Function 配置

对正常温度数据进行文字封装，如图：

<img>5f6e8ecafe6937b4f4aff444c2831ba2</img>

## 7.7 最终 Debug 输出效果

<img>ad3855c1da97c5be904cfb77572294a8</img>

```
[
    {
        "id": "7e82b0e46aa45852",
        "type": "tab",
        "label": "流程 1",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "bb7092fcf4d6c569",
        "type": "inject",
        "z": "7e82b0e46aa45852",
        "name": "启动测试",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "timestamp",
        "payloadType": "str",
        "x": 80,
        "y": 380,
        "wires": [
            [
                "8c9ef9e7deba363c"
            ]
        ]
    },
    {
        "id": "7efa7c99c98594b2",
        "type": "debug",
        "z": "7e82b0e46aa45852",
        "name": "debug 1",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 760,
        "y": 340,
        "wires": []
    },
    {
        "id": "8c9ef9e7deba363c",
        "type": "function",
        "z": "7e82b0e46aa45852",
        "name": "随机温度生成",
        "func": "msg.payload = Math.floor(Math.random() * 40);\n\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 260,
        "y": 380,
        "wires": [
            [
                "4c80c43f8159efc9"
            ]
        ]
    },
    {
        "id": "f6e83eb71fe0f177",
        "type": "function",
        "z": "7e82b0e46aa45852",
        "name": "高温",
        "func": "msg.payload =\n    \"温度过高报警：\" +\n    msg.payload +\n    \"℃\";\n\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 610,
        "y": 340,
        "wires": [
            [
                "7efa7c99c98594b2"
            ]
        ]
    },
    {
        "id": "e795c25f083eda29",
        "type": "function",
        "z": "7e82b0e46aa45852",
        "name": "正常",
        "func": "msg.payload =\n    \"温度正常：\" +\n    msg.payload +\n    \"℃\";\n\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 610,
        "y": 420,
        "wires": [
            [
                "f601d27593217c84"
            ]
        ]
    },
    {
        "id": "f601d27593217c84",
        "type": "debug",
        "z": "7e82b0e46aa45852",
        "name": "debug 2",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 760,
        "y": 420,
        "wires": []
    },
    {
        "id": "4c80c43f8159efc9",
        "type": "switch",
        "z": "7e82b0e46aa45852",
        "name": "温度判断",
        "property": "payload",
        "propertyType": "msg",
        "rules": [
            {
                "t": "gte",
                "v": "30",
                "vt": "num"
            },
            {
                "t": "else"
            }
        ],
        "checkall": "true",
        "repair": false,
        "outputs": 2,
        "x": 460,
        "y": 380,
        "wires": [
            [
                "f6e83eb71fe0f177"
            ],
            [
                "e795c25f083eda29"
            ]
        ]
    }
]
```
