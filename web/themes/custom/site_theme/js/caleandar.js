var Calendar = function (model, options, date) {
  // Default Values
  this.Options = {
    Color: '',
    LinkColor: '',
    NavShow: true,
    NavVertical: false,
    NavLocation: '',
    DateTimeShow: true,
    DateTimeFormat: 'mmm, yyyy',
    DatetimeLocation: '',
    EventClick: '',
    EventTargetWholeDay: false,
    DisabledDays: [],
    ModelChange: model
  };
  // Overwriting default values
  for (var key in options) {
    this.Options[key] = typeof options[key] == 'string' ? options[key].toLowerCase() : options[key];
  }

  model ? this.Model = model : this.Model = {};
  this.Today = new Date();

  this.Selected = this.Today
  this.Today.Month = this.Today.getMonth();
  this.Today.Year = this.Today.getFullYear();
  if (date) { this.Selected = date }
  this.Selected.Month = this.Selected.getMonth();
  this.Selected.Year = this.Selected.getFullYear();

  this.Selected.Days = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDate();
  this.Selected.FirstDay = new Date(this.Selected.Year, (this.Selected.Month), 1).getDay();
  this.Selected.LastDay = new Date(this.Selected.Year, (this.Selected.Month + 1), 0).getDay();

  this.Prev = new Date(this.Selected.Year, (this.Selected.Month - 1), 1);
  if (this.Selected.Month == 0) { this.Prev = new Date(this.Selected.Year - 1, 11, 1); }
  this.Prev.Days = new Date(this.Prev.getFullYear(), (this.Prev.getMonth() + 1), 0).getDate();
};

function createCalendar(calendar, element, adjuster) {
  if (typeof adjuster !== 'undefined') {
    var newDate = new Date(calendar.Selected.Year, calendar.Selected.Month + adjuster, 1);
    calendar = new Calendar(calendar.Model, calendar.Options, newDate);
    element.innerHTML = '';
  }
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function AddSidebar() {
    var sidebar = document.createElement('div');
    sidebar.classList.add('cld-sidebar');

    var monthList = document.createElement('ul');
    monthList.classList.add('cld-monthList');

    for (var i = 0; i < months.length - 3; i++) {
      var x = document.createElement('li');
      x.classList.add('cld-month');
      var n = i - (4 - calendar.Selected.Month);
      // Account for overflowing month values
      if (n < 0) {
        n += 12;
      }
      else if (n > 11) {
        n -= 12;
      }
      // Add Appropriate Class
      if (i == 0) {
        x.classList.add(' cld-rwd cld-nav');
        x.addEventListener('click', function () {
          typeof calendar.Options.ModelChange == 'function' ? calendar.Model = calendar.Options.ModelChange() : calendar.Model = calendar.Options.ModelChange;
          createCalendar(calendar, element, -1);
        });
        x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,75 100,75 50,0"></polyline></svg>';
      }
      else if (i == months.length - 4) {
        x.classList.add('cld-nav');
        x.classList.add('cld-fwd');
        x.addEventListener('click', function () {
          typeof calendar.Options.ModelChange == 'function' ? calendar.Model = calendar.Options.ModelChange() : calendar.Model = calendar.Options.ModelChange;
          createCalendar(calendar, element, 1);
        });
        x.innerHTML += '<svg height="15" width="15" viewBox="0 0 100 75" fill="rgba(255,255,255,0.5)"><polyline points="0,0 100,0 50,75"></polyline></svg>';
      }
      else {
        if (i < 4) {
          x.classList.add('cld-pre');
        }
        else if (i > 4) {
          x.classList.add('cld-post');
        }
        else {
          x.classList.add('cld-curr');
        }

        //prevent losing var adj value (for whatever reason that is happening)
        (function () {
          var adj = (i - 4);
          x.addEventListener('click', function () {
            typeof calendar.Options.ModelChange == 'function' ? calendar.Model = calendar.Options.ModelChange() : calendar.Model = calendar.Options.ModelChange;
            createCalendar(calendar, element, adj);
          });
          x.setAttribute('style', 'opacity:' + (1 - Math.abs(adj) / 4));
          x.innerHTML += months[n].substr(0, 3);
        }()); // immediate invocation

        if (n == 0) {
          var y = document.createElement('li');
          y.classList.add('cld-year');
          if (i < 5) {
            y.innerHTML += calendar.Selected.Year;
          } else {
            y.innerHTML += calendar.Selected.Year + 1;
          }
          monthList.appendChild(y);
        }
      }
      monthList.appendChild(x);
    }
    sidebar.appendChild(monthList);
    if (calendar.Options.NavLocation) {
      document.getElementById(calendar.Options.NavLocation).innerHTML = "";
      document.getElementById(calendar.Options.NavLocation).appendChild(sidebar);
    }
    else { element.appendChild(sidebar); }
  }

  var mainSection = document.createElement('div');
  mainSection.classList.add("cld-main");
  mainSection.setAttribute('data-calendar-year', calendar.Selected.Year);
  mainSection.setAttribute('data-calendar-month', calendar.Selected.Month);

  function AddDateTime() {
    var datetime = document.createElement('div');
    datetime.classList.add("cld-datetime");
    if (calendar.Options.NavShow && !calendar.Options.NavVertical) {
      var rwd = document.createElement('button');
      rwd.classList.add("cld-nav");
      rwd.classList.add("cld-rwd");
      rwd.addEventListener('click', function () { createCalendar(calendar, element, -1); });
      var prevIcon = document.createElement('i');
      prevIcon.classList.add('fa-solid', 'fa-circle-chevron-left');
      prevIcon.setAttribute('aria-hidden', 'true');
      rwd.appendChild(prevIcon);
      datetime.appendChild(rwd);
    }
    var today = document.createElement('div');
    today.classList.add('today');
    today.innerHTML = months[calendar.Selected.Month] + ", " + calendar.Selected.Year;
    datetime.appendChild(today);
    if (calendar.Options.NavShow && !calendar.Options.NavVertical) {
      var fwd = document.createElement('button');
      fwd.classList.add("cld-nav");
      fwd.classList.add("cld-fwd");
      fwd.addEventListener('click', function () { createCalendar(calendar, element, 1); });
      var nextIcon = document.createElement('i');
      nextIcon.classList.add('fa-solid', 'fa-circle-chevron-right');
      nextIcon.setAttribute('aria-hidden', 'true');
      fwd.appendChild(nextIcon);
      datetime.appendChild(fwd);
    }
    if (calendar.Options.DatetimeLocation) {
      document.getElementById(calendar.Options.DatetimeLocation).innerHTML = "";
      document.getElementById(calendar.Options.DatetimeLocation).appendChild(datetime);
    }
    else { mainSection.appendChild(datetime); }
  }

  function AddLabels() {
    var labels = document.createElement('ul');
    labels.classList.add('cld-labels');
    var labelsList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (var i = 0; i < labelsList.length; i++) {
      var label = document.createElement('li');
      label.classList.add("cld-label");
      label.innerHTML = labelsList[i];
      labels.appendChild(label);
    }
    mainSection.appendChild(labels);
  }
  function AddDays() {
    // Create Number Element
    function DayNumber(n) {
      var number = document.createElement('p');
      number.classList.add("cld-number");
      var numberSpan = document.createElement('span');
      numberSpan.classList.add("cld-number-day");
      numberSpan.innerHTML = n;
      number.appendChild(numberSpan);
      return number;
    }
    var days = document.createElement('ul');
    days.classList.add("cld-days");
    // Previous Month's Days
    for (var i = 0; i < (calendar.Selected.FirstDay); i++) {
      var day = document.createElement('li');
      day.classList.add("cld-day");
      day.classList.add("prevMonth");
      //Disabled Days
      var d = i % 7;
      for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
        if (d == calendar.Options.DisabledDays[q]) {
          day.classList.add("disableDay");
        }
      }

      var number = DayNumber((calendar.Prev.Days - calendar.Selected.FirstDay) + (i + 1));
      day.appendChild(number);

      days.appendChild(day);
    }
    // Current Month's Days
    for (var i = 0; i < calendar.Selected.Days; i++) {
      var day = document.createElement('li');
      day.classList.add("cld-day");
      day.classList.add("currMonth");
      //Disabled Days
      var d = (i + calendar.Selected.FirstDay) % 7;
      for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
        if (d == calendar.Options.DisabledDays[q]) {
          day.classList.add("disableDay");
        }
      }
      var number = DayNumber(i + 1);
      let monthNum = calendar.Selected.Month + 1;
      if (monthNum < 10) {
        monthNum = '0' + monthNum;
      }
      let dayNum = i + 1;
      if (dayNum < 10) {
        dayNum = '0' + dayNum;
      }
      number.setAttribute('data-day-date', calendar.Selected.Year + '-' + monthNum + '-' + dayNum);
      // Check Date against Event Dates
      for (var n = 0; n < calendar.Model.length; n++) {
        var evDate = calendar.Model[n].Date;
        var toDate = new Date(calendar.Selected.Year, calendar.Selected.Month, (i + 1));

        if (evDate.getTime() == toDate.getTime()) {
          var evColour = calendar.Model[n].Colour;
          // Add style="--event-color: #hex;" to the number element
          if (evColour) {
            number.setAttribute('style', '--event-color: ' + evColour + ';');
          }
          number.setAttribute('tabindex', '0');
          number.classList.add("eventday");
          var appendToNumber = false;
          // Get an existing cld-title span from within the number element,
          // or create a new one if it doesn't exist.
          var title = number.querySelector('.cld-title');
          if (!title) {
            title = document.createElement('span');
            title.classList.add("cld-title");
            appendToNumber = true;
          }
          if (typeof calendar.Model[n].Link == 'function' || calendar.Options.EventClick) {
            title.classList.add("cld-clickable");
            var a = document.createElement('a');
            a.classList.add('d-block', 'event-title');
            a.setAttribute('href', '#');
            a.innerHTML += calendar.Model[n].Title;
            if (calendar.Options.EventClick) {
              var z = calendar.Model[n].Link;
              if (typeof calendar.Model[n].Link != 'string') {
                a.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)));
                if (calendar.Options.EventTargetWholeDay) {
                  day.classList.add("clickable");
                  day.addEventListener('click', calendar.Options.EventClick.bind.apply(calendar.Options.EventClick, [null].concat(z)));
                }
              } else {
                a.addEventListener('click', calendar.Options.EventClick.bind(null, z));
                if (calendar.Options.EventTargetWholeDay) {
                  day.classList.add("clickable");
                  day.addEventListener('click', calendar.Options.EventClick.bind(null, z));
                }
              }
            } else {
              a.addEventListener('click', calendar.Model[n].Link);
              if (calendar.Options.EventTargetWholeDay) {
                day.classList.add("clickable");
                day.addEventListener('click', calendar.Model[n].Link);
              }
            }
            title.appendChild(a);
          } else {
            if (typeof calendar.Model[n].Link !== 'undefined') {
              var title_content = document.createElement('a');
              title_content.classList.add('d-block', 'event-title');
              title_content.setAttribute('href', calendar.Model[n].Link);
              title_content.innerHTML = calendar.Model[n].Title;
            } else {
              var title_content = document.createElement('span');
              title_content.classList.add('d-block', 'event-title');
              title_content.innerHTML = calendar.Model[n].Title;
            }
            title.appendChild(title_content);
          }
          if (appendToNumber) {
            number.appendChild(title);
          }
        }
      }
      day.appendChild(number);
      // If Today..
      if ((i + 1) == calendar.Today.getDate() && calendar.Selected.Month == calendar.Today.Month && calendar.Selected.Year == calendar.Today.Year) {
        day.classList.add("today");
      }
      days.appendChild(day);
    }
    // Next Month's Days
    // Always same amount of days in calander
    var extraDays = 13;
    if (days.children.length > 35) { extraDays = 6; }
    else if (days.children.length < 29) { extraDays = 20; }

    for (var i = 0; i < (extraDays - calendar.Selected.LastDay); i++) {
      var day = document.createElement('li');
      day.classList.add("cld-day");
      day.classList.add("nextMonth");
      //Disabled Days
      var d = (i + calendar.Selected.LastDay + 1) % 7;
      for (var q = 0; q < calendar.Options.DisabledDays.length; q++) {
        if (d == calendar.Options.DisabledDays[q]) {
          day.classList.add("disableDay");
        }
      }

      var number = DayNumber(i + 1);
      day.appendChild(number);

      days.appendChild(day);
    }
    mainSection.appendChild(days);
  }
  if (calendar.Options.Color) {
    mainSection.innerHTML += '<style>.cld-main{color:' + calendar.Options.Color + ';}</style>';
  }
  if (calendar.Options.LinkColor) {
    mainSection.innerHTML += '<style>.cld-title a{color:' + calendar.Options.LinkColor + ';}</style>';
  }
  element.appendChild(mainSection);

  if (calendar.Options.NavShow && calendar.Options.NavVertical) {
    AddSidebar();
  }
  if (calendar.Options.DateTimeShow) {
    AddDateTime();
  }
  AddLabels();
  AddDays();
}

function caleandar(el, data, settings, date = null) {
  var obj = new Calendar(data, settings, date);
  createCalendar(obj, el);
}
