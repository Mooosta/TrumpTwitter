//Made by Alex from DECO3100 Wk11 Tutorial

function make_plot(tweet_data, tsne_data) {
  let data = [{
    //Extract x & y-location from TSNE dataset  
    x: tsne_data.map(d => d.x),
    y: tsne_data.map(d => d.y), 
    mode: 'markers',
    type: 'scatter',
    customdata: tweet_data.map(d => d.text),
    //Hover tooltips
    hovertemplate:
      "%{customdata}" +
      "<extra></extra>",
    marker: {
      size: 4,
      colorscale: 'Jet', //Cluster Colour scheme (Default is for continuous data)
      color: tsne_data.map(d => d.cluster_id), //Colour the same cluster
    }
  }];

  let layout = {
    hovermode: "closest", //Hover shows closest point's info
    //Axis Display off
    xaxis: {
      visible: false,
    },
    yaxis: {
      visible: false,
    }
  }

//Plot the chart 
  Plotly.newPlot('plotDiv', data, layout);
}

//Data Import - Both Trump & 2D TSNE dataset w/ colour  
Plotly.d3.csv("data/trump_presidential_tweets.csv", (tweets) => {
  Plotly.d3.csv("data/tsne_and_cluster/tsne_data_trump.csv", (tnse_data) => {
    make_plot(tweets, tnse_data)
  });
});

