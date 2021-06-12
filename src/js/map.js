(() => {
  const locations = [
    {
      latlng: [59.94032991593905, 30.328897621133017],
      title: 'Спас на крови',
      img: '/img/baloons/1.jpg'
    },
    {
      latlng: [59.94376915620641, 30.33173003388902],
      title: 'Марсово поле',
      img: '/img/baloons/2.jpg'
    },
    {
      latlng: [59.946176412102716, 30.334197666218685],
      title: 'Летний сад',
      img: '/img/baloons/3.jpg'
    },
    {
      latlng: [59.94745519569332, 30.3390900155344],
      title: 'Мозаичный дворик',
      img: '/img/baloons/4.jpg'
    },
    {
      latlng: [59.93777443878667, 30.308543156999104],
      title: 'Адмиралтейство',
      img: '/img/baloons/5.jpg'
    },
    {
      latlng: [59.934664944073674, 30.305583993506616],
      title: 'Исакиевский собор',
      img: '/img/baloons/6.jpeg'
    },
    {
      latlng: [59.94142591501522, 30.289074026718048],
      title: 'ул. Репина',
      img: '/img/baloons/7.jpg'
    },
    {
      latlng: [59.92630578599389, 30.34233177608411],
      title: 'Пять углов',
      img: '/img/baloons/8.jpg'
    },
    {
      latlng: [59.92955835175646, 30.289999981132052],
      title: 'Новая голандия',
      img: '/img/baloons/9.jpg'
    },
    {
      latlng: [59.9209825900619, 30.299119183498004],
      title: 'Семимостье',
      img: '/img/baloons/10.jpg'
    },
    {
      latlng: [59.92946174595111, 30.344072348587087],
      title: 'Рубинштейна',
      img: '/img/baloons/11.jpg'
    },
    {
      latlng: [59.91971355324377, 30.312962341170334],
      title: 'Петербургский ангел',
      img: '/img/baloons/12.jpg'
    },
    {
      latlng: [59.91757962751312, 30.302370695135707],
      title: 'Человек невидимка',
      img: '/img/baloons/13.jpg'
    },
    {
      latlng: [59.92896305552794, 30.321819596712853],
      title: 'Гороховая',
      img: '/img/baloons/14.jpg'
    },
    {
      latlng: [59.92916063990147, 30.358616681644797],
      title: 'Улица Джона Ленона',
      img: '/img/baloons/15.jpg'
    },
  ];

  let mapCenter = new google.maps.LatLng(59.932356209573584, 30.324739727050098);
  let mapZoom = 14;


  function init() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: mapZoom,
      center: mapCenter,
      disableDefaultUI: true,
    });

    locations.forEach(n => {
      n.marker = new google.maps.Marker({
        position: new google.maps.LatLng(...n.latlng),
        map: map,
      });

      let contentString = `
      <div class="map__baloon">
        <img class="map__baloon-img" src="${n.img}" alt="${n.title}">
        <p class="map__baloon-text">${n.title}</p>
      </div>`

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      n.marker.addListener("click", () => {
        infowindow.open(map, n.marker);
      });
    });
  }

  function onMarkerClick() {
    locations.forEach(n => n.marker.setIcon(n.marker !== this ? n.iconDefault : n.iconActive));
  }

  google.maps.event.addDomListener(window, 'load', init);

  })();
