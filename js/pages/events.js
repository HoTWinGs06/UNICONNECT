// ============================================
// UniConnect — Campus Events Page
// ============================================

export function renderEvents() {
  return `
  <main class="max-w-5xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-stack-lg">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 class="font-headline-lg text-headline-lg text-on-background mb-1">Campus Events</h1>
        <p class="font-body-md text-body-md text-on-surface-variant">Discover workshops, seminars, and social events</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="inline-flex items-center gap-2 bg-surface-container text-on-surface-variant px-4 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors press-scale border border-outline-variant">
          <span class="material-symbols-outlined text-[18px]">calendar_today</span> Calendar View
        </button>
        <button class="inline-flex items-center gap-2 bg-secondary text-on-secondary px-4 py-2.5 rounded-lg font-label-md text-label-md hover:bg-secondary-container transition-colors shadow-sm press-scale">
          <span class="material-symbols-outlined text-[18px]">add</span> Create Event
        </button>
      </div>
    </div>

    <!-- Weekly Day Selector -->
    <div class="bg-surface rounded-xl border border-outline-variant shadow-sm p-4 mb-6">
      <div class="flex items-center justify-between mb-3">
        <button class="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 class="font-label-md text-label-md text-on-surface font-semibold">April 2024</h2>
        <button class="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
      <div class="grid grid-cols-7 gap-2" id="day-selector">
        <button class="day-btn flex flex-col items-center py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" data-day="mon">
          <span class="font-label-sm text-[10px] uppercase">Mon</span>
          <span class="font-label-md text-label-md font-semibold mt-1">8</span>
        </button>
        <button class="day-btn flex flex-col items-center py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" data-day="tue">
          <span class="font-label-sm text-[10px] uppercase">Tue</span>
          <span class="font-label-md text-label-md font-semibold mt-1">9</span>
        </button>
        <button class="day-btn flex flex-col items-center py-2 rounded-lg bg-secondary text-on-secondary" data-day="wed">
          <span class="font-label-sm text-[10px] uppercase">Wed</span>
          <span class="font-label-md text-label-md font-semibold mt-1">10</span>
          <span class="w-1.5 h-1.5 rounded-full bg-on-secondary mt-1"></span>
        </button>
        <button class="day-btn flex flex-col items-center py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" data-day="thu">
          <span class="font-label-sm text-[10px] uppercase">Thu</span>
          <span class="font-label-md text-label-md font-semibold mt-1">11</span>
          <span class="w-1.5 h-1.5 rounded-full bg-secondary mt-1"></span>
        </button>
        <button class="day-btn flex flex-col items-center py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" data-day="fri">
          <span class="font-label-sm text-[10px] uppercase">Fri</span>
          <span class="font-label-md text-label-md font-semibold mt-1">12</span>
        </button>
        <button class="day-btn flex flex-col items-center py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" data-day="sat">
          <span class="font-label-sm text-[10px] uppercase">Sat</span>
          <span class="font-label-md text-label-md font-semibold mt-1">13</span>
          <span class="w-1.5 h-1.5 rounded-full bg-primary-container mt-1"></span>
        </button>
        <button class="day-btn flex flex-col items-center py-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant" data-day="sun">
          <span class="font-label-sm text-[10px] uppercase">Sun</span>
          <span class="font-label-md text-label-md font-semibold mt-1">14</span>
        </button>
      </div>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button class="event-filter px-4 py-2 rounded-full bg-secondary text-on-secondary font-label-md text-label-md transition-colors shadow-sm active" data-filter="all">All Events</button>
      <button class="event-filter px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors" data-filter="academic">Academic</button>
      <button class="event-filter px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors" data-filter="social">Social</button>
      <button class="event-filter px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors" data-filter="career">Career</button>
      <button class="event-filter px-4 py-2 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors" data-filter="workshop">Workshop</button>
    </div>

    <!-- Events Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">

      <!-- Event 1 -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
        <div class="relative h-40 bg-gradient-to-br from-secondary to-primary-container flex items-end p-4">
          <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <p class="font-label-sm text-label-sm font-bold text-on-surface">APR</p>
            <p class="font-headline-md text-headline-md font-bold text-secondary text-center">10</p>
          </div>
          <div class="text-on-secondary">
            <span class="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-semibold">Workshop</span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-headline-md text-headline-md text-on-surface font-semibold mb-2 text-[18px]">AI in Healthcare Seminar</h3>
          <div class="space-y-2 mb-4">
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">schedule</span> 3:00 PM – 5:00 PM
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">location_on</span> Auditorium B, Science Building
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">person</span> Prof. Sarah Jenkins
            </p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <img alt="" class="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XGygvrT7G7LV6KJM69BKVnI9JsnuWJxghw36lB6MJ-frQHFgjvTzYfdRJmJbvS7AfN6RpO61skLFWHy8NZMs4wy5L6r5HSgc7Fxfks72pWrqBFdZXs2yBHYu3i5IAQhrAo4Br_fKLcAQigfcmvZZ3M7mRHXHEzRH-1i-H7rtgr620OzVEdQBuUeeQSLujBkq-v13LPL-rPYrVdh9nmGv-j4edSU-Iv9h17b53RQW2fWpnOnIEw40iEo0nuPT58qxNzpDQMLHOGQ"/>
              <img alt="" class="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
              <div class="w-6 h-6 rounded-full border-2 border-surface bg-surface-variant text-on-surface-variant flex items-center justify-center text-[8px] font-bold">+28</div>
            </div>
            <button class="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-secondary-container transition-colors press-scale">
              RSVP
            </button>
          </div>
        </div>
      </div>

      <!-- Event 2 -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
        <div class="relative h-40 bg-gradient-to-br from-primary-container to-surface-tint flex items-end p-4">
          <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <p class="font-label-sm text-label-sm font-bold text-on-surface">APR</p>
            <p class="font-headline-md text-headline-md font-bold text-secondary text-center">11</p>
          </div>
          <div class="text-white">
            <span class="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-semibold">Career</span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-headline-md text-headline-md text-on-surface font-semibold mb-2 text-[18px]">Tech Career Fair 2024</h3>
          <div class="space-y-2 mb-4">
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">schedule</span> 10:00 AM – 4:00 PM
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">location_on</span> Main Exhibition Hall
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">business</span> 25+ Companies
            </p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <img alt="" class="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
              <div class="w-6 h-6 rounded-full border-2 border-surface bg-surface-variant text-on-surface-variant flex items-center justify-center text-[8px] font-bold">+85</div>
            </div>
            <button class="bg-surface-container text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors press-scale flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">bookmark</span> Saved
            </button>
          </div>
        </div>
      </div>

      <!-- Event 3 -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
        <div class="relative h-40 bg-gradient-to-br from-surface-tint to-secondary flex items-end p-4">
          <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <p class="font-label-sm text-label-sm font-bold text-on-surface">APR</p>
            <p class="font-headline-md text-headline-md font-bold text-secondary text-center">13</p>
          </div>
          <div class="text-white">
            <span class="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-semibold">Social</span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-headline-md text-headline-md text-on-surface font-semibold mb-2 text-[18px]">Spring Cultural Festival</h3>
          <div class="space-y-2 mb-4">
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">schedule</span> 12:00 PM – 8:00 PM
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">location_on</span> University Quad & Student Center
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">celebration</span> Cultural Clubs Alliance
            </p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <img alt="" class="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4XGygvrT7G7LV6KJM69BKVnI9JsnuWJxghw36lB6MJ-frQHFgjvTzYfdRJmJbvS7AfN6RpO61skLFWHy8NZMs4wy5L6r5HSgc7Fxfks72pWrqBFdZXs2yBHYu3i5IAQhrAo4Br_fKLcAQigfcmvZZ3M7mRHXHEzRH-1i-H7rtgr620OzVEdQBuUeeQSLujBkq-v13LPL-rPYrVdh9nmGv-j4edSU-Iv9h17b53RQW2fWpnOnIEw40iEo0nuPT58qxNzpDQMLHOGQ"/>
              <img alt="" class="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVhjM381ava6GDrigrKAGbdrcUXTFUmAADo8hHHnN7_DvyZBIXxW2lc3DjWyJPdatk38NduH66SSwgpRXExZvZnBLJqtPp8jpakl6bkDh5WuWm3SZ-dOF8flzUQyfmeY0-JZtQG8zhRsLZWEMCfiwq8l7VkSZXj9ZiCGZSk9kR5Yq__X349j6_0zJEMQGlZ8iXhmx0s6_Uy19MiIaJ88YGJHmJRXnoOQ3XbMa3nevpqZEJEOQzxtrwfVYkqCeR45dMZmwOXdwm8AM"/>
              <div class="w-6 h-6 rounded-full border-2 border-surface bg-surface-variant text-on-surface-variant flex items-center justify-center text-[8px] font-bold">+52</div>
            </div>
            <button class="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-secondary-container transition-colors press-scale">
              RSVP
            </button>
          </div>
        </div>
      </div>

      <!-- Event 4 -->
      <div class="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden hover-lift">
        <div class="relative h-40 bg-gradient-to-br from-amber-400 to-orange-500 flex items-end p-4">
          <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md">
            <p class="font-label-sm text-label-sm font-bold text-on-surface">APR</p>
            <p class="font-headline-md text-headline-md font-bold text-secondary text-center">14</p>
          </div>
          <div class="text-white">
            <span class="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-[11px] font-semibold">Academic</span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-headline-md text-headline-md text-on-surface font-semibold mb-2 text-[18px]">Research Symposium</h3>
          <div class="space-y-2 mb-4">
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">schedule</span> 9:00 AM – 3:00 PM
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">location_on</span> Graduate Research Center
            </p>
            <p class="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant">
              <span class="material-symbols-outlined text-[16px]">science</span> Graduate School
            </p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex -space-x-2">
              <img alt="" class="w-6 h-6 rounded-full border-2 border-surface object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfUhEUaR28wYVTF9ZZGGatNYTBpLsmECoc0hhuS-BMViNORCBgymuQTyvKR0tTmXcrKhbHMjXl7M67NOtlv_FGnS4l7fv8OqEaoC89z6kcEFvn1ksCyjmM-D5Km14cQjglwFX8Vqu6E3VEujc-q_Z8rBgDjX4_hIyH6JnWS-_iLw_npyirIduyXxVepSwzt6t8WJLOu2_jYaYe629qLkFf-JP8rkVgGbIjlO4GL-CCY8OW1PiUFayezTShe1HkvJbqUAE1FBgyRA"/>
              <div class="w-6 h-6 rounded-full border-2 border-surface bg-surface-variant text-on-surface-variant flex items-center justify-center text-[8px] font-bold">+42</div>
            </div>
            <button class="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-secondary-container transition-colors press-scale">
              RSVP
            </button>
          </div>
        </div>
      </div>

    </div>
  </main>`;
}

export function initEvents() {
  // Day selector
  const dayBtns = document.querySelectorAll('.day-btn');
  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dayBtns.forEach(b => {
        b.classList.remove('bg-secondary', 'text-on-secondary');
        b.classList.add('text-on-surface-variant');
      });
      btn.classList.add('bg-secondary', 'text-on-secondary');
      btn.classList.remove('text-on-surface-variant');
    });
  });

  // Event filter chips
  const filterBtns = document.querySelectorAll('.event-filter');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-secondary', 'text-on-secondary', 'active');
        b.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
      btn.classList.add('bg-secondary', 'text-on-secondary', 'active');
    });
  });
}
