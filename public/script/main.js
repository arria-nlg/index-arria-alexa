function getCurrency() {
	var select = document.getElementById('currency-select');
	return select.options[select.selectedIndex].text;
}

function getData(currency) {
	fetch('api/data/' + currency)
	.then(function(response) {
		return response.json();
	}).then(function (data) {

		addTable(data);
	});
}

function getAnalysis(currency) {
	fetch('api/analysis/' + currency)
	.then(function(response) {
		return response.json();
	}).then(function (data) {
		addTable(data);
	});
}

function getVisualization(currency) {
	fetch('api/analysis/' + currency)
	.then(function(response) {
		return response.json();
	}).then(function (data) {
		addTable(data);
		return data;
	}).then(function (data) {
		addChart(data.comparisons);
	});
}

function getNarrative(currency) {	
	fetch('api/narrative/' + currency)
	.then(function(response) {
		return response.text();
	}).then(function (narrative) {
		console.log(narrative);
		var textContent = document.getElementById('narrative');
		textContent.innerHTML = narrative;
	});

	getVisualization(currency);
}

function addTable(tableData) {
    
    console.log('adding table');

    var tableContent = document.getElementById('table-content');
    while (tableContent.firstChild) {
        tableContent.removeChild(tableContent.firstChild);
    }

    for(comparisonId in tableData.comparisons){
        var comparison = tableData.comparisons[comparisonId];
        addRow(tableContent, comparison.currency, comparison.yesterday, comparison.today, comparison.change, comparison.changePercentage);
    }    
    
    document.getElementById('data-table').style.display= "table";
}

function addRow(table, code, yesterday, today, variance, percentage) {
    var row = document.createElement("tr");
    addCell(row, code);
    addCell(row, yesterday.toFixed(4));
    addCell(row, today.toFixed(4));
 	if(variance){
 		addCell(row, variance.toFixed(4));
	}
	if(percentage){
 		addCell(row, percentage.toFixed(4));
	}	   	   
    table.appendChild(row);
}

function addCell(row, content) {
    var cell = document.createElement("td");
    cell.innerText = content;
    row.appendChild(cell);
}

//Chart added used chart.js (http://www.chartjs.org/)
function addChart(comparisons) {
	var ctx = document.getElementById('myChart').getContext('2d');
	var chart = new Chart(ctx, {
	    type: 'horizontalBar',

	    data: {
	        labels: comparisons.map(c => c.currency),
	        datasets: [{
	            backgroundColor: comparisons.map(c => c.change > 0 ? 'rgb(0, 200, 0)' : 'rgb(200, 0, 0)'),
	            data: comparisons.map(c => c.change),
	        }]
	    },

	    options: {
      		legend: { display: false }
  		}
	});
}