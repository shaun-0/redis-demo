const fetchDataButton = document.querySelector('.fetch-data');
const dataSnippet = document.getElementById('data-snippet');
const preLoad = document.querySelector('.pre-load');
const heading = document.querySelector('#heading');
const responseTime = document.querySelector('#response-time');
const loader = document.querySelector('.loader');
const getData = async (endpoint) => {
  loader.style.display='block'
  fetchDataButton.style.display = 'none'
  preLoad.style.display = 'none'
  //get data from server
  const startTime = performance.now();
  const response = await fetch(`/${endpoint}`);
  const data = await response.json();
  const endTime = performance.now();
  const timeTaken = endTime - startTime;
  const cacheHit = data.cacheHit;
  dataSnippet.textContent = JSON.stringify(data.data, null, 2);
  Prism.highlightAll();
  const headingText = endpoint.charAt(0).toUpperCase() + endpoint.slice(1) + " Data";
  let responseText = "Took " + timeTaken + " milliseconds"+ " ( "+(cacheHit ? "Cache Hit" : "Cache Miss") + " )";
  if(cacheHit) {
    responseText += " Expires in "+data.ttl+"s";
  }
  heading.textContent = headingText;
  responseTime.textContent = responseText;
  // Display data
  loader.style.display='none';
  preLoad.style.display = 'none'
  fetchDataButton.style.display = 'block'
};
