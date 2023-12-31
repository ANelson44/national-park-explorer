// API key: IIMr3waPpdOKznPvpyy5r3tNLTtNxOJ0KtZk3Xef
// API URL: https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${apiKey}


// JavaScript for search button and autocomplete function
var availableStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT',
  'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KT', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN',
  'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR',
  'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
  'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

var resultsBox = document.querySelector('.result-box');
var inputBox = document.getElementById('state');


function display(result){
  var content = result.map((list)=>{
      return '<li onclick=selectInput(this)>' + list + '</li>';
  });

  resultsBox.innerHTML = '<ul>' + content.join('') + '</ul>';
}

function selectInput(list) {
  inputBox.value = list.innerHTML;
  resultsBox.innerHTML = '';
}

function submitState() {
  const stateCode = document.getElementById('state').value;
  localStorage.setItem('selectedState', stateCode);
  window.location.href = 'results.html';
}


let cardHtml = '';

function displayNationalParks() {
  const stateCode = localStorage.getItem('selectedState');
  const parksContainer = document.getElementById('parkCard');

  var apiKey = 'IIMr3waPpdOKznPvpyy5r3tNLTtNxOJ0KtZk3Xef';
  var npsUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${stateCode}&api_key=${apiKey}`;

  fetch(npsUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (apple) {
      console.log('API Data:', apple);
      const parks = apple.data;

      parks.forEach((park, index) => {
        const parkName = park.fullName;
        const parkState = park.states;
        const parkDescription = park.description;
        const thingsToDo = park.activities.map((activity) => activity.name).join(', ');
        const imageUrl = park.images.length > 0 ? park.images[0].url : 'default_image_url.jpg';
        const vistorCenter = park.url;

        cardHtml += `
          <div class="card max-w-sm rounded overflow-auto h-fit shadow-lg m-4">
            <img class="w-full" src="${imageUrl}" alt="${parkName}"> 
            <div class="px-6 py-4 bg-slate-50">
              <div class="font-bold text-xl mb-2"> ${parkName}</div>
              <div class="font-bold text-l mb-2">State: ${parkState}</div>
              <h3 class="font-bold"> Description </h3>
              <div class="text-l mb-2"> ${parkDescription}</div>
              <h3 class="font-bold"> Things To Do </h3>
              <div class=" text-l mb-2"> ${thingsToDo}</div>
              <div class="flex flex-wrap justify-between font-bold text-1 mb-2 ">
                <a href="#" data-index="${index}" class="show-map-link"><i class="animate-pulse w-6 h-6 fa-solid fa-map-location fa-lg mt-2"></i> Map View</a>
                <a href="${vistorCenter}" class="underline">Go to Visitor Center!</a>
              </div>
            </div>
          </div>
        `;
      });

      document.getElementById('parkCard').innerHTML = cardHtml;

      console.log('Park Name: ', cardHtml);
      $('#parkList').html(cardHtml);

      // event listener for "show map" button
      document.querySelectorAll('.show-map-link').forEach(link => {
        link.addEventListener('click', function(event) {
          event.preventDefault();
          showMap(parseInt(this.dataset.index, 10));
        });
      });
    });
}

// map function
function showMap(parkIndex) {
  const parkCode = localStorage.getItem('selectedState');
  const apiKey = 'IIMr3waPpdOKznPvpyy5r3tNLTtNxOJ0KtZk3Xef';
  const npsUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${parkCode}&api_key=${apiKey}`;

  fetch(npsUrl)
    .then(response => response.json())
    .then(apple => {
      const nParks = apple.data;
      const park = nParks[parkIndex];

      // url with park location
      const mapPageUrl = `map.html?name=${encodeURIComponent(park.fullName)}&lat=${park.latitude}&lng=${park.longitude}`;

      // go to map page
      window.location.href = mapPageUrl;
    })
    .catch(error => console.error('Error fetching park data:', error));
}

if (window.location.pathname.includes('results.html')) {
  displayNationalParks();
}
inputBox.onkeyup = function () {
  var result = [];
  var input = inputBox.value;
  if (input.length) {
      result = availableStates.filter((states) => {
         return states.toLowerCase().includes(input.toLowerCase());
      });
      console.log(result);
  }
  display(result);

  if(!result.length){
      resultsBox.innerHTML = '';
 }
}