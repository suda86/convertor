let storage = JSON.parse(localStorage.getItem('currencyconvertor'));
let time = new Date().getTime();

function getRates(callback) {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      callback(JSON.parse(this.responseText));
    }
  };
  xhttp.open('GET', 'http://www.apilayer.net/api/live?access_key=14b793e6c2439b574e2f1a322dc9fa0c&format=1&currencies=EUR,RSD', true);
  xhttp.send();
}

(function() {
  if(storage  && time < (storage.time + 43200000)) {
    fill(storage);
  } else if(storage) {
    getRates(function(res) {
      storage = {
        time: res.timestamp * 1000,
        state: {
          exchange: {
            EURRSD: (res.quotes.USDRSD / res.quotes.USDEUR).toFixed(4),
            RSDEUR: (1 / (res.quotes.USDRSD / res.quotes.USDEUR)).toFixed(4),
            USDRSD: res.quotes.USDRSD,
            RSDUSD: 1 / res.quotes.USDRSD,
            EURUSD: 1 / res.quotes.USDEUR,
            USDEUR: res.quotes.USDEUR
          },
          currency: ['EUR', 'RSD', 'USD'],
          first: storage.state.first,
          second: storage.state.second,
          firstInput: storage.state.firstInput,
          secondInput: (res.quotes.USDRSD / res.quotes.USDEUR).toFixed(2),
          errorFirst: '',
          errorSecond: ''
        }
      };
      fill(storage);
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    });
  } else {
    getRates(function(res) {
      storage = {
        time: res.timestamp * 1000,
        state: {
          exchange: {
            EURRSD: (res.quotes.USDRSD / res.quotes.USDEUR).toFixed(4),
            RSDEUR: (1 / (res.quotes.USDRSD / res.quotes.USDEUR)).toFixed(4),
            USDRSD: res.quotes.USDRSD,
            RSDUSD: 1 / res.quotes.USDRSD,
            EURUSD: 1 / res.quotes.USDEUR,
            USDEUR: res.quotes.USDEUR
          },
          currency: ['EUR', 'RSD', 'USD'],
          first: 'EUR',
          second: 'RSD',
          firstInput: 1,
          secondInput: (res.quotes.USDRSD / res.quotes.USDEUR).toFixed(2),
          errorFirst: '',
          errorSecond: ''
        }
      };
      fill(storage);
      localStorage.setItem('currencyconvertor', JSON.stringify(storage));
    })
  };
})();

function fill(data) {
  document.getElementById('firstInput').value =  data.state.firstInput;
  document.getElementById('secondInput').value =  data.state.secondInput;
  document.getElementById('secondSelect').value =  data.state.second;
  document.getElementById('firstSelect').value =  data.state.first;
  document.getElementById('errorFirst').innerHTML = data.state.errorFirst;
  document.getElementById('errorSecond').innerHTML = data.state.errorSecond;
  let options = document.getElementsByTagName('option');
  for(let i = 0; i < options.length; i++) {
    options[i].disabled = false;
  }
  document.getElementById('F' + data.state.second).disabled = true;
  document.getElementById('S' + data.state.first).disabled = true;
  if(data.state.errorFirst === 'Please enter a number') {
    document.getElementById('firstInput').style.color = 'red';
  } else {
    document.getElementById('firstInput').style.color = 'black';
  }
  if(data.state.errorSecond === 'Please enter a number') {
    document.getElementById('secondInput').style.color = 'red';
  } else {
    document.getElementById('secondInput').style.color = 'black';
  }
}

function editFirstInput(val) {
  if(val === '') {
    storage.state.firstInput = 1;
    storage.state.secondInput = (1 * storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
    storage.state.errorFirst = '';
    storage.state.errorSecond = '';
    fill(storage);
    saveInStorage(storage);
  } else {
    let num = Number(val);
    if(isNaN(num)) {
      storage.state.firstInput = val;
      storage.state.secondInput = (1 * storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
      storage.state.errorFirst = 'Please enter a number';
      storage.state.errorSecond = '';
      fill(storage);
      saveInStorage(storage);
    } else {
      storage.state.firstInput = Number(val);
      storage.state.secondInput = (storage.state.firstInput * storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
      storage.state.errorFirst = '';
      storage.state.errorSecond = '';
      fill(storage);
      saveInStorage(storage);
    }
  }
}

function editSecondInput(val) {
  if(val === '') {
    storage.state.secondInput = 1;
    storage.state.firstInput = (1 / storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
    storage.state.errorSecond = '';
    storage.state.errorFirst = '';
    fill(storage);
    saveInStorage(storage);
  } else {
    let num = Number(val);
    if(isNaN(num)) {
      storage.state.secondInput = val;
      storage.state.firstInput = (1 / storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
      storage.state.errorSecond = 'Please enter a number';
      storage.state.errorFirst = '';
      fill(storage);
      saveInStorage(storage);
    } else {
      storage.state.secondInput = Number(val);
      storage.state.firstInput = (storage.state.secondInput / storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
      storage.state.errorSecond = '';
      storage.state.errorFirst = '';
      fill(storage);
      saveInStorage(storage);
    }
  }
}

function onFirstSelectChange(val) {
  storage.state.first = val;
  if(isNaN(storage.state.firstInput)) {
    storage.state.secondInput = (1 * storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
    fill(storage);
    saveInStorage(storage);
  } else {
    storage.state.errorSecond = '';
    storage.state.errorFirst = '';
    storage.state.secondInput = (storage.state.firstInput * storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
    fill(storage);
    saveInStorage(storage);
  }
}

function onSecondSelectChange(val) {
  storage.state.second = val;
  if(isNaN(storage.state.secondInput)) {
    storage.state.firstInput = (1 / storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
    fill(storage);
    saveInStorage(storage);
  } else {
    storage.state.errorSecond = '';
    storage.state.errorFirst = '';
    storage.state.firstInput = (storage.state.secondInput / storage.state.exchange[storage.state.first + storage.state.second]).toFixed(2);
    fill(storage);
    saveInStorage(storage);
  }
}

function onResetClick() {
  storage.state.first = 'EUR';
  storage.state.second = 'RSD';
  storage.state.errorSecond = '';
  storage.state.errorFirst = '';
  storage.state.firstInput = 1;
  storage.state.secondInput = (Number(storage.state.exchange.EURRSD)).toFixed(2);
  fill(storage);
  saveInStorage(storage);
}

function onSwapClick() {
  let first = storage.state.first;
  let second = storage.state.second;
  let secondInput = storage.state.secondInput;
  let firstInput = storage.state.firstInput;
  let errorFirst = storage.state.errorFirst;
  let errorSecond = storage.state.errorSecond;
  storage.state.first = second;
  storage.state.second = first;
  storage.state.secondInput = firstInput;
  storage.state.firstInput = secondInput;
  storage.state.errorFirst = errorSecond;
  storage.state.errorSecond = errorFirst;
  fill(storage);
  saveInStorage(storage);
}

function saveInStorage(storage) {
  localStorage.setItem('currencyconvertor', JSON.stringify(storage));
}
