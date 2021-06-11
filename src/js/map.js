(() => {
  const locations = [
    {
      latlng: [59.94032991593905, 30.328897621133017],
      title: 'Спас на крови'
    },
    {
      latlng: [59.94376915620641, 30.33173003388902],
      title: 'Марсово поле'
    },
    {
      latlng: [59.946176412102716, 30.334197666218685],
      title: 'Летний сад'
    },
    {
      latlng: [59.94745519569332, 30.3390900155344],
      title: 'Мозаичный дворик'
    },
    {
      latlng: [59.93777443878667, 30.308543156999104],
      title: 'Адмиралтейство'
    },
    {
      latlng: [59.934664944073674, 30.305583993506616],
      title: 'Исакиевский собор'
    },
    {
      latlng: [59.94142591501522, 30.289074026718048],
      title: 'ул. Репина'
    },
    {
      latlng: [59.92630578599389, 30.34233177608411],
      title: 'Пять углов'
    },
    {
      latlng: [59.92955835175646, 30.289999981132052],
      title: 'Новая голандия'
    },
    {
      latlng: [59.9209825900619, 30.299119183498004],
      title: 'Семимостье'
    },
    {
      latlng: [59.92946174595111, 30.344072348587087],
      title: 'Рубинштейна'
    },
    {
      latlng: [59.91971355324377, 30.312962341170334],
      title: 'Петербургский ангел'
    },
    {
      latlng: [59.91757962751312, 30.302370695135707],
      title: 'Человек невидимка'
    },
    {
      latlng: [59.92896305552794, 30.321819596712853],
      title: 'Гороховая'
    },
    {
      latlng: [59.92916063990147, 30.358616681644797],
      title: 'Улица Джона Ленона'
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
      n.marker.addListener('click', function() {
        let currentLat = n.marker.position.lat();
        let currentLng = n.marker.position.lng();

        locations.forEach(($marker, index) => {
          if(currentLat === $marker.latlng[0] && currentLng === $marker.latlng[1] ) {
            currentMarker = locations[index].id;
          }
        });
      });
    });
  }

  function onMarkerClick() {
    locations.forEach(n => n.marker.setIcon(n.marker !== this ? n.iconDefault : n.iconActive));
  }

  google.maps.event.addDomListener(window, 'load', init);

  })();
