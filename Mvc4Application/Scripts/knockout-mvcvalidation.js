$(function () {
    if (typeof (ko) === "undefined") { throw 'Knockout is required, please ensure it is loaded before loading this plug-in'; }

    ko.validation = {
        parseForm: function (selector, model) {
            var form = $(selector);

            if (model === undefined) {
                model = new Object({});
            }

            form.find(":input:not(:button)").each(function () {
                var input = $(this),
                    propertyName = input.attr("name");

                if (input.is("input[type='text']")) {
                    input.attr("data-bind", "value: " + propertyName);
                }

                model[propertyName + "_Default"] = input.val();
                model[propertyName] = ko.observable(input.val());

                if (input.attr("data-val")) {
                    model[propertyName].extend({ validatable: {} });

                    form.find("span[data-valmsg-for='" + propertyName + "']")
                        .attr("data-bind", "text: " + propertyName + ".validationMessage(), visible: !" + propertyName + ".isValid()");

                    if (input.attr("data-val-required")) {
                        model[propertyName].extend({
                            required: {
                                message: input.attr("data-val-required")
                            }
                        });
                    }

                    if (input.attr("data-val-length")) {
                        model[propertyName].extend({
                            maxLength: {
                                bound: input.attr("data-val-length-max"),
                                message: input.attr("data-val-length")
                            }
                        });
                    }
                }
            });

            return model;
        }
    }

    ko.extenders.maxLength = function (observable, parameters) {
        var validator = new Object({
            isValid: ko.observable(false),
            message: parameters.message,
        });

        var array = observable.validators();
        array.push(validator);

        function validate(newValue) {
            if (observable.isValidatable()) {
                validator.isValid(newValue.length <= parameters.bound);
                observable.validators.valueHasMutated();
            }
        }

        observable.subscribe(validate);

        observable.isValidatable.subscribe(function (newValue) {
            if (!newValue) {
                observable.isValid(true);
                observable.validationMessage("");
            }
        });

        return observable;
    }

    ko.extenders.required = function (observable, parameters) {
        var validator = new Object({
            isValid: ko.observable(false),
            message: parameters.message,
        });

        var array = observable.validators();
        array.push(validator);

        function validate(newValue) {
            if (observable.isValidatable()) {
                validator.isValid(newValue ? true : false);
                observable.validators.valueHasMutated();
            }
        }

        observable.subscribe(validate);
        
        observable.isValidatable.subscribe(function (newValue) {
            if (!newValue) {
                observable.isValid(true);
                observable.validationMessage("");
            }
        });

        return observable;
    }

    ko.extenders.validatable = function (observable, parameters) {
        observable.isValid = ko.observable(true);
        observable.isValidatable = ko.observable(true);
        observable.validationMessage = ko.observable("");
        observable.validators = ko.observableArray([]);

        observable.validators.subscribe(function () {
            var validator = ko.utils.arrayFirst(observable.validators(), function (item) {
                return !item.isValid();
            });

            if (validator === null) {
                observable.isValid(true);
                observable.validationMessage("");
            } else {
                observable.isValid(false);
                observable.validationMessage(validator.message);
            }
        });
    }

    ko.validatedObservable = function (observable) {
        observable.isValid = ko.observable(true);
        observable.isValidatable = ko.observable(true);
        observable.validationMessage = ko.observable("");
        observable.validators = ko.observableArray([]);

        for (var prop in observable) {
            if (observable[prop].hasOwnProperty("isValidatable")) {
                var array = observable.validators();

                ko.utils.arrayForEach(observable[prop].validators(), function (item) {
                    array.push(item);
                });
            }
        };

        observable.resetValidation = function () {
            observable.isValid(true);

            for (var prop in observable) {
                if (observable[prop].hasOwnProperty("isValidatable")) {
                    observable[prop].isValidatable(false);
                    observable[prop](observable[prop + "_Default"]);
                    observable[prop].isValidatable(true);
                }
            };
        };

        observable.validate = function () {
            for (var prop in observable) {
                if (observable[prop].hasOwnProperty("isValidatable")) {
                    observable[prop].valueHasMutated();
                }
            };

            var validator = ko.utils.arrayFirst(observable.validators(), function (item) {
                return !item.isValid();
            });

            if (validator === null) {
                observable.isValid(true);
            } else {
                observable.isValid(false);
            }
        };

        return observable;
    }
});