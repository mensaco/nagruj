function ViewModel() {
    var self = this;
    self.pageTitle = ko.observable();
    self.services = ko.observableArray([]);
    self.address = ko.observable();
    self.phone = ko.observable();
    self.fax = ko.observable();
    self.openingHours = ko.observable();

}

function GetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function updateTemplates(){

    var templates = document.querySelectorAll("template");
    templates.forEach(c => {        
        var template = c.innerHTML;
        var tag = template.split(/[\{\}]/)[1];
        var components = document.querySelectorAll(tag);
         components.forEach(t => {
            var content = t.innerHTML;
            var newHtml = template.replace("{"+tag+"}", content);
            var newElement = htmlToElement(newHtml);
            t.parentElement.replaceChild(newElement, t);
        });
    });
    

}


function GetData(){
    const dataUrl = "https://raw.githubusercontent.com/mensaco/nagruj/main/data/doc.json?v=2";
    GetAsync(dataUrl, function(data){

        updateTemplates();

        const d = JSON.parse(data);

        var model = new ViewModel();

        
        // apply bindings
        ko.applyBindings(model);

        // initialize values 
        model.pageTitle(d["PageTitle"]);
        model.services(d["Services"]);
        model.address(d["Address"]);
        model.phone(d["Phone"]);
        model.fax(d["Fax"]);
        model.openingHours(d["OpeningHours"]);

    });
}

GetData();



