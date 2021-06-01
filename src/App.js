import './App.css';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);


const App = () => {
  const [data, setData] = React.useState([]);
  const handleUpload = (e) => {
    e.preventDefault();
    var files = e.target.files, f = files[0];
    let jsonData = null;
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: 'binary' });
      jsonData = readedData.SheetNames.reduce((initial, name) => {
        const sheet = readedData.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      jsonData = jsonData["" + Object.keys(jsonData)[0]];
      let res = jsonData.reduce((ac, a) => {
        let ind = ac.findIndex(x => x['Product Name;'] === a['Product Name;']);
        ind === -1 ? ac.push(a) : ac[ind]['Number Of Bugs'] += a[['Number Of Bugs']];
        return ac;
      }, [])
      setData(res)

    };
    reader.readAsBinaryString(f)
  };

  function handleClick(event) {
    const { target = {} } = event || {};
    target.value = "";
  }
  const LatestCampaignChart = React.useRef(null);


  var latestCampaignChart;

  React.useLayoutEffect(() => {
    latestCampaignChart = am4core.create("latestCampaignChart", am4charts.PieChart);
    var pieSeries = latestCampaignChart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Number Of Bugs";
    pieSeries.dataFields.category = "Product Name;";
    LatestCampaignChart.current = latestCampaignChart;
    return () => {
      latestCampaignChart.dispose();
    };
  }, []);
  React.useLayoutEffect(() => {

    if (LatestCampaignChart.current) {
      LatestCampaignChart.current.data = data
    }
  }, [LatestCampaignChart.current]);

//   var [date, setDate] = useState(new Date());

//   useEffect(() => {
//     var timer = setInterval(() => setDate(new Date()), 1000)
//     return function cleanup() {
//       clearInterval(timer)
//     }
//  });

  return (
    <>
      <div className="header">
        <p className="logo">Chart Editor</p>
        <div class="header-right">
          <input type="file" accept=".xlsx" onClick={handleClick} onChange={handleUpload} id="uploadCSV" title="Upload CSV"
          />
        </div>
      </div>

      <div id="latestCampaignChart" style={{
        height: '300px',
      }} />
      <div className="footer">
        {/* <p><b>Time :</b> {date.toLocaleTimeString()}                   <b>Date :</b>  {date.toLocaleDateString()}</p> */}
     This website is designed by Yogesh Gupta
      </div>


    </>

  )
}

export default App;