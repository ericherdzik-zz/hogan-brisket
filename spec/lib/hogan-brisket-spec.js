describe("hogan-brisket", function() {
    "use strict";

    var hoganBrisket = require("../../lib/hogan-brisket");

    var compiledPartial;
    var compiledTemplate;
    var hoganAdapter;
    var mockCompiledTemplates;
    var options;

    function mockCompiledTemplate() {
        return {
            render: jasmine.createSpy()
        };
    }

    beforeEach(function() {
        compiledPartial = mockCompiledTemplate();
        compiledTemplate = mockCompiledTemplate();

        mockCompiledTemplates = {
            "test/template": compiledTemplate,
            "test/_partial": compiledPartial
        };
    });

    describe("when 'globalPartials' option is NOT set", function() {
        beforeEach(function() {
            options = {};
            hoganAdapter = hoganBrisket(mockCompiledTemplates, options);
        });

        describe("#templateToHTML", function() {
            it("makes all partials available to template", function() {
                hoganAdapter.templateToHTML("test/template");
                expect(compiledTemplate.render.calls.mostRecent().args[1]).toEqual(mockCompiledTemplates);
            });

            it("allows named partials to be passed", function() {
                hoganAdapter.templateToHTML("test/template", {}, {
                    "testPartial": "test/_partial"
                });

                expect(compiledTemplate.render.calls.mostRecent().args[1]).toEqual({
                    "test/template": compiledTemplate,
                    "test/_partial": compiledPartial,
                    "testPartial": compiledPartial
                });
            });
        });

        itBehavesLikeAHoganAdapter();
    });

    describe("when 'globalPartials' option is set to false", function() {
        beforeEach(function() {
            options = {
                globalPartials: false
            };

            hoganAdapter = hoganBrisket(mockCompiledTemplates, options);
        });

        describe("#templateToHTML", function() {
            describe("when partials are NOT provided", function() {
                it("does NOT make any partials available to template", function() {
                    hoganAdapter.templateToHTML("test/template");
                    expect(compiledTemplate.render.calls.mostRecent().args[1]).toEqual({});
                });
            });

            describe("when partials are provided", function() {
                it("makes only provided partials available to template", function() {
                    hoganAdapter.templateToHTML("test/template", {}, {
                        "testPartial": "test/_partial"
                    });

                    expect(compiledTemplate.render.calls.mostRecent().args[1]).toEqual({
                        "testPartial": compiledPartial
                    });
                });
            });
        });

        itBehavesLikeAHoganAdapter();
    });

    function itBehavesLikeAHoganAdapter() {
        describe("#templateToHTML", function() {
            describe("when templateId is NOT valid", function() {
                function templateToHTMLWithInvalidId() {
                    return hoganAdapter.templateToHTML("test/invalid-template");
                }

                it("throws an error", function() {
                    expect(templateToHTMLWithInvalidId).toThrow();
                });
            });

            describe("when data is NOT provided", function() {
                it("does NOT forward any data to the template", function() {
                    hoganAdapter.templateToHTML("test/template");
                    expect(compiledTemplate.render.calls.mostRecent().args[0]).toBeUndefined();
                });
            });

            describe("when data is provided", function() {
                var data;

                beforeEach(function() {
                    data = {
                        title: "Test Data"
                    };
                });

                it("forwards data to the template", function() {
                    hoganAdapter.templateToHTML("test/template", data);
                    expect(compiledTemplate.render.calls.mostRecent().args[0]).toEqual(data);
                });
            });
        });
    }
});
