// preparing function for populating data
function loadMetadata(sample){
    d3.json("samples.json").then((data) =>{
        var mData= data.metadata;
        sampleID=mData.filter(sample_object=>sample_object.id==sample);
        selection=sampleID[0]
        var panel= d3.select("#sample-metadata");
        panel.html("");
        Object.entries(selection).forEach(([key,value])=>{
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
}

// creating function for updating charts based on specified sample id
function updateChart(sample){
    d3.json("samples.json").then((data) => {
    samples=data.samples;
    sampleFilter=samples.filter(sample_object=>sample_object.id==sample)
    sample=sampleFilter[0]
        
    //  creating bar trace
    var barTrace = {
    x: sample.sample_values.slice(0,10).reverse(),
    text: sample.otu_labels.slice(0,10).reverse(),
    y: sample.otu_ids.slice(0,10).map(otu_id=>`OTU ${otu_id}`).reverse(),
    type: "bar",
    name: "Top 10 OTUs",
    orientation: "h"
    };

    var barData = [barTrace];

    // creating barchart layout
    var barLayout = {
        title: "Top 10 OTUs",
        xaxis: {title: "Values"},
        yaxis: {title: "ID"}
    };

    // plot the barchart to "bar" div tag
    Plotly.newPlot("bar", barData, barLayout);

    // creating bubble trace
    var bubbleTrace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
          color: sample.otu_ids,
          colorscale: 'Earth',
          size: sample.sample_values
        }
        
      };
      
    var bubbleData = [bubbleTrace];
      
    // creating bubble layout 
    var bubbleLayout = {
        title: 'Bubble Chart',
        showlegend: false,
        height: 660,
        width: 990,
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Values"}
    };
      
    // plot bubble chart to "bubble" div tag
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });    
}

// initialize dropdown and charts with specified sampleID
function init(){
    var dropDown=d3.select("#selDataset")
    d3.json("samples.json").then((data) =>{
    var sampleNames = data.names;
    sampleNames.forEach((sample)=>{
        dropDown
            .append("option")
            .text(sample)
            .property("value",sample);
    });
    var sampleOne=sampleNames[0]
    updateChart(sampleOne)
    loadMetadata(sampleOne)
    });
}

// update charts to correspond with changes in selected sample in dropdown
function optionChanged(sample){
    updateChart(sample);
    loadMetadata(sample);
}
init();





