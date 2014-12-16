"use strict";

var Brisket = require("brisket");


function createHoganAdapter(compiledTemplates, options) {
    var globalPartials = (options && options.hasOwnProperty("globalPartials")) ?
        !!options.globalPartials :
        true;

    function resolvePartials(partials) {
        var resolvedPartials = {};

        if (globalPartials) {
            resolvedPartials = compiledTemplates;
        }

        for (var partialName in partials) {
            if (partials.hasOwnProperty(partialName)) {
                var partialPath = partials[partialName];
                resolvedPartials[partialName] = compiledTemplates[partialPath];
            }
        }

        return resolvedPartials;
    }

    var HoganAdapter = Brisket.Templating.TemplateAdapter.extend({
        templateToHTML: function(templateId, data, partials) {
            var template = compiledTemplates[templateId];

            if (!template) {
                throw new Error("Could not find template: " + templateId);
            }

            return template.render(data, resolvePartials(partials));
        }
    });

    return HoganAdapter;
}

module.exports = createHoganAdapter;
