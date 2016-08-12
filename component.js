angular.module('component', [])

.directive('component', ['$compile', '$parse', function ($compile, $parse) {
    return {
        controller: function ($scope, $element) {
            var name = $parse($element.attr("name"))($scope);
            var args = $parse($element.attr("args"))($scope);
            var replace = $parse($element.attr("replace"))($scope);
            var argsStr = " ";
            angular.forEach(args, function (value, key, obj) {
                argsStr += key + '="' + value + '" ';
            });
            var elem = "<" + name + argsStr + "></" + name + ">";
            var component = $compile(elem)($scope)[0];
            if (replace) {
                $element.replaceWith(component);
            } else {
                $element.append(component);
            }
        }
    }
}])
