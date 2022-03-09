function ViewModel() {
    // string and array properties will be defined down below
    // just after populating the json data object 
    // from the json file

    var self = this;
    self.DEFAULT_VIEW = ko.observable(0);
    self.IMPRESSUM_VIEW = ko.observable(1);
    self.PRIVACY_VIEW = ko.observable(2);

    self.currentView = ko.observable(self.PRIVACY_VIEW());
    self.showDefault = function () {
        self.currentView(self.DEFAULT_VIEW());
        return true;
    }
    self.showImpressum = function () {
        self.currentView(self.IMPRESSUM_VIEW());
        return true;
    }
    self.showPrivacy = function () {
        self.currentView(self.PRIVACY_VIEW());
        return true;
    }

    self.datVer = function(){
        return self.Owner().Name + ", " + self.Address() + ", " +
                self.Contact()[0][0] + ": " + self.Contact()[0][1] + ", " +
                self.Contact()[1][0] + ": " + self.Contact()[1][1] + ", " +
                self.Contact()[2][0] + ": " + self.Contact()[2][1];
    }

}


function GetKeyAndValue(prop) {
    return {
        key: Object.keys(prop)[0],
        value: Object.values(prop)[0]
    };
}

function GetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function htmlToElement(html, attributes) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result


    // add attributes if present
    if (attributes && attributes.length > 0) {
        var arrat = [];
        for (let i = 0; i < attributes.length; i++) {
            const a = attributes[i];
            arrat.push(a.name + '="' + a.value + '"');
        }
        var allat = arrat.join(' ');
        var inspos = html.indexOf(' ');
        var pre = html.substring(0, inspos);
        var post = html.substring(inspos);
        html = pre + ' ' + allat + ' ' + post;
    }

    template.innerHTML = html;

    var fc = template.content.firstChild;
    return fc;
}

// allow for using templated controls
function updateTemplates() {

    var templates = document.querySelectorAll("template");
    templates.forEach(c => {
        var template = c.innerHTML;
        var tag = template.split(/[\{\}]/)[1];
        var components = document.querySelectorAll(tag);
        components.forEach(t => {
            var content = t.innerHTML;
            var newHtml = template.replace("{" + tag + "}", content);
            var newElement = htmlToElement(newHtml, t.attributes);
            t.parentElement.replaceChild(newElement, t);
        });
    });


}




function GetData() {
    const dataUrl = "data/doc.json?v=2";
    GetAsync(dataUrl, function (data) {

        // fix DOM before processing any data
        updateTemplates();

        // get data from Json file
        const d = JSON.parse(data);

        // prepare the model
        var model = new ViewModel();

        // extract defined keys for the model
        var jsonKeys = Object.keys(d);

        // define and initialize each key ...
        jsonKeys.forEach(k => {

            if (typeof d[k] == 'string') {
                model[k] = ko.observable(d[k]); // .. as ko Observable 
            }
            else if (Array.isArray(d[k])) {
                model[k] = ko.observableArray(d[k]); // .. as ko Observable Array
            }
            else {
                model[k] = ko.observable(d[k]); // .. as ko Observable 
            }
        });

        // apply bindings
        ko.applyBindings(model);



    });
}

GetData();



