# 第5篇 基于ARMxy内置Node-RED平台的Modbus RTU数据采集实战

## 1 方案简介

本文以ARMxy边缘计算网关内置Node-RED平台为核心运行环境，通过Modbus Slave软件模拟Modbus RTU从站设备，实现串口通信配置、保持寄存器数据读取、数据调试校验全流程。

## 2 Modbus协议基础简介

### 2.1 Modbus RTU与Modbus TCP对比

Modbus是工业领域通用的总线通信协议，主流分为RTU和TCP两种模式，分别适配串口和以太网通信场景，核心差异如下表所示：


| 对比项目 | Modbus RTU | Modbus TCP |
| --- | --- | --- |
| 传输介质 | RS485串口总线 | 以太网网线 |

| 默认通信端口 | 无（串口波特率定义） | 502 |
| --- | --- | --- |
| 通信架构 | 主从 | 主从 |
| 典型应用场景 | 工业仪表、温湿度传感器、串口类终端设备 | 工业PLC、以太网网关、网络型智能设备 |


### 2.2 主站与从站工作机制

Modbus协议采用主从问答通信机制，通信全程由主站发起请求，从站被动响应，无主动上报机制：

主站（Master）：主动发起数据读取、指令写入请求，掌控通信节奏。

从站（Slave）：监听总线指令，接收主站请求后校验、执行指令并返回对应数据。

本文实操环境角色分配如下：


| 设备/软件 | 通信角色 |
| --- | --- |
| ARMxy网关 | 主站（主动读取数据） |
| Modbus Slave 模拟软件 | 从站（响应数据请求） |


## 3 系统整体架构

本次实操采用「软件模拟从站+硬件串口转换+边缘网关主站」的架构，完成Modbus RTU全流程通信测试，架构链路如下：

Modbus Slave（PC端模拟从站设备）
        │
        ▼
RS485串口通信总线
        │
        ▼
USB-RS485转换器（串口协议转换）
        │
        ▼
ARMxy边缘计算网关

## 4 硬件准备与接线规范

### 4.1 硬件清单

ARMxy边缘计算网关

USB转RS485转换器

### 4.2 硬件接线方式


核心为RS485差分信号线对接，接线规则统一、简单：

Plain Text
转换器A+  →  设备串口A+
转换器B-  →  设备串口B-


## 5 基于Modbus Slave创建模拟从站

通过Modbus Slave软件模拟真实从站设备，自定义寄存器地址和数值，供Node-RED主站读取，具体配置如下：

### 5.1 基础参数配置


从站地址（Slave ID）：1

功能码（Function）：03 （Holding Registers）

起始寄存器地址：40001

寄存器读取数量：3

### 5.2 自定义寄存器数据

为方便后续读取测试，预设3组保持寄存器数据：



## 6 核心功能节点说明

本次实操及后续开发常用核心节点：

modbus-read：通用Modbus数据读取节点，适配保持寄存器、输入寄存器读取

modbus-write：Modbus数据写入节点，可向从站寄存器写入数值

## 7 Modbus RTU通信节点参数配置

双击打开modbus-read节点，配置串口通信核心参数，所有参数必须与Modbus Slave模拟从站参数一致，否则通信失败，标准配置如下：


## 8 数据读取结果

在Node-RED流程中添加Debug节点，对接modbus-read输出端，部署流程后可在调试窗口查看数据。


## 9 常见故障排查方案

### 1. 波特率不匹配

故障现象：节点持续报错 （通信超时）

故障原因：Node-RED串口波特率和Modbus Slave软件波特率不一致

解决方案：统一波特率，使用9600。

### 2. RS485接线错误

故障现象：无报错、无数据返回，总线无响应

故障原因：RS485差分A、B信号线接反

解决方案：直接对调转换器与设备的A+、B-接线即可恢复通信。

### 3. 从站地址不匹配

故障现象：通信无响应、数据读取失败

故障原因：主站与从站地址不一致，示例：Node-RED配置Unit ID=2，Modbus Slave配置Slave ID=1，地址不统一导致无法握手。

解决方案：确保Node-RED节点Unit ID与模拟从站Slave ID完全一致。

### 4. 寄存器地址填写错误

故障现象：读取数据错位、读取空值

故障原因：节点未正确填写地址。

解决方案：严格遵循从站寄存器地址填写。


[
    {
        "id": "a1adfe858986c631",
        "type": "modbus-read",
        "z": "856d5bf8af2c53d2",
        "name": "",
        "topic": "",
        "showStatusActivities": false,
        "logIOActivities": false,
        "showErrors": false,
        "showWarnings": true,
        "unitid": "1",
        "dataType": "HoldingRegister",
        "adr": "40001",
        "quantity": "3",
        "rate": "2000",
        "rateUnit": "ms",
        "delayOnStart": false,
        "startDelayTime": "",
        "server": "41106a09a8a206e5",
        "useIOFile": false,
        "ioFile": "",
        "useIOForPayload": false,
        "emptyMsgOnFail": false,
        "x": 170,
        "y": 340,
        "wires": [
            [
                "fce82fab06d50390"
            ]
        ]
    },
    {
        "id": "fce82fab06d50390",
        "type": "debug",
        "z": "856d5bf8af2c53d2",
        "name": "debug 6",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 380,
        "y": 340,
        "wires": []
    },
    {
        "id": "41106a09a8a206e5",
        "type": "modbus-client",
        "name": "",
        "clienttype": "serial",
        "bufferCommands": true,
        "stateLogEnabled": false,
        "queueLogEnabled": false,
        "failureLogEnabled": true,
        "tcpHost": "127.0.0.1",
        "tcpPort": "502",
        "tcpType": "DEFAULT",
        "serialPort": "/dev/ttyAS4",
        "serialType": "RTU-BUFFERD",
        "serialBaudrate": "9600",
        "serialDatabits": "8",
        "serialStopbits": "1",
        "serialParity": "none",
        "serialConnectionDelay": "100",
        "serialAsciiResponseStartDelimiter": "0x3A",
        "unit_id": "1",
        "commandDelay": "1",
        "clientTimeout": "1000",
        "reconnectOnTimeout": true,
        "reconnectTimeout": "2000",
        "parallelUnitIdsAllowed": true,
        "showErrors": false,
        "showWarnings": true,
        "showLogs": true
    }
]

售后支持: 0755-29451836
```
