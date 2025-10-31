---
title: spring-ioc介绍
date: 2025-10-31 00:00:00 +0800 # YYYY-MM-DD HH:MM:SS +/-TTTT 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: ["编程"]
tags: ["Spring"]     # TAG names should always be lowercase

math: true
mermaid: true
---

# Spring IOC介绍

## 依赖自管理的时代
需要自己设置对象成员属性的值，一般做法是创建一个成员属性类的具体实例，传递给当前类的构造函数，在构造函数中给实例属性赋值。

## IOC容器的到来
对象的依赖通过构造函数参数、或者工厂方法参数、或者setter属性定义，随后这些依赖将被容器注入到当前对象。

对象的构建过程本应该是在构造函数中指定以来，传统的顺序是对象本身诞生前，依赖就已经设置好了。

对象的依赖项由程序员自己指定变为了定义依赖项，依赖具体对象由容器自动注入的方式。依赖项被设置到对象在构造方法之后或者工厂方法返回之前，因此变成了先有对象，后指定依赖项，这和传统工艺相逆。因此称这种工艺为控制反转。

## Spring IOC
beans包和context包是IOC容器的基础包。

BeanFactory 是IOC容器的顶级接口，包含了IOC容器最基本的功能定义。

ApplicationContext是BeanFactory的子接口，除了基础的IOC功能外，还添加了更多企业级特性，是BeanFactory的一个超集。例如对Web的支持、事件发布、国际化、与Spring AOP特性集成等。

## Spring Bean
应用程序中被IOC容器管理的对象称之为 Bean。