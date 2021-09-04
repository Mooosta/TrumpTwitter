//User Input
    //var search_word = document.getElementById('text1').Value;
    document.getElementById("btn1").addEventListener("click", myFunction);

//Update the search 
function myFunction() {
  document.getElementById("btn1").innerHTML = "Generating";
  search_word = document.getElementById('text1').value;
  Plotly.newPlot('plotDiv', data, layout);
}


  //t-SNE Cluster| Based on code from DECO3100 Wk11 Tutorial by Alex | Link: https://youtu.be/H3ZI9sNbG5E
  function combine_and_filter(trump_tweets,  tsne_data_trump,) {
    //Modern Way: add tsne data to trump tweets
      //Copy TSNE's x, y & cluster id data into tweet data 
    trump_tweets = trump_tweets.map((trump_tweet, index) => Object.assign(trump_tweet, tsne_data_trump[index]))
  
    //add an author property
    for(let tweet of trump_tweets){
      tweet.author = "Trump"
    }
    
    //Spread Syntax: tweets into one array
    let tweets = [...trump_tweets];
  
    //Filters
    tweets = tweets.filter(tweet => tweet.text.includes(search_word)) //Word Inclusion 
  
  
    return tweets;
  }
  
  function make_plot(tweets){
    let data = [{
      //Mapping our required variable | Mapping can be used for substitute 
      x: tweets.map(d => d.x),
      y: tweets.map(d => d.y),
      //Tooltip: string concatenation w/ author + tweet
        //convertToParagraph: self-defined function to style long string within the box  
      customdata: tweets.map(d => convertToParagraph(d.author + ": " + d.text, 64)),
      marker: {
        //Sentiment Mapping Colour Code | Sourced from Margaux on DECO3100 Slack 11/06/2021
        color: tweets.map(d => d.sentiment < 0 ? 0 : d.sentiment > 0 ? 1 : 2),  //color 0 if neg, 1 if pos, 2 if 0
        size: 10,
        colorscale: [ //custom color scheme
          //['0', 'rgb(255,0,0)'], //Negative Sentiment Col,or 
          //['1', 'rgb(0,255,0)'], //Positive Sentiment Color 
          //['2', '#FF0000'], //Neutral Sentiment Color
        ]
      },
      mode: 'markers',
      type: 'scatter',
      hovertemplate:
        "%{customdata}" +
        "<extra></extra>", //hide extra tooltip info
    }];
  
    let layout = {
      hovermode: "closest", //hover closest by default
      xaxis: {
        visible: false,
      },
      yaxis: {
        visible: false,
      },
      width: 800,
      height: 500,
    }
  
    Plotly.newPlot('plotDiv', data, layout);
  }
   
  
  //Format Hover Label with long text | Sourced from: https://codereview.stackexchange.com/a/171857
  function convertToParagraph(sentence, maxLineLength){
    let lineLength = 0;
    sentence = sentence.split(" ")
    return sentence.reduce((result, word) => {
      if (lineLength + word.length >= maxLineLength) {
        lineLength = word.length;
        return result + `<br>${word}`;
      } else {
        lineLength += word.length + (result ? 1 : 0);
        return result ? result + ` ${word}` : `${word}`;
      }
    }, '');
  }
  
  //Load in all the data
  Plotly.d3.csv("Data/trump_presidential_tweets.csv", (trump_tweets) => {
      Plotly.d3.csv("Data/tsne_data_trump.csv", (tsne_data_trump) => {
          //Combine & Filter all data into one largearray (Can be pre-processed in Excel/Google Spreadsheet)
          let tweets = combine_and_filter(trump_tweets, tsne_data_trump)
          make_plot(tweets);
        });
  });



