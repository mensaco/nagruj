function ViewModel() {
    var self = this;
    self.pageTitle = ko.observable();
    self.address = ko.observable();
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


function GetData(){
    const dataUrl = "https://raw.githubusercontent.com/mensaco/nagruj/main/data/doc.json?v=1";
    GetAsync(dataUrl, function(data){

        const d = JSON.parse(data);

        var model = new ViewModel();
        
        // apply bindings
        ko.applyBindings(model);

        // initialize values 
        model.pageTitle(d["PageTitle"]);
        model.address(d["Address"]);
        model.openingHours(d["OpeningHours"]);

    });
}

GetData();



