/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7777777777777778, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "02_01_Open_URL"], "isController": true}, {"data": [1.0, 500, 1500, "02_03_Enter_Credentials-0"], "isController": false}, {"data": [1.0, 500, 1500, "02_10_Confirm_Payment"], "isController": true}, {"data": [1.0, 500, 1500, "02_03_Enter_Credentials-1"], "isController": false}, {"data": [1.0, 500, 1500, "02_05_Click_ProductID"], "isController": true}, {"data": [0.5, 500, 1500, "02_03_Enter_Credentials_SignIn"], "isController": true}, {"data": [0.0, 500, 1500, "01_01_Open_URL"], "isController": true}, {"data": [1.0, 500, 1500, "02_02_Click_SignIn"], "isController": true}, {"data": [0.5, 500, 1500, "02_04_Click_Category"], "isController": true}, {"data": [1.0, 500, 1500, "01_02_Click_Search"], "isController": true}, {"data": [0.5, 500, 1500, "02_03_Enter_Credentials"], "isController": false}, {"data": [1.0, 500, 1500, "02_03_SignIn"], "isController": false}, {"data": [1.0, 500, 1500, "02_06_Click_ItemID"], "isController": true}, {"data": [1.0, 500, 1500, "02_07_Click_Addto_Cart"], "isController": true}, {"data": [1.0, 500, 1500, "02_09_Add_Details_Form"], "isController": true}, {"data": [1.0, 500, 1500, "02_08_Proceed_to_Checkout"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15, 0, 0.0, 668.9333333333333, 230, 2360, 446.0, 1936.4000000000003, 2360.0, 2360.0, 0.39807860725564603, 1.7580768490751308, 0.30187627716886495], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["02_01_Open_URL", 2, 0, 0.0, 2360.0, 2360, 2360, 2360.0, 2360.0, 2360.0, 2360.0, 0.8, 4.425, 0.41015625], "isController": true}, {"data": ["02_03_Enter_Credentials-0", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.5104758522727273, 2.1284623579545454], "isController": false}, {"data": ["02_10_Confirm_Payment", 2, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 0.3637686431429611, 1.9112063477628227, 0.22060578846853401], "isController": true}, {"data": ["02_03_Enter_Credentials-1", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 10.73384081196581, 1.4606704059829059], "isController": false}, {"data": ["02_05_Click_ProductID", 2, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 0.3614675582866438, 1.5027025347912524, 0.23403612416410627], "isController": true}, {"data": ["02_03_Enter_Credentials_SignIn", 1, 0, 0.0, 1357.0, 1357, 1357, 1357.0, 1357.0, 1357.0, 1357.0, 0.7369196757553427, 7.569258935151068, 1.6343208824613118], "isController": true}, {"data": ["01_01_Open_URL", 2, 0, 0.0, 1654.0, 1654, 1654, 1654.0, 1654.0, 1654.0, 1654.0, 1.1148272017837235, 6.166387959866221, 0.5715666806020067], "isController": true}, {"data": ["02_02_Click_SignIn", 2, 0, 0.0, 406.0, 406, 406, 406.0, 406.0, 406.0, 406.0, 4.88997555012225, 19.5455761002445, 2.9225244498777507], "isController": true}, {"data": ["02_04_Click_Category", 2, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 3.937007874015748, 14.606145423228346, 2.4221825787401574], "isController": true}, {"data": ["01_02_Click_Search", 2, 0, 0.0, 230.0, 230, 230, 230.0, 230.0, 230.0, 230.0, 0.3777861730260672, 1.5056107149603326, 0.34052406025689463], "isController": true}, {"data": ["02_03_Enter_Credentials", 1, 0, 0.0, 911.0, 911, 911, 911.0, 911.0, 911.0, 911.0, 1.0976948408342482, 5.760753979143797, 1.7783942782656421], "isController": false}, {"data": ["02_03_SignIn", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 11.263312780269057, 1.3400364349775784], "isController": false}, {"data": ["02_06_Click_ItemID", 2, 0, 0.0, 436.0, 436, 436, 436.0, 436.0, 436.0, 436.0, 0.3618599601954044, 1.397966799348652, 0.23181653700018093], "isController": true}, {"data": ["02_07_Click_Addto_Cart", 2, 0, 0.0, 408.0, 408, 408, 408.0, 408.0, 408.0, 408.0, 4.88997555012225, 22.950412591687044, 3.1278652200489], "isController": true}, {"data": ["02_09_Add_Details_Form", 2, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 0.36683785766691124, 1.6779966067498167, 0.4528154805575936], "isController": true}, {"data": ["02_08_Proceed_to_Checkout", 2, 0, 0.0, 467.0, 467, 467, 467.0, 467.0, 467.0, 467.0, 0.361271676300578, 1.9615923049132948, 0.2272060151734104], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
