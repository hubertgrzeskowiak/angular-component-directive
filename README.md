# Angular module: component-directive
AngularJS 1 directive for rendering of dynamic / procedural components.

Original by @hubertgrzeskowiak
Copyright Hubert Grzeskowiak 2016
License: MIT

## Demo
[Simple demo](http://plnkr.co/edit/5hGgsgzeFxmwAboeo3E9?p=preview)

[Advanced demo](http://plnkr.co/edit/uDxIUulQPx4C3s11b5cG?p=preview)

# The Problem
when declaring a component in HTML you can only hard-code the tag. This is a limitation, when you want the type of a component to be determined based on the current container's state. A common workaround for this is using `ng-switch` or `ng-if` alongside multiple hard-coded components:

    <div ng-switch="dynamic.component">
        <alpha ng-switch-when="alpha"></alpha>
        <beta ng-switch-when="beta"></beta>
    </div>

or

    <alpha ng-if="dynamic.component == 'alpha'"></alpha>
    <beta ng-if="dynamic.component == 'beta'"></beta>

In my opinion this is an antipattern, because

1. it requires hard-coding the possible outcomes in the template
2. the boilerplate code easily introduces bugs

# My Solution
The directive `component` you'll find in this repository is capable of rendering any registered component just as if you wrote its name into the template. Except you don't have to explicitly tell it by name. Instead, you pass a variable to the component's `name` attribute and it renders out an element with that given tag. Arguments can be passed using the `args` attribute.

## Usage
1. Include the `component.js` file in your HTML:
 
        <script src="components.js"></script>

2. Declare a dependency on the moduke where you're using it:

        angular.module('awesomeApp', ['component'])

3. Use the new directive in your templates:

        <component name="" args="" replace=""></component>

All attributes are optional, but you should provide at least `name` for it to be useful. 

### Dynamic components (using `name`)
The following code is the most simple usage of the directive:

    <component name="'mycomponent'"></component>
    
It's rendered as:

    <component name="'mycomponent'">
        <mycomponent></mycomponent>
    </component>
    
> Indentation is added for better reading. In real, there is no newlines and whitespace.
    
We've basically passed the name of the component we wanted to the `name` attribute. The nested quotes are required because the argument is an Angular expression. This gives us the power of using any variable from the current scope:
 
    <component name="controller.componentname"></component>

In this case the name of the component is derived from a variable on the controller. Given `componentname` being `foobar` the code above would render:

    <component name="controller.componentname">
        <foobar></foobar>
    </component>

### Using `args`
Components in AngularJS have their own, isolated scope. However, they can have bindings, which allow for sharing data with its parent template. These bindings are written as attributes to the component elements. Using the component directive you can pass any attributes you want using the `args` attribute on the `component` element.

To create a dynamic component based on local scope variables, write: 

    <component name="comp" args="args"></component>
    
With `comp='alpha'` and `args={arg1:"a"}` this results in the following element being rendered:
 
    <component name="comp" args="args">
        <alpha arg1="a"></alpha>
    </component>

Note how the `args` object was unpacked and each of its properties became an attribute.
 
Keep in mind that the value of `arg1` above is an expression and is evaluated in the current scope. If you wanted to pass a string containing `"a"`, you would rather define the `args` as `{arg1:"'a'"}`.

> Hint: The component directive does not create an isolated scope. You can use whatever variables were defined in the scope of the component's parent.

### Using `replace`
From the examples above you probably noticed that the component element stays in the DOM and only renders the requested component as its own child. Sometimes you rather want to have the inner component only. For this, you can pass the `replace` attribute with a boolean of `true` to tell the directive to replace itself with the component.

    <component name="'mycomponent'" replace="true">
        <mycomponent></mycomponent>
    </component>

renders into this:

    <mycomponent></mycomponent>

# Implications
This technique can act as Inversion Of Control (IoC), since the data tells how it is to be rendered, not the parent template. However, the concerns of model, view and controller stay separated, since we only carry a reference to the component - its name.

Since components are like elements to the browser, unknown components and recognized HTML elements are no problem and render normally (like hard-coded).

# Bugs & Improvements
Feel free to fork and post issues on GitHub.
