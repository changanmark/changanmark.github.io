---
title: spring-ioc使用
date: 2025-11-21 00:00:00 +0800 # YYYY-MM-DD HH:MM:SS +/-TTTT 2022-01-01 13:14:15 +0800 只写日期也行；不写秒也行；这样也行 2022-03-09T00:55:42+08:00
categories: ["编程", "Spring-Framework"]
tags: ["Spring"]     # TAG names should always be lowercase

math: true
mermaid: true
---

spring-framework 版本 6.2.14

IOC 容器、配置元信息、Bean 三者之间的关系就好像厨师、菜谱、菜的关系。
* IOC 容器是厨师
* 配置元信息是菜谱
* IOC 容器中存储的 Bean 是菜

厨师需要按照菜谱的信息来做菜，IOC 容器需要按照配置元信息来创建 Bean。

## IOC 的实现类
在 spring-framework 中，IOC 容器的实现类有很多，在 6.2.14 版本中有如下：
```java
DefaultListableBeanFactory
FileSystemXmlApplicationContext
ClassPathXmlApplicationContext
GenericXmlApplicationContext
StaticApplicationContext
GenericGroovyApplicationContext
AnnotationConfigApplicationContext
SimpleJndiBeanFactory
StaticListableBeanFactory
```

其中最常用的是`ClassPathXmlApplicationContext`和`AnnotationConfigApplicationContext`
* `ClassPathXmlApplicationContext` 从 xml 中加载配置元数据
* `AnnotationConfigApplicationContext` 使用注解信息加载配置元数据

在 JDK5 之前，java 中没有注解，因此配置元数据只能使用配置文件。
Spring-Framework 从 2.0 逐步引入注解，3.0 正式引入`AnnotationConfigApplicationContext`，让 IOC 容器可以通过读取注解来获取元数据信息。

现在基本以注解形式为主，很少使用 XML 配置 bean，因为写 XML 很麻烦，没有注解那么灵活。

## ClassPathXmlApplicationContext
XML 配置元数据

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="..." class="...">
		<!-- collaborators and configuration for this bean go here -->
	</bean>

	<bean id="..." class="...">
		<!-- collaborators and configuration for this bean go here -->
	</bean>

	<!-- more bean definitions go here -->

</beans>
```

XML还可以组合引入其他 XML 配置
```xml
<beans>
	<import resource="services.xml"/>
	<import resource="resources/messageSource.xml"/>
	<import resource="/resources/themeSource.xml"/>

	<bean id="bean1" class="..."/>
	<bean id="bean2" class="..."/>
</beans>
```

ClassPathXmlApplicationContext加载 xml 配置，创建 IOC 容器
```java
// create and configure beans
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);

// use configured instance
List<String> userList = service.getUsernameList();
```

更灵活的方式是使用 XML 读取器读取配置元数据，IOC 容器使用一个通用的 IOC 容器。
`GenericApplicationContext`是一个通用的 IOC 容器，`AnnotationConfigApplicationContext`是`GenericApplicationContext`的一个子类。

```java
GenericApplicationContext context = new GenericApplicationContext();
new XmlBeanDefinitionReader(context).loadBeanDefinitions("services.xml", "daos.xml");
context.refresh();
```
这是一种组合的思想，其中`XmlBeanDefinitionReader`是一种`BeanDefinitionReader`,还有其他的`BeanDefinitionReader`，例如：`PropertiesBeanDefinitionReader`可以用于从 properties 文件中加载元数据

## AnnotationConfigApplicationContext
注解配置元数据，通过`@Component`,`@Bean`,`@Configuration`等注解
```java
@Component
public class JpaItemDao {

    @Bean
    public JpaDao jpaDao(){
        ...
    }
    ...
}
```
AnnotationConfigApplicationContext加载注解配置元信息
```java
AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext();
annotationConfigApplicationContext.register(JpaItemDao.class);
annotationConfigApplicationContext.refresh();
```